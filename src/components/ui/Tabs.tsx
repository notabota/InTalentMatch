"use client";

import React from "react";
import { cn } from "@/lib/cn";

export interface TabsProps {
    tabs: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
    return (
        <div className={cn("inline-flex rounded-xl bg-surface-muted p-1", className)}>
            {tabs.map((tab) => {
                const active = tab.value === value;
                return (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => onChange(tab.value)}
                        className={cn(
                            "rounded-lg px-8 py-2.5 text-base font-medium transition-colors cursor-pointer",
                            active ? "bg-white text-text shadow-card" : "text-text-muted hover:text-text",
                        )}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}

export default Tabs;
