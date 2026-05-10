"use client";
import React from "react";
import { FilePlus, Users, MessageSquare, CheckCircle2 } from "lucide-react";

const steps = [
    { icon: FilePlus, order: "1", step: "Create Your Profile", description: "Build your candidate or employer profile with your skills, experience, and preferences." },
    { icon: Users, order: "2", step: "Get Matched", description: "Our intelligent matching system connects you with the best-fit opportunities or candidates." },
    { icon: MessageSquare, order: "3", step: "Connect & Interview", description: "Chat directly, schedule interviews, and discuss details with matched profiles." },
    { icon: CheckCircle2, order: "4", step: "Hire or Get Hired", description: "Finalize the match and start building great careers and teams together." },
];

const StepCard = ({
    icon: Icon,
    order,
    step,
    description,
}: {
    icon: React.ElementType;
    order: string;
    step: string;
    description: string;
}) => (
    <div className="rounded-2xl border border-border bg-white p-6 text-center shadow-card transition-shadow hover:shadow-md">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
            <Icon className="h-7 w-7 text-accent" />
        </div>
        <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
            {order}
        </div>
        <h3 className="mb-3 font-semibold text-text">{step}</h3>
        <p className="text-sm text-text-muted">{description}</p>
    </div>
);

export default function HowInTalentMatchWorks() {
    return (
        <section className="bg-surface-muted py-16" id="how-it-works">
            <div className="text-center">
                <h2 className="font-serif text-4xl font-bold text-primary">How InTalentMatch works</h2>
                <p className="mt-3 text-lg text-text-muted">A simple, reliable way to get your tasks done</p>
            </div>
            <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 items-start gap-6 px-6 sm:grid-cols-2 md:grid-cols-4">
                {steps.map((item) => (
                    <StepCard key={item.order} icon={item.icon} order={item.order} step={item.step} description={item.description} />
                ))}
            </div>
        </section>
    );
}
