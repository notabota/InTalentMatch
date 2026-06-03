"use client";

import Link from "next/link";
import PrimaryButton from "src/app/components/buttons/PrimaryButton";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { confirmEmail } from "src/app/helpers/api/account";

type Status = "pending" | "success" | "error";

export default function ConfirmEmail() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<Status>("pending");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = searchParams.get("token") ?? searchParams.get("code");
        if (!token) {
            setStatus("error");
            setMessage("Invalid confirmation link.");
            return;
        }
        (async () => {
            const res = await confirmEmail(token);
            if (res.ok) {
                setStatus("success");
            } else {
                const body = await res.json().catch((): null => null);
                setStatus("error");
                setMessage(typeof body === "string" ? body : "Confirmation failed.");
            }
        })();
    }, [searchParams]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-(--color-tertiary) p-8 rounded-[15px] shadow-lg w-2/5 text-center">
                {status === "pending" && (
                    <>
                        <h2 className="text-2xl font-bold">Confirming your email…</h2>
                        <p className="text-gray-700 text-[20px] mt-4">Please wait.</p>
                    </>
                )}
                {status === "success" && (
                    <>
                        <h2 className="text-2xl font-bold">Email Confirmed</h2>
                        <p className="text-gray-700 text-[20px] mt-4 mb-6">
                            Your email has been verified. You may now log in.
                        </p>
                        <Link href="/Account/Login">
                            <PrimaryButton
                                label="Go to Login"
                                width="w-[200px]"
                                borderRadius="rounded-[10px]"
                            />
                        </Link>
                    </>
                )}
                {status === "error" && (
                    <>
                        <h2 className="text-2xl font-bold text-red-600">Confirmation Failed</h2>
                        <p className="text-gray-700 text-[20px] mt-4 mb-6">{message}</p>
                        <Link href="/Account/Login">
                            <PrimaryButton
                                label="Back to Login"
                                width="w-[200px]"
                                borderRadius="rounded-[10px]"
                            />
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
