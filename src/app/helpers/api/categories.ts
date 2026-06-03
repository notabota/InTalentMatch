import { fetchApi } from "./request";

export async function getCategories() {
    const res = await fetchApi({ path: "/Category", method: "GET" });
    return res.json();
}

