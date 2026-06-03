import React from "react";
import { Button, Card } from "@/components/ui";

export default function Review({
    title,
    categories,
    location,
    budget,
    date,
    description,
    onBack,
    onSubmit,
}: {
    title: string;
    categories: string[];
    location: string;
    budget: number;
    date: string;
    description: string;
    onBack: () => void;
    onSubmit: () => void;
}) {
    const field = (label: string, value: React.ReactNode, full = false) => (
        <div className={full ? "col-span-2" : ""}>
            <p className="text-sm font-medium text-text-muted">{label}</p>
            <p className="mt-0.5 text-text">{value}</p>
        </div>
    );

    return (
        <Card>
            <h2 className="text-2xl font-bold text-text">Review your job</h2>
            <p className="mt-1 text-text-muted">Make sure everything looks good before posting</p>

            <h3 className="mb-4 mt-8 font-semibold text-text">Job Summary</h3>
            <div className="grid grid-cols-2 gap-4 rounded-[var(--radius-card)] border border-border p-5">
                {field("Title", title)}
                {field("Category", categories.join(", "))}
                {field("Location", location)}
                {field("Budget", `$${budget}`)}
                {field("Due date", date || "Not set")}
                {field("Description", description, true)}
            </div>

            <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button onClick={onSubmit}>Post</Button>
            </div>
        </Card>
    );
}
