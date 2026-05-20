"use client";

import React from "react";
import { CheckCircle, ClipboardList, Star, SquarePen, ExternalLink, MessageSquare } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logOut } from "src/app/helpers/api/auth";
import {
    CommonDetailType,
    ConsumerProfileType,
    ProfileType,
    ProviderProfileType,
} from "src/app/constants/type";
import { Avatar, Badge, Button } from "@/components/ui";
import { cn } from "@/lib/cn";

const handleLogout = () => {
    logOut();
    redirect("/");
};

function MenuItem({
    label,
    active,
    onClick,
}: {
    label: string;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "text-left text-base transition-colors hover:text-accent",
                active ? "font-semibold text-accent" : "text-text",
            )}
        >
            {label}
        </button>
    );
}

const ProfileCard = ({
    providerProfile,
    consumerProfile,
    commonDetail,
    profileType,
    onProfileTypeChange,
    onIsEditingChange,
    subpage,
    onSubpageChange,
}: {
    providerProfile: ProviderProfileType;
    commonDetail: CommonDetailType;
    consumerProfile: ConsumerProfileType;
    profileType: ProfileType;
    onProfileTypeChange: (profileType: ProfileType) => void;
    isEditing: boolean;
    onIsEditingChange: (value: boolean) => void;
    subpage: string;
    onSubpageChange: (value: string) => void;
}) => {
    if (providerProfile == null || consumerProfile == null) return null;

    return (
        <div className="rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-card">
            <div className="flex flex-col items-center">
                <Avatar src="https://www.gravatar.com/avatar/?d=mp" size="lg" className="mb-4" />
                <h2 className="text-xl font-semibold text-text">{commonDetail.fullName}</h2>

                {profileType === "provider" ? (
                    <ProviderContent
                        providerProfile={providerProfile}
                        onIsEditingChange={onIsEditingChange}
                        subpage={subpage}
                        onSubpageChange={onSubpageChange}
                        onProfileTypeChange={onProfileTypeChange}
                    />
                ) : (
                    <ConsumerContent
                        consumerProfile={consumerProfile}
                        onIsEditingChange={onIsEditingChange}
                        subpage={subpage}
                        onSubpageChange={onSubpageChange}
                    />
                )}
            </div>
        </div>
    );
};

const ProviderContent = ({
    providerProfile,
    onIsEditingChange,
    subpage,
    onSubpageChange,
    onProfileTypeChange,
}: {
    providerProfile: ProviderProfileType;
    onIsEditingChange: (value: boolean) => void;
    subpage: string;
    onSubpageChange: (value: string) => void;
    onProfileTypeChange: (profileType: ProfileType) => void;
}) => {
    const rating = providerProfile.averageRating ?? 0;
    return (
        <>
            {providerProfile.isPremium && (
                <Badge tone="premium" className="mt-3">
                    Premium Candidate
                </Badge>
            )}

            <div className="mt-4 flex w-full flex-col items-start gap-2 text-sm text-text">
                <div className="flex items-center gap-1.5">
                    <Star size={18} className="text-star" fill="currentColor" />
                    <span>{rating} Average rating</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <MessageSquare size={16} className="text-text-muted" />
                    <span>{providerProfile.reviewCount} {providerProfile.reviewCount === 1 ? "Review" : "Reviews"}</span>
                </div>
            </div>

            <div className="mt-6 flex w-full flex-col items-start gap-4">
                <MenuItem label="My dashboard" active={subpage === "dashboard"} onClick={() => onSubpageChange("dashboard")} />
                <Link
                    href={{
                        pathname: "/profile/your-plan",
                        query: { isSubscriptionActive: providerProfile.isSubscriptionActive?.toString() },
                    }}
                    className="text-base text-text hover:text-accent"
                >
                    Premium Subscriptions
                </Link>
                <MenuItem label="Performance" active={subpage === "performance"} onClick={() => onSubpageChange("performance")} />
                <MenuItem label="Payment Methods" active={subpage === "payment-methods"} onClick={() => onSubpageChange("payment-methods")} />
                <MenuItem
                    label="Personal Information"
                    onClick={() => {
                        onProfileTypeChange("consumer");
                        onSubpageChange("profile");
                    }}
                />
                <MenuItem label="Log out" onClick={handleLogout} />
            </div>

            <div className="mt-6 flex w-full flex-col gap-2">
                <Button variant="outline" className="text-accent" onClick={() => onIsEditingChange(true)}>
                    <SquarePen size={16} />
                    Edit profile
                </Button>
                <Link href="/profile/public">
                    <Button variant="outline" fullWidth>
                        <ExternalLink size={16} />
                        View public profile
                    </Button>
                </Link>
            </div>
        </>
    );
};

const ConsumerContent = ({
    onIsEditingChange,
    subpage,
    onSubpageChange,
    consumerProfile,
}: {
    onIsEditingChange: (value: boolean) => void;
    subpage: string;
    onSubpageChange: (value: string) => void;
    consumerProfile: ConsumerProfileType;
}) => {
    return (
        <>
            <div className="mt-4 flex w-full flex-col items-start gap-2 text-sm text-text">
                <div className="flex items-center gap-1.5">
                    <ClipboardList size={18} className="text-star" />
                    <span>
                        {consumerProfile.requestsPosted} {consumerProfile.requestsPosted === 1 ? "Job" : "Jobs"} posted
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <CheckCircle size={16} className="text-success" />
                    <span>{consumerProfile.requestsCompleted} completed</span>
                </div>
            </div>

            <div className="mt-8 flex w-full flex-col items-start gap-4">
                <MenuItem label="Profile" active={subpage === "profile"} onClick={() => onSubpageChange("profile")} />
                <MenuItem label="Payment methods" active={subpage === "payment-methods"} onClick={() => onSubpageChange("payment-methods")} />
                <MenuItem label="Notifications" active={subpage === "notifications"} onClick={() => onSubpageChange("notifications")} />
                <MenuItem label="Log out" onClick={handleLogout} />
            </div>

            <div className="mt-8 w-full">
                <Button variant="outline" fullWidth className="text-accent" onClick={() => onIsEditingChange(true)}>
                    <SquarePen size={16} />
                    Edit profile
                </Button>
            </div>
        </>
    );
};

export default ProfileCard;
