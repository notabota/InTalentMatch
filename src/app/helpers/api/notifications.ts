import { fetchApi } from "./request";

export async function getNotifications() {
    const res = await fetchApi({ path: "/Notification", method: "GET" });
    return res.json();
}

