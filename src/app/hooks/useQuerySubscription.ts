import {useEffect, useState} from "react";
import { getProviderProfile } from "src/app/helpers/api/profile";
import { ProviderProfileType } from "src/app/constants/type";

export default function useQuerySubscription() {
  const [providerProfile, setProviderProfile] = useState<ProviderProfileType>()
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  useEffect(() => {
      loadSubscription();
  }, [])
  async function loadSubscription() {
    const profileData: ProviderProfileType = await getProviderProfile();
    setProviderProfile(profileData);
    setIsSubscriptionActive(profileData.isSubscriptionActive);
  }
  return {
    providerProfile,
    isSubscriptionActive,
    loadSubscription
  };
}