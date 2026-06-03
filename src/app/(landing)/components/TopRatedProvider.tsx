"use client";
import React from "react";
import Link from "next/link";
import { Avatar, Button, Rating } from "@/components/ui";

const candidates = [
    {
        name: "Sarah Johnson",
        role: "Home Cleaning",
        star: 4.9,
        quantity: "124 reviews",
        description: "Professional house cleaner with 5+ years of experience. Specializing in deep cleaning and organization.",
    },
    {
        name: "Mike Thomas",
        role: "Handyman",
        star: 4.8,
        quantity: "87 reviews",
        description: "Licensed handyman with expertise in electrical, plumbing, and general repairs. No job is too small!",
    },
    {
        name: "Emily Wilson",
        role: "Tech Help",
        star: 5,
        quantity: "56 reviews",
        description: "IT professional offering computer repair, networking solutions, and tech support for homes and businesses.",
    },
];

const CandidateCard = ({
    name,
    role,
    star,
    quantity,
    description,
}: {
    name: string;
    role: string;
    star: number;
    quantity: string;
    description: string;
}) => (
    <div className="flex flex-col justify-between rounded-[var(--radius-card)] border border-border p-5 shadow-card">
        <div>
            <div className="flex gap-3">
                <Avatar size="md" />
                <div>
                    <h3 className="text-lg font-semibold text-text">{name}</h3>
                    <p className="text-sm text-text-muted">{role}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                        <Rating value={star} max={1} size={16} />
                        <span className="text-sm font-medium text-text">{star}</span>
                        <span className="text-sm text-text-muted">({quantity})</span>
                    </div>
                </div>
            </div>
            <p className="mt-4 text-sm text-text-muted">{description}</p>
        </div>
        <div className="mt-4 flex gap-3">
            <Button size="sm" className="flex-1 bg-accent hover:bg-accent-hover">
                View Profile
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
                Contact
            </Button>
        </div>
    </div>
);

export default function TopRatedProvider() {
    return (
        <section className="py-16">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <h2 className="font-serif text-4xl font-bold text-primary">Top Candidates</h2>
                    <Link href="/browse-task" className="font-semibold text-accent hover:underline">
                        View All Candidates
                    </Link>
                </div>
                <p className="mt-3 text-lg text-text-muted">
                    Discover highly-rated professionals ready for new opportunities
                </p>

                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {candidates.map((c) => (
                        <CandidateCard key={c.name} {...c} />
                    ))}
                </div>
            </div>
        </section>
    );
}
