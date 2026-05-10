"use client";
import React from "react";
import { Code, Briefcase, HeartPulse, GraduationCap, Wrench, Palette, HardHat, Users } from "lucide-react";

const categories = [
    { icon: Code, category: "Software & IT", description: "Development, engineering, data science, cybersecurity" },
    { icon: Briefcase, category: "Business & Finance", description: "Accounting, consulting, banking, management" },
    { icon: HeartPulse, category: "Healthcare", description: "Nursing, medical, pharmaceutical, wellness" },
    { icon: GraduationCap, category: "Education", description: "Teaching, tutoring, training, educational support" },
    { icon: Wrench, category: "Engineering", description: "Civil, mechanical, electrical, chemical engineering" },
    { icon: Palette, category: "Design & Creative", description: "Graphic design, UI/UX, content creation, media" },
    { icon: HardHat, category: "Construction", description: "Project management, trades, architecture, planning" },
    { icon: Users, category: "Administration", description: "Office management, logistics, customer service, HR" },
];

const CategoryCard = ({
    icon: Icon,
    category,
    description,
}: {
    icon: React.ElementType;
    category: string;
    description: string;
}) => (
    <div className="rounded-2xl border border-border bg-white p-6 text-center shadow-card transition-shadow hover:shadow-md">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
            <Icon className="h-6 w-6 text-accent" />
        </div>
        <h3 className="font-semibold text-text">{category}</h3>
        <p className="mt-2 text-sm text-text-muted">{description}</p>
    </div>
);

export default function PopularCategories() {
    return (
        <section className="py-16">
            <div className="text-center">
                <h2 className="font-serif text-4xl font-bold text-primary">Popular Job Categories</h2>
                <p className="mt-3 text-lg text-text-muted">Explore opportunities across top industries</p>
            </div>
            <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 md:grid-cols-4">
                {categories.map((item) => (
                    <CategoryCard key={item.category} icon={item.icon} category={item.category} description={item.description} />
                ))}
            </div>
        </section>
    );
}
