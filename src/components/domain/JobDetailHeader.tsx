import React from "react";
import { IconText } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface JobDetailInfo {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

export interface JobDetailHeaderProps {
    title: string;
    actions?: React.ReactNode;
    info: JobDetailInfo[];
    children?: React.ReactNode;
    className?: string;
}

export function JobDetailHeader({ title, actions, info, children, className }: JobDetailHeaderProps) {
    return (
        <div className={cn("mx-auto max-w-5xl rounded-[var(--radius-card)] bg-surface p-8", className)}>
            <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-bold text-text">{title}</h1>
                {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {info.map((item) => (
                    <IconText key={item.label} icon={item.icon} label={item.label} value={item.value} />
                ))}
            </div>

            {children}
        </div>
    );
}

export default JobDetailHeader;
