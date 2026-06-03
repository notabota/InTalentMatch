"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface RangeSliderProps {
    min: number;
    max: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    className?: string;
}

export function RangeSlider({ min, max, step = 1, value, onChange, className }: RangeSliderProps) {
    const percent = ((value - min) / (max - min)) * 100;
    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={cn("w-full appearance-none cursor-pointer bg-transparent", className)}
            style={{
                background: `linear-gradient(to right, var(--color-primary) ${percent}%, var(--color-primary-soft) ${percent}%)`,
                height: "6px",
                borderRadius: "9999px",
            }}
        />
    );
}

export default RangeSlider;
