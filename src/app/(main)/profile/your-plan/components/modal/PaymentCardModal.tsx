"use client";

import React from "react";
import { PaymentReceiveCardType } from "src/app/constants/type";
import { Modal } from "@/components/ui";

type PaymentCardModalProps = {
    cards: PaymentReceiveCardType[];
    onClose: () => void;
    onSelect: (paymentMethod: string) => void;
};

export default function PaymentCardModal({ cards, onClose, onSelect }: PaymentCardModalProps) {
    return (
        <Modal open onClose={onClose} showClose tone="white" className="max-w-md">
            <h2 className="mb-4 text-center text-xl font-semibold text-text">Choose a payment method</h2>

            <div className="max-h-60 space-y-3 overflow-y-auto">
                {cards.length === 0 && (
                    <p className="text-center text-sm text-text-muted">
                        No saved cards found. Please add one to continue.
                    </p>
                )}

                {cards.map((card) => (
                    <div
                        key={card.id}
                        className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-4 transition hover:border-accent"
                        onClick={() => onSelect(card.id)}
                    >
                        <div>
                            <p className="text-sm font-medium text-text">**** **** **** {card.number.slice(-4)}</p>
                            <p className="text-xs text-text-muted">{card.name}</p>
                            <p className="text-xs text-text-muted">Expires {card.expiry}</p>
                        </div>
                        <span className="text-sm font-bold text-accent">Select</span>
                    </div>
                ))}
            </div>
        </Modal>
    );
}
