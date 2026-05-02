import {useEffect, useState, useCallback} from "react";
import {getProviderProfile} from "src/app/helpers/api/profile";
import {ProviderProfileType} from "src/app/constants/type";

export default function useQueryProvider(userId?: string) {
    const [providerProfile, setProviderProfile] = useState<ProviderProfileType>();
    const [success, setSuccess] = useState<boolean | null>(null); // null: initial, true/false: result

    const loadProviderProfile = useCallback(async () => {
        const providerProfile: ProviderProfileType = await getProviderProfile(userId);
        if (providerProfile.status == 400) {
            setSuccess(false);
        } else {
            setProviderProfile(providerProfile);
            setSuccess(true);
        }
    }, [userId]);

    useEffect(() => {
        loadProviderProfile();
    }, [loadProviderProfile]);

    return {
        providerProfile,
        success,
        loadProviderProfile,
    };
}
