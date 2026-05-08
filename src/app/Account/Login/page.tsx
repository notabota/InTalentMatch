"use client";

import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "src/app/helpers/api/account";
import { Button, Input, Modal } from "@/components/ui";

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const error = searchParams.get("error");
        if (error) {
            setErrorMessage(decodeURIComponent(error));
            setShowErrorModal(true);
        }
    }, [searchParams]);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const email = String(fd.get("email") ?? "");
        const password = String(fd.get("password") ?? "");

        setIsSubmitting(true);
        const res = await login({ email, password });
        setIsSubmitting(false);

        if (res.ok) {
            const returnUrl = searchParams.get("returnUrl") ?? "/home";
            router.push(returnUrl);
            router.refresh();
        } else {
            const body = await res.json().catch((): null => null);
            setErrorMessage(typeof body === "string" ? body : "Invalid email or password.");
            setShowErrorModal(true);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-16">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-xl rounded-[var(--radius-card)] bg-primary-soft p-10"
            >
                <h1 className="text-center font-serif text-4xl font-bold text-primary">Log in</h1>
                <p className="mb-8 mt-2 text-center text-primary/70">
                    Enter your credentials to access your account
                </p>

                <label className="mb-1.5 block text-lg font-semibold text-text">Email</label>
                <Input
                    type="email"
                    name="email"
                    placeholder="example@gmail.com"
                    required
                    leftIcon={<Mail className="h-5 w-5" />}
                    className="mb-6"
                />

                <label className="mb-1.5 block text-lg font-semibold text-text">Password</label>
                <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    leftIcon={<Lock className="h-5 w-5" />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="cursor-pointer"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    }
                    className="mb-8"
                />

                <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Log in"}
                </Button>

                <div className="mt-6 text-center">
                    <Link href="/Account/ForgotPassword" className="font-semibold text-primary hover:underline">
                        Forgot your password?
                    </Link>
                </div>
                <p className="mt-3 text-center text-text">
                    Don&apos;t have an account?{" "}
                    <Link href="/Account/Register" className="font-bold text-accent hover:underline">
                        Sign up
                    </Link>
                </p>
            </form>

            <Modal open={showErrorModal} onClose={() => setShowErrorModal(false)} tone="white" className="max-w-md text-center">
                <h2 className="font-serif text-2xl font-bold text-danger">Login Error</h2>
                <p className="mt-4 text-text">{errorMessage}</p>
                <Button variant="danger" className="mt-6" onClick={() => setShowErrorModal(false)}>
                    Close
                </Button>
            </Modal>
        </div>
    );
}
