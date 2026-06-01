import { describe, it, expect } from "vitest";
import { parseBool, parseDate, parseNumber, readForm } from "@/lib/reqparse";

describe("parseBool", () => {
  it("parses true / false strings", () => {
    expect(parseBool("true")).toBe(true);
    expect(parseBool("false")).toBe(false);
    expect(parseBool("TRUE")).toBe(true);
  });

  it("returns null for malformed input", () => {
    expect(parseBool("yes")).toBeNull();
    expect(parseBool("")).toBeNull();
    expect(parseBool(null)).toBeNull();
  });
});

describe("parseNumber", () => {
  it("parses numeric strings", () => {
    expect(parseNumber("42")).toBe(42);
    expect(parseNumber("3.14")).toBeCloseTo(3.14);
  });

  it("returns null for empty or non-numeric input", () => {
    expect(parseNumber("")).toBeNull();
    expect(parseNumber(null)).toBeNull();
    expect(parseNumber("not-a-number")).toBeNull();
  });
});

describe("parseDate", () => {
  it("parses ISO 8601 strings", () => {
    const d = parseDate("2026-01-15T12:00:00Z");
    expect(d).toBeInstanceOf(Date);
    expect(d?.toISOString()).toBe("2026-01-15T12:00:00.000Z");
  });

  it("returns null for malformed input", () => {
    expect(parseDate("nope")).toBeNull();
    expect(parseDate(null)).toBeNull();
  });
});

describe("readForm", () => {
  it("reads JSON bodies", async () => {
    const req = new Request("http://localhost/x", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "alice@example.com", n: 1 }),
    });
    const form = await readForm(req);
    expect(form.get("email")).toBe("alice@example.com");
    expect(form.get("n")).toBe("1");
  });

  it("reads urlencoded bodies", async () => {
    const req = new Request("http://localhost/x", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "email=alice%40example.com&n=2",
    });
    const form = await readForm(req);
    expect(form.get("email")).toBe("alice@example.com");
    expect(form.get("n")).toBe("2");
  });
});
