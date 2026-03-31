import { describe, it, expect } from "vitest";
import { PORTS } from "../../app/lib/ports";

describe("PORTS", () => {
  it("contains exactly 4 ports", () => {
    expect(PORTS).toHaveLength(4);
  });

  it("contains all expected port names", () => {
    expect(PORTS).toContain("Bergen");
    expect(PORTS).toContain("Stavanger");
    expect(PORTS).toContain("Kristiansand");
    expect(PORTS).toContain("Hirtshals");
  });

  it("has no duplicates", () => {
    expect(new Set(PORTS).size).toBe(PORTS.length);
  });
});
