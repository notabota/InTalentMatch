import React from "react";
import { cn } from "@/lib/cn";

export interface IconTextProps {
    icon: React.ReactNode;
    label?: React.ReactNode;
    value: React.ReactNode;
    className?: string;
}

export function IconText({ icon, label, value, className }: IconTextProps) {
    return (
        <div className={cn("flex items-start gap-2", className)}>
            <span className="mt-0.5 text-text-muted shrink-0">{icon}</span>
            <span>
                {label && (
                    <span className="block text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</span>
                )}
                <span className="block font-semibold text-text">{value}</span>
            </span>
        </div>
    );
}

export default IconText;
