"use client";

import ProfileToggle from "src/app/(main)/profile/components/ProfileToggle";
import ProfileCard from "src/app/(main)/profile/components/ProfileCard";
import ProfileDetails from "src/app/(main)/profile/components/ProfileDetails";
import {useEffect, useState} from "react";
import {ProfileType} from "src/app/constants/type";
import useQueryProfile from "src/app/hooks/useQueryProfile";
import {useSearchParams} from "next/navigation";
import {useNotifications} from "src/app/hooks/useNotifications";
import {useRouter} from "next/navigation";

export default function Profile() {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [profileType, setProfileType] = useState<ProfileType>(() => {
        if (typeof window !== "undefined") {
            return (localStorage.getItem("profileType") as ProfileType) || "provider";
        }
        return "provider";
    });

    const router = useRouter();

    const {markAllAsSeen} = useNotifications();

    const searchParams = useSearchParams();

    useEffect(() => {
        const subpageParam = searchParams.get("subpage");
        if (subpageParam === "notifications") {
            setProfileType("consumer");
            setSubpage("notifications");
        }
    }, [searchParams]);


    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("profileType", profileType);
        }
    }, [profileType]);

    const [subpage, setSubpage] = useState<string>(profileType == "consumer" ? "profile" : "dashboard");
    const {providerProfile, consumerProfile, commonDetail} = useQueryProfile();

    useEffect(() => {
        if (subpage == "notifications") {
            markAllAsSeen()
        }
    }, [markAllAsSeen, router, subpage]);

    if (!providerProfile || !consumerProfile || !commonDetail) {
        return <div>Loading profile...</div>;
    }


    return (
        <section className="mx-auto max-w-6xl px-6 py-12">
            <h1 className="text-4xl font-bold text-text">My Profile</h1>
            <p className="mt-2 text-text-muted">Manage your account and view your activity</p>

            <div className="mt-6">
                <ProfileToggle
                    profileType={profileType}
                    onProfileTypeChange={setProfileType}
                    subpage={subpage}
                    onSubpageChange={setSubpage}
                />
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
                <ProfileCard
                    providerProfile={providerProfile}
                    consumerProfile={consumerProfile}
                    commonDetail={commonDetail}
                    profileType={profileType}
                    onProfileTypeChange={setProfileType}
                    isEditing={isEditing}
                    onIsEditingChange={setIsEditing}
                    subpage={subpage}
                    onSubpageChange={setSubpage}
                />
                <div className="md:col-span-2">
                    <ProfileDetails
                        providerProfile={providerProfile}
                        commonDetail={commonDetail}
                        profileType={profileType}
                        isEditing={isEditing}
                        onIsEditingChange={setIsEditing}
                        subpage={subpage}
                        onSubpageChange={setSubpage}
                    />
                </div>
            </div>
        </section>
    );
}
