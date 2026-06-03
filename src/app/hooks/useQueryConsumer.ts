import { useEffect, useState, useCallback } from "react";
import { getConsumerProfile } from "src/app/helpers/api/profile";
import { ConsumerProfileType } from "src/app/constants/type";

export default function useQueryConsumer(userId?: string) {
    const [consumerProfile, setConsumerProfile] = useState<ConsumerProfileType>();
    const [success, setSuccess] = useState<boolean | null>(null);

    const loadConsumerProfile = useCallback(async () => {
        try {
            const profile: ConsumerProfileType = await getConsumerProfile(userId);
            setConsumerProfile(profile);
            setSuccess(true);
        } catch (error: any) {
            if (error?.response?.status === 400) {
                console.error("Bad Request (400):", error.response.data);
            } else {
                console.error("Failed to load consumer profile:", error);
            }
            setSuccess(false);
        }
    }, [userId]);

    useEffect(() => {
        loadConsumerProfile();
    }, [loadConsumerProfile]);

    return {
        consumerProfile,
        success,
        loadConsumerProfile,
    };
}
