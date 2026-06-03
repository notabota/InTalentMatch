import React from "react";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button, Badge } from "@/components/ui";
import { cn } from "@/lib/cn";

dayjs.extend(relativeTime);

type StatusTone = "open" | "assigned" | "completed" | "overdue";

export interface JobCardAction {
    label: string;
    href?: string;
    onClick?: () => void;
}

export interface JobCardProps {
    title: string;
    budget: number;
    location?: string | null;
    date?: string | null;
    status?: { label: string; tone: StatusTone };
    action: JobCardAction;
    className?: string;
}

const statusTextTone: Record<StatusTone, string> = {
    open: "text-danger",
    assigned: "text-text",
    completed: "text-success",
    overdue: "text-danger",
};

export function JobCard({ title, budget, location, date, status, action, className }: JobCardProps) {
    const button = (
        <Button size="sm" pill onClick={action.onClick}>
            {action.label}
        </Button>
    );

    return (
        <div className={cn("rounded-2xl bg-surface-muted p-4 shadow-card", className)}>
            <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-text">{title}</h3>
                <span className="text-xl font-bold text-text">${budget}</span>
            </div>

            {location && (
                <div className="mt-2 flex items-center gap-1.5 text-sm text-text">
                    <MapPin className="h-4 w-4 text-text-muted" />
                    {location}
                </div>
            )}
            {date && (
                <div className="mt-1 flex items-center gap-1.5 text-sm text-text">
                    <Calendar className="h-4 w-4 text-text-muted" />
                    {dayjs(date).format("ddd Do, YYYY")}
                </div>
            )}

            <div className={cn("mt-4 flex items-center", status ? "justify-between" : "justify-end")}>
                {status && (
                    <span className={cn("text-sm font-semibold", statusTextTone[status.tone])}>{status.label}</span>
                )}
                {action.href ? <Link href={action.href}>{button}</Link> : button}
            </div>
        </div>
    );
}

export default JobCard;
