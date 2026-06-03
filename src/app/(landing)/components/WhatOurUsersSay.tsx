"use client";
import React from "react";
import { Avatar, Rating } from "@/components/ui";

const testimonials = [
    {
        name: "Jessica Miller",
        role: "Candidate",
        rating: 5,
        quote: "I found my dream role within two weeks on InTalentMatch. The matching was spot-on and the process was so simple.",
    },
    {
        name: "Alex Pham",
        role: "Small Business Owner",
        rating: 5,
        quote: "As a small business owner, I use InTalentMatch to hire reliable talent quickly. It saves my time and connects me with great people.",
    },
];

export default function WhatOurUsersSay() {
    return (
        <section className="bg-surface-muted py-16">
            <div className="mx-auto max-w-5xl px-6 text-center">
                <h2 className="font-serif text-4xl font-bold text-primary">What Our Users Say</h2>
                <p className="mt-3 text-lg text-text-muted">
                    Real experiences from candidates and employers on InTalentMatch
                </p>

                <div className="mt-12 grid grid-cols-1 gap-6 text-left md:grid-cols-2">
                    {testimonials.map((t) => (
                        <div key={t.name} className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-card">
                            <div className="flex items-center gap-3">
                                <Avatar size="md" />
                                <div>
                                    <p className="font-semibold text-text">{t.name}</p>
                                    <p className="text-sm text-text-muted">{t.role}</p>
                                </div>
                            </div>
                            <Rating value={t.rating} className="mt-3" size={16} />
                            <p className="mt-3 text-sm text-text-muted">{t.quote}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
