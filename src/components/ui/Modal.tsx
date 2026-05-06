"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    showClose?: boolean;
    tone?: "white" | "soft";
}

export function Modal({ open, onClose, children, className, showClose = false, tone = "soft" }: ModalProps) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                className={cn(
                    "relative w-full max-w-2xl rounded-[var(--radius-card)] p-8 shadow-card",
                    tone === "soft" ? "bg-surface" : "bg-white",
                    className,
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {showClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute right-5 top-5 text-accent hover:text-accent-hover cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
                {children}
            </div>
        </div>
    );
}

export default Modal;
