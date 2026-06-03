'use client'

import {getApiUrl} from "src/app/helpers/api/url";

export async function fetchApi({
                                   path,
                                   method = "GET",
                                   returnUrl = "/",
                                   data,
                               }: {
    path: string;
    method?: string;
    returnUrl?: string;
    data?: Record<string, any> | string;
}) {
    let url = getApiUrl(path, {returnUrl});
    console.log("🔍 Request URL:", url);
    console.log("📦 Request Method:", method);
    console.log("🧾 Form Data:", data);

    let body: BodyInit | undefined;
    const headers: HeadersInit = {};

    // If GET method, append data as query params (skip undefined values)
    if (method === "GET" && data && typeof data === "object") {
        const params = new URLSearchParams();
        for (const key in data) {
            const value = data[key];
            if (value === undefined || value === null || value == "") continue; // Skip undefined/null values

            if (Array.isArray(value)) {
                value.forEach(item => {
                    if (item !== undefined && item !== null) {
                        params.append(key, item);
                    }
                });
            } else {
                params.append(key, value);
            }
        }

        const queryString = params.toString();
        if (queryString) {
            url += (url.includes('?') ? '&' : '?') + queryString;
        }
    }

    // For non-GET methods, handle body as before
    if (method !== "GET") {
        if (typeof data === "string") {
            body = JSON.stringify(data);
            headers["Content-Type"] = "application/json";
        } else if (typeof data === "object" && data !== null) {
            const formData = new FormData();
            for (const key in data) {
                const value = data[key];
                if (value === undefined || value === null) continue; // Skip undefined/null

                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        if (item !== undefined && item !== null) {
                            formData.append(key, item);
                        }
                    });
                } else {
                    formData.append(key, value);
                }
            }
            body = formData;
        }
    }

    const res = await fetch(url, {
        method,
        credentials: "include",
        body,
        headers,
    });

    return res;
}
