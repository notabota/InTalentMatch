"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export interface RatingProps {
    value: number;
    max?: number;
    size?: number;
    editable?: boolean;
    onChange?: (value: number) => void;
    className?: string;
}

export function Rating({ value, max = 5, size = 18, editable = false, onChange, className }: RatingProps) {
    return (
        <span className={cn("inline-flex items-center gap-1", className)}>
            {Array.from({ length: max }, (_, i) => {
                const filled = i < Math.round(value);
                const star = (
                    <Star
                        className={filled ? "text-star" : "text-border"}
                        fill={filled ? "currentColor" : "none"}
                        width={size}
                        height={size}
                    />
                );
                if (!editable) return <span key={i}>{star}</span>;
                return (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onChange?.(i + 1)}
                        className="cursor-pointer"
                        aria-label={`Rate ${i + 1}`}
                    >
                        {star}
                    </button>
                );
            })}
        </span>
    );
}

export default Rating;
