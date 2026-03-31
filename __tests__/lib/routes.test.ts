import { describe, it, expect } from "vitest";
import ROUTES from "../../app/lib/routes";

describe("ROUTES", () => {
  it("contains 6 routes (3 base + 3 reverse)", () => {
    expect(ROUTES).toHaveLength(6);
  });

  it("includes all base routes", () => {
    expect(ROUTES).toContainEqual({ from: "Hirtshals", to: "Kristiansand", operator: "Fjord Line" });
    expect(ROUTES).toContainEqual({ from: "Hirtshals", to: "Stavanger", operator: "Fjord Line" });
    expect(ROUTES).toContainEqual({ from: "Stavanger", to: "Bergen", operator: "Fjord Line" });
  });

  it("includes the reverse of every base route", () => {
    expect(ROUTES).toContainEqual({ from: "Kristiansand", to: "Hirtshals", operator: "Fjord Line" });
    expect(ROUTES).toContainEqual({ from: "Stavanger", to: "Hirtshals", operator: "Fjord Line" });
    expect(ROUTES).toContainEqual({ from: "Bergen", to: "Stavanger", operator: "Fjord Line" });
  });

  it("every route has from, to, and operator fields", () => {
    for (const route of ROUTES) {
      expect(route).toHaveProperty("from");
      expect(route).toHaveProperty("to");
      expect(route).toHaveProperty("operator");
    }
  });

  it("no route has the same origin and destination", () => {
    for (const route of ROUTES) {
      expect(route.from).not.toBe(route.to);
    }
  });

  it("preserves the operator when generating reverse routes", () => {
    for (const route of ROUTES) {
      expect(route.operator).toBe("Fjord Line");
    }
  });
});
