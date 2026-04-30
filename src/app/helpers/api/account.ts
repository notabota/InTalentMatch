import { UpdateAccountType } from "src/app/constants/type";
import { fetchApi } from "./request";

export async function updateAccountInfo({ fullName, phoneNumber, address }: UpdateAccountType) {
    const response = await fetchApi({
        path: "/Account",
        method: "PATCH",
        data: { fullName, phoneNumber, address },
    });

    if (response.ok) {
        window.location.reload();
    } else {
        console.error("Error saving profile:", response.statusText);
    }
}

interface LoginInput { email: string; password: string; isPersistent?: boolean }
export async function login(input: LoginInput) {
    return fetchApi({ path: "/Account/Login", method: "POST", data: input });
}

interface RegisterInput { email: string; password: string; fullName?: string }
export async function register(input: RegisterInput) {
    return fetchApi({ path: "/Account/Register", method: "POST", data: input });
}

export async function forgotPassword(email: string) {
    return fetchApi({ path: "/Account/ForgotPassword", method: "POST", data: { email } });
}

export async function resetPassword(token: string, password: string) {
    return fetchApi({
        path: "/Account/ResetPassword",
        method: "POST",
        data: { token, password },
    });
}

export async function confirmEmail(token: string) {
    return fetchApi({ path: "/Account/ConfirmEmail", method: "POST", data: { token } });
}

export async function resendEmailConfirmation(email: string) {
    return fetchApi({
        path: "/Account/ResendEmailConfirmation",
        method: "POST",
        data: { email },
    });
}
