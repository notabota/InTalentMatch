"use client";

import React from "react";
import { ProfileType } from "src/app/constants/type";
import { Tabs } from "@/components/ui";

const ProfileToggle = ({
    profileType,
    onProfileTypeChange,
    onSubpageChange,
}: {
    profileType: ProfileType;
    onProfileTypeChange: (profileType: ProfileType) => void;
    subpage: string;
    onSubpageChange: (value: string) => void;
}) => {
    return (
        <Tabs
            className="w-full"
            tabs={[
                { value: "consumer", label: "Employer Profile" },
                { value: "provider", label: "Candidate Profile" },
            ]}
            value={profileType}
            onChange={(value) => {
                onProfileTypeChange(value as ProfileType);
                onSubpageChange(value === "consumer" ? "profile" : "dashboard");
            }}
        />
    );
};

export default ProfileToggle;
