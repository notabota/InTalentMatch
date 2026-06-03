"use client";
import React, { useState } from "react";
import { Star, MapPin, CheckCircle, Circle } from "lucide-react";
import useQueryProfile from "src/app/hooks/useQueryProfile";
import { useSearchParams } from "next/navigation";
import { Avatar, Chip } from "@/components/ui";

export default function Profile() {
    const [showAllJobs, setShowAllJobs] = useState(false);
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");

    const { providerProfile, consumerProfile, providerProfileSuccess, consumerProfileSuccess } =
        useQueryProfile(userId);

    if (!providerProfileSuccess || !consumerProfileSuccess) {
        return <h1 className="text-center text-xl font-bold text-danger">Invalid profile</h1>;
    }
    if (!providerProfile || !consumerProfile) {
        return <div className="text-center text-xl font-semibold">Loading...</div>;
    }

    const visibleJobs = showAllJobs
        ? providerProfile.completedRequests
        : providerProfile.completedRequests.slice(0, 4);

    return (
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 rounded-[var(--radius-card)] bg-surface p-8 md:grid-cols-2">
            <div className="space-y-8">
                <Avatar src="https://www.gravatar.com/avatar/?d=mp" size="xl" className="mx-auto md:mx-0" />

                <div>
                    <h3 className="mb-1 text-base font-semibold text-accent">ABOUT ME</h3>
                    <p className="text-sm text-text">{providerProfile.description || "No description available."}</p>
                </div>

                <div>
                    <h3 className="mb-2 text-base font-semibold text-accent">SKILLS</h3>
                    <div className="flex flex-wrap gap-2">
                        {providerProfile.categories.map((cat) => (
                            <Chip key={cat.id}>{cat.name}</Chip>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-10 py-2">
                <div>
                    <h1 className="text-4xl font-bold text-text">{consumerProfile.name}</h1>
                    <p className="text-xl font-medium text-accent">
                        {providerProfile.isPremium ? "Premium Candidate" : "Candidate"}
                    </p>
                    <div className="mt-2 flex flex-col gap-2 text-lg text-text">
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-star" fill="currentColor" />
                            {providerProfile.averageRating ? providerProfile.averageRating.toFixed(1) : "0.0"} (
                            {providerProfile.reviewCount} reviews)
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-danger" />
                            {providerProfile.address || "-"}
                        </div>
                        <div className="flex items-center gap-2">
                            <Circle className="h-4 w-4 fill-success text-success" />
                            Available
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="mb-2 text-base font-semibold text-accent">JOBS COMPLETED</h3>
                    <ul className="space-y-4">
                        {visibleJobs.map((job, idx) => (
                            <li key={idx} className="text-sm">
                                <p className="font-semibold text-text">{job.title}</p>
                                <p className="text-text-muted">
                                    {job.location} - {new Date(job.completedDate).toLocaleDateString()}
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-text">
                                    <CheckCircle className="h-4 w-4 text-success" />
                                    Completed
                                </div>
                                {idx < visibleJobs.length - 1 && <hr className="mt-3 w-60 border-t border-border" />}
                            </li>
                        ))}
                    </ul>
                    {providerProfile.completedRequests.length > 4 && (
                        <button
                            onClick={() => setShowAllJobs(!showAllJobs)}
                            className="mt-2 text-sm font-medium text-accent"
                        >
                            {showAllJobs ? "Show less" : "View more jobs"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
