import { describe, it, expect } from "vitest";
import { formatDate } from "../../app/lib/utils";

describe("formatDate", () => {
  it("returns a string", () => {
    expect(typeof formatDate("2026-03-31")).toBe("string");
  });

  it("includes the year", () => {
    expect(formatDate("2026-03-31")).toContain("2026");
  });

  it("includes the day number", () => {
    expect(formatDate("2026-03-31")).toContain("31");
  });

  it("formats different dates differently", () => {
    expect(formatDate("2026-03-31")).not.toBe(formatDate("2026-04-01"));
  });

  it("treats the date as UTC to avoid timezone shifts", () => {
    // The function appends 'Z' to ensure UTC parsing — result must still contain year
    expect(formatDate("2026-01-01")).toContain("2026");
  });
});
