// hooks/useUpdateProviderProfile.ts
import { useState } from "react";
import { UpdateProfilePayloadType } from "src/app/constants/type";
import  * as updateProfile from "../helpers/api/profile";


export function useMutateProvider() {
   async function updateProviderProfile(data: UpdateProfilePayloadType) {
        const res = await updateProfile.updateProviderProfile(data);
    }

    return {
        updateProviderProfile
    };
}
