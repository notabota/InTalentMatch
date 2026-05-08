"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "src/app/helpers/api/account";
import { Button, Input, Modal } from "@/components/ui";

export default function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [token, setToken] = useState("");

    useEffect(() => {
        const t = searchParams.get("token") ?? searchParams.get("code") ?? "";
        setToken(t);
        const error = searchParams.get("error");
        if (error) {
            setErrorMessage(error);
            setShowErrorModal(true);
        }
    }, [searchParams]);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!token) {
            setErrorMessage("Reset link is invalid or expired.");
            setShowErrorModal(true);
            return;
        }
        setIsSubmitting(true);
        const res = await resetPassword(token, password);
        setIsSubmitting(false);
        if (res.ok) {
            router.push("/Account/ResetPasswordConfirmation");
        } else {
            const body = await res.json().catch((): null => null);
            setErrorMessage(typeof body === "string" ? body : "Reset failed.");
            setShowErrorModal(true);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-16">
            <form onSubmit={onSubmit} className="w-full max-w-xl rounded-[var(--radius-card)] bg-primary-soft p-10">
                <h1 className="text-center font-serif text-4xl font-bold text-primary">Reset password</h1>
                <p className="mb-8 mt-2 text-center text-primary/70">
                    Please set a new password for your account.
                </p>

                <label className="mb-1.5 block text-lg font-semibold text-text">Password</label>
                <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                    leftIcon={<Lock className="h-5 w-5" />}
                    rightIcon={
                        <button type="button" onClick={() => setShowPassword((v) => !v)} className="cursor-pointer" aria-label="Toggle password">
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    }
                    className="mb-5"
                />

                <label className="mb-1.5 block text-lg font-semibold text-text">Confirm Password</label>
                <Input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    onChange={(e) =>
                        e.target.setCustomValidity(e.target.value === password ? "" : "Passwords do not match.")
                    }
                    leftIcon={<Lock className="h-5 w-5" />}
                    rightIcon={
                        <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="cursor-pointer" aria-label="Toggle password">
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    }
                    className="mb-8"
                />

                <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
                    {isSubmitting ? "Resetting..." : "Reset password"}
                </Button>
            </form>

            <Modal open={showErrorModal} onClose={() => setShowErrorModal(false)} tone="white" className="max-w-md text-center">
                <h2 className="font-serif text-2xl font-bold text-danger">Password Reset Error</h2>
                <p className="mt-4 text-text">{errorMessage}</p>
                <Button variant="danger" className="mt-6" onClick={() => setShowErrorModal(false)}>
                    Close
                </Button>
            </Modal>
        </div>
    );
}
