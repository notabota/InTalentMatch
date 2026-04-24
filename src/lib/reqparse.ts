export async function readForm(req: Request): Promise<URLSearchParams> {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json = await req.json();
    const params = new URLSearchParams();
    if (json && typeof json === "object") {
      for (const [k, v] of Object.entries(json as Record<string, unknown>)) {
        if (v === undefined || v === null) continue;
        if (Array.isArray(v)) {
          for (const item of v) params.append(k, String(item));
        } else {
          params.append(k, String(v));
        }
      }
    }
    return params;
  }

  if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    const formData = await req.formData();
    const params = new URLSearchParams();
    for (const [k, v] of formData.entries()) {
      params.append(k, typeof v === "string" ? v : v.name);
    }
    return params;
  }

  const text = await req.text();
  try {
    const json = JSON.parse(text);
    const params = new URLSearchParams();
    if (json && typeof json === "object") {
      for (const [k, v] of Object.entries(json as Record<string, unknown>)) {
        if (v === undefined || v === null) continue;
        params.append(k, String(v));
      }
    }
    return params;
  } catch {
    return new URLSearchParams();
  }
}

export function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function parseNumber(value: string | null): number | null {
  if (value === null || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

export function parseBool(value: string | null): boolean | null {
  if (value === null) return null;
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  return null;
}
