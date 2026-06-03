// hooks/useUpdateProviderProfile.ts
import {useState} from "react";
import {UpdateAccountType} from "src/app/constants/type";
import * as accountApi from "../helpers/api/account";


export function useMutateAccount() {
    async function updateAccountInfo(data: UpdateAccountType) {
        const res = await accountApi.updateAccountInfo(data);
    }

    async function resendEmailConfirmation(email: string) {
        const res = await accountApi.resendEmailConfirmation(email);
        return res;
    }

    async function confirmEmail(token: string) {
        const res = await accountApi.confirmEmail(token);
        return res;
    }

    return {
        updateAccountInfo,
        resendEmailConfirmation,
        confirmEmail
    };

}
