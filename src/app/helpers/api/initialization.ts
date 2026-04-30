import {fetchApi} from "src/app/helpers/api/request";

export async function initiateProfile() {
    await fetchApi({
        path: "/Profile/Provider",
        method: "POST",
        returnUrl: "/"
    });
    await fetchApi({
        path: "/Profile/Consumer",
        method: "POST",
        returnUrl: "/"
    });
}
