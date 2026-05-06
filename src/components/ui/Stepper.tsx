import React from "react";
import { cn } from "@/lib/cn";

export interface StepperProps {
    steps: string[];
    current: number;
    className?: string;
}

export function Stepper({ steps, current, className }: StepperProps) {
    return (
        <div className={cn("flex items-center justify-center", className)}>
            {steps.map((label, i) => {
                const active = i <= current;
                const isLast = i === steps.length - 1;
                return (
                    <React.Fragment key={label}>
                        <div className="flex items-center gap-3">
                            <span
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                                    active ? "bg-primary text-white" : "border border-border text-text-muted",
                                )}
                            >
                                {i + 1}
                            </span>
                            <span className={cn("font-semibold", active ? "text-accent" : "text-text")}>{label}</span>
                        </div>
                        {!isLast && <span className="mx-4 h-px w-16 bg-border md:w-24" />}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default Stepper;
