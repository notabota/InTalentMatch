import React from "react";
import { cn } from "@/lib/cn";

type Tone = "white" | "soft" | "muted";

const toneClasses: Record<Tone, string> = {
    white: "bg-white border border-border",
    soft: "bg-surface",
    muted: "bg-surface-muted",
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    tone?: Tone;
    padded?: boolean;
}

export function Card({ tone = "white", padded = true, className, children, ...rest }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-[var(--radius-card)]",
                toneClasses[tone],
                tone === "white" && "shadow-card",
                padded && "p-6",
                className,
            )}
            {...rest}
        >
            {children}
        </div>
    );
}

export default Card;
