function joinPaths(...segments: string[]) {
    return segments
        .filter(Boolean)
        .map((s, i) => {
            if (i === 0) return s.replace(/\/+$/, '');
            return s.replace(/^\/+|\/+$/g, '');
        })
        .join('/');
}

export function getApiUrl(path: string, query?: Record<string, string>): string {
    const [rawPath, rawQuery = ""] = path.split("?");
    const url = new URL(joinPaths('/api', rawPath.toLowerCase()), getOrigin());

    new URLSearchParams(rawQuery).forEach((value: string, key: string) => {
        url.searchParams.append(key, value);
    });

    const searchParams = new URLSearchParams(query);

    searchParams?.forEach((value: string, key: string) => {
        url.searchParams.append(key, value);
    });

    if (!url.searchParams.has("returnUrl")) {
        url.searchParams.append("returnUrl", "/");
    }

    return url.pathname + (url.search || "");
}

function getOrigin(): string {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    return "http://localhost";
}
