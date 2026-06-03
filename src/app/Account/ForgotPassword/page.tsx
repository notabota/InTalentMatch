"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { forgotPassword } from "src/app/helpers/api/account";
import { Button, Input } from "@/components/ui";

export default function ForgotPassword() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const email = String(fd.get("email") ?? "");
        setIsSubmitting(true);
        await forgotPassword(email);
        setIsSubmitting(false);
        router.push("/Account/ForgotPasswordConfirmation");
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-16">
            <form onSubmit={onSubmit} className="w-full max-w-xl rounded-[var(--radius-card)] bg-primary-soft p-10">
                <h1 className="text-center font-serif text-4xl font-bold text-primary">Reset password</h1>
                <p className="mb-8 mt-2 text-center text-primary/70">
                    Enter your email address and we&apos;ll send you a link to reset your password
                </p>

                <label className="mb-1.5 block text-lg font-semibold text-text">Email</label>
                <Input
                    type="email"
                    name="email"
                    placeholder="example@gmail.com"
                    required
                    leftIcon={<Mail className="h-5 w-5" />}
                    className="mb-8"
                />

                <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send reset link"}
                </Button>

                <p className="mt-4 text-center text-text">
                    Remember your password?{" "}
                    <Link href="/Account/Login" className="font-bold text-accent hover:underline">
                        Back to login
                    </Link>
                </p>
            </form>
        </div>
    );
}
