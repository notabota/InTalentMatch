"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { register } from "src/app/helpers/api/account";
import { Button, Input, Modal } from "@/components/ui";

export default function Signup() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState("");
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
        const fullName = String(fd.get("fullName") ?? "");
        const email = String(fd.get("email") ?? "");
        const passwordValue = String(fd.get("password") ?? "");

        setIsSubmitting(true);
        const res = await register({ email, password: passwordValue, fullName });
        setIsSubmitting(false);

        if (res.ok) {
            router.push("/home");
            router.refresh();
        } else {
            const body = await res.json().catch((): null => null);
            setErrorMessage(typeof body === "string" ? body : "Registration failed.");
            setShowErrorModal(true);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-16">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-xl rounded-[var(--radius-card)] bg-primary-soft p-10"
            >
                <h1 className="text-center font-serif text-4xl font-bold text-primary">Create an account</h1>
                <p className="mb-8 mt-2 text-center text-primary/70">
                    Enter your information to create an account
                </p>

                <label className="mb-1.5 block text-lg font-semibold text-text">Full Name</label>
                <Input
                    type="text"
                    name="fullName"
                    placeholder="Alex Wan"
                    required
                    leftIcon={<User className="h-5 w-5" />}
                    className="mb-5"
                />

                <label className="mb-1.5 block text-lg font-semibold text-text">Email</label>
                <Input
                    type="email"
                    name="email"
                    placeholder="example@gmail.com"
                    required
                    leftIcon={<Mail className="h-5 w-5" />}
                    className="mb-5"
                />

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
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="cursor-pointer"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    }
                    className="mb-5"
                />

                <label className="mb-1.5 block text-lg font-semibold text-text">Confirm Password</label>
                <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    onChange={(e) =>
                        e.target.setCustomValidity(e.target.value === password ? "" : "Passwords do not match.")
                    }
                    leftIcon={<Lock className="h-5 w-5" />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="cursor-pointer"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    }
                    className="mb-8"
                />

                <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create account"}
                </Button>

                <p className="mt-4 text-center text-text">
                    Already have an account?{" "}
                    <Link href="/Account/Login" className="font-bold text-accent hover:underline">
                        Log in
                    </Link>
                </p>
            </form>

            <Modal open={showErrorModal} onClose={() => setShowErrorModal(false)} tone="white" className="max-w-md text-center">
                <h2 className="font-serif text-2xl font-bold text-danger">Sign Up Error</h2>
                <p className="mt-4 text-text">{errorMessage}</p>
                <Button variant="danger" className="mt-6" onClick={() => setShowErrorModal(false)}>
                    Close
                </Button>
            </Modal>
        </div>
    );
}
