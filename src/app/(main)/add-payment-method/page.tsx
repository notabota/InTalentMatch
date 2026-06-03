"use client";

import React, { useCallback, useState } from "react";
import { CreditCard, Calendar, Lock, User, Eye, EyeOff, X } from "lucide-react";
import { PaymentSendCardType } from "src/app/constants/type";
import useMutateCard from "src/app/hooks/useMutateCard";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import Cleave from "cleave.js/react";
import { Button, Modal } from "@/components/ui";

function Field({
    label,
    icon,
    children,
}: {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1.5 block font-semibold text-text">{label}</label>
            <div className="flex items-center gap-2 rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 focus-within:border-accent">
                <span className="text-text-muted">{icon}</span>
                {children}
            </div>
        </div>
    );
}

const fieldInputClass = "flex-1 min-w-0 bg-transparent text-text outline-none placeholder:text-text-muted";

export default function AddPaymentMethod() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCvc, setShowCvc] = useState(false);
    const [formData, setFormData] = useState<PaymentSendCardType>({ number: "", expiry: "", cvv: "", name: "" });
    const { handleAddPayment } = useMutateCard();
    const [formModalMessage, setFormModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("returnUrl");

    const handleInputChange = (field: keyof PaymentSendCardType, value: string) =>
        setFormData((prev) => ({ ...prev, [field]: value }));

    const handleCloseModal = useCallback(() => {
        if (isSuccess) redirect(returnUrl ?? "/profile");
        setShowModal(false);
    }, [isSuccess, returnUrl]);

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const res = await handleAddPayment(formData);
            if (res.success) {
                setFormModalMessage("Payment method added successfully");
                setIsSuccess(true);
            } else if (typeof res.message === "string") {
                setFormModalMessage(res.message);
            } else {
                let errorString = res.message.title;
                for (const error in res.message.errors) {
                    errorString += "\n" + error + ": " + res.message.errors[error];
                }
                setFormModalMessage(errorString);
            }
            setShowModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
            <div className="relative w-full max-w-xl rounded-[var(--radius-card)] bg-surface p-10">
                <button
                    type="button"
                    onClick={() => router.back()}
                    aria-label="Close"
                    className="absolute right-6 top-6 text-accent hover:text-accent-hover"
                >
                    <X className="h-5 w-5" />
                </button>

                <h1 className="text-center text-3xl font-bold text-text">Add payment method</h1>
                <p className="mb-8 mt-2 text-center text-sm text-text-muted">
                    Note: Some payment providers issue a temporary authorization charge.
                </p>

                <div className="space-y-5">
                    <Field label="Card number" icon={<CreditCard className="h-5 w-5" />}>
                        <Cleave
                            name="number"
                            type="tel"
                            options={{ creditCard: true }}
                            placeholder="0123 4567 8901 2345"
                            className={fieldInputClass}
                            value={formData.number}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("number", e.target.value)}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Expiration Date" icon={<Calendar className="h-5 w-5" />}>
                            <Cleave
                                name="expiry"
                                options={{ date: true, datePattern: ["m", "y"] }}
                                placeholder="12/25"
                                className={fieldInputClass}
                                value={formData.expiry}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("expiry", e.target.value)}
                            />
                        </Field>

                        <Field label="CVC" icon={<Lock className="h-5 w-5" />}>
                            <Cleave
                                name="cvv"
                                options={{ blocks: [3], numericOnly: true }}
                                type={showCvc ? "text" : "password"}
                                placeholder="123"
                                className={fieldInputClass}
                                value={formData.cvv}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("cvv", e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => setShowCvc((v) => !v)} className="cursor-pointer text-text-muted" aria-label="Toggle CVC">
                                {showCvc ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </Field>
                    </div>

                    <Field label="Cardholder Name" icon={<User className="h-5 w-5" />}>
                        <input
                            type="text"
                            placeholder="John Johnson"
                            className={fieldInputClass}
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                        />
                    </Field>
                </div>

                <div className="mt-8 flex gap-4">
                    <Button variant="outline" fullWidth onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button fullWidth onClick={handleSubmit} disabled={isSubmitting}>
                        Add
                    </Button>
                </div>
            </div>

            <Modal open={showModal} onClose={handleCloseModal} tone="white" className="max-w-md text-center">
                <p className="whitespace-pre-line text-text">{formModalMessage}</p>
                <Button className="mt-6" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal>
        </div>
    );
}
