"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Check } from "lucide-react";
import PaymentCardModal from "./modal/PaymentCardModal";
import useQuerySubscription from "src/app/hooks/useQuerySubscription";
import { useQueryCards } from "src/app/hooks/useQueryCards";
import useMutateDeActivate from "src/app/hooks/useMutateDeActivate";
import useActivatePremium from "src/app/hooks/useMutateActivate";
import { Button, Modal } from "@/components/ui";
import { cn } from "@/lib/cn";

const standardFeatures = [
    "Everything in free\nKeep 100% of what you earn. No surprise deductions when you complete a job.",
    "Browse Available Jobs\nView and explore open jobs in your area that match your skills.",
    "Apply for Jobs\nSend applications and communicate with employers to secure work.",
    "Ratings & Reviews System\nBuild your reputation with client feedback after completing jobs.",
];

const premiumFeatures = [
    "No Transaction Fees\nKeep 100% of what you earn. No surprise deductions when you complete a job.",
    "Priority in Receiving Job Requests\nBe among the first to see and respond to new jobs in your area, increasing your chances of landing more work.",
    "Early Access to New Features\nBe the first to try and benefit from the latest platform features and tools before anyone else.",
    "Premium Badge on Your Profile\nShow potential employers you're a top-tier candidate and build more trust instantly.",
];

function Features({ features }: { features: string[] }) {
    return (
        <div className="mt-4 space-y-3">
            {features.map((item, index) => {
                const [title, desc] = item.split("\n");
                return (
                    <div key={index} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={3} />
                        <div>
                            <p className="font-medium text-accent">{title}</p>
                            <p className="text-sm text-text-muted">{desc}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function YourPlan() {
    const [showModal, setShowModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const { isSubscriptionActive } = useQuerySubscription();
    const { cards } = useQueryCards();
    const { handlePlanChange, cancelPlanChange, shouldShowModal } = useMutateDeActivate();
    const { handleCardSelect } = useActivatePremium();

    const onSubscribe = useCallback(async () => {
        await handlePlanChange(true);
    }, [handlePlanChange]);

    const onDowngrade = useCallback(async () => {
        await handlePlanChange(false);
        setShowCancelModal(false);
    }, [handlePlanChange]);

    useEffect(() => {
        setShowModal(shouldShowModal);
    }, [shouldShowModal]);

    const planCard = (current: boolean) =>
        cn(
            "rounded-[var(--radius-card)] border p-8 shadow-card transition-colors",
            current ? "border-primary bg-surface" : "border-border bg-white",
        );

    const currentPlanButton = (
        <Button pill disabled variant="ghost" className="bg-surface-muted text-text-muted">
            Your current plan
        </Button>
    );

    return (
        <div className="mx-auto max-w-5xl px-6">
            <h1 className="text-center text-4xl font-bold text-text">Upgrade your plan</h1>
            <p className="mb-10 mt-2 text-center text-text-muted">
                Choose the right plan for your needs and take advantage of our premium features.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
                <div className={planCard(!isSubscriptionActive)}>
                    <div className="flex flex-col items-center">
                        <p className="text-2xl font-semibold text-text">Standard</p>
                        <p className="text-sm text-text-muted">Perfect for beginners</p>
                        <p className="mt-2 text-5xl font-bold text-text">Free</p>
                    </div>
                    <Features features={standardFeatures} />
                    <div className="mt-6 flex justify-center">
                        {!isSubscriptionActive ? (
                            currentPlanButton
                        ) : (
                            <Button pill onClick={() => setShowCancelModal(true)}>
                                Downgrade
                            </Button>
                        )}
                    </div>
                </div>

                <div className={planCard(isSubscriptionActive)}>
                    <div className="flex flex-col items-center">
                        <p className="text-2xl font-semibold text-text">Premium</p>
                        <p className="text-sm text-text-muted">Great for regular users</p>
                        <p className="mt-2 text-4xl font-bold text-text">
                            $8.99
                            <span className="text-base font-semibold">/monthly</span>
                        </p>
                    </div>
                    <Features features={premiumFeatures} />
                    <div className="mt-6 flex justify-center">
                        {isSubscriptionActive ? (
                            currentPlanButton
                        ) : (
                            <Button pill onClick={() => onSubscribe()}>
                                Subscribe
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <Modal open={showCancelModal} onClose={() => setShowCancelModal(false)} className="max-w-md">
                <h2 className="text-center text-xl font-bold text-accent">
                    Are you sure to cancel your Premium Subscription?
                </h2>
                <div className="mt-6 flex justify-end gap-4">
                    <Button variant="ghost" onClick={() => setShowCancelModal(false)}>
                        Close
                    </Button>
                    <Button onClick={() => onDowngrade()}>Yes</Button>
                </div>
            </Modal>

            {showModal && (
                <PaymentCardModal cards={cards} onClose={() => cancelPlanChange()} onSelect={handleCardSelect} />
            )}
        </div>
    );
}
