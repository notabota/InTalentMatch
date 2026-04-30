import {fetchApi} from "src/app/helpers/api/request";

export async function getAccount() {
    const res = await fetchApi({
        path: "/Account",
        method: "GET",
        returnUrl: "/"
    });

    return res;
}

export async function logOut() {
    await fetchApi({
        path: "/Account/Logout",
        method: "POST",
        returnUrl: "/"
    });

}
