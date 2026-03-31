import { describe, it, expect } from "vitest";
import { TRIPS } from "../../app/lib/trips";

const VALID_PORTS = ["Bergen", "Stavanger", "Kristiansand", "Hirtshals"];
const VALID_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const TIME_REGEX = /^\d{2}:\d{2}$/;
const PRICE_REGEX = /^\d+ NOK$/;

describe("TRIPS", () => {
  it("contains 8 trips", () => {
    expect(TRIPS).toHaveLength(8);
  });

  it("all trips have unique IDs", () => {
    const ids = TRIPS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all trips have required fields", () => {
    for (const trip of TRIPS) {
      expect(trip).toHaveProperty("id");
      expect(trip).toHaveProperty("from");
      expect(trip).toHaveProperty("to");
      expect(trip).toHaveProperty("departure_time");
      expect(trip).toHaveProperty("arrival_time");
      expect(trip).toHaveProperty("duration");
      expect(trip).toHaveProperty("operator");
      expect(trip).toHaveProperty("price");
      expect(trip).toHaveProperty("days");
    }
  });

  it("all trip ports are valid", () => {
    for (const trip of TRIPS) {
      expect(VALID_PORTS).toContain(trip.from);
      expect(VALID_PORTS).toContain(trip.to);
    }
  });

  it("no trip departs and arrives at the same port", () => {
    for (const trip of TRIPS) {
      expect(trip.from).not.toBe(trip.to);
    }
  });

  it("all departure and arrival times are in HH:MM format", () => {
    for (const trip of TRIPS) {
      expect(trip.departure_time).toMatch(TIME_REGEX);
      expect(trip.arrival_time).toMatch(TIME_REGEX);
    }
  });

  it("all prices are in NOK format", () => {
    for (const trip of TRIPS) {
      expect(trip.price).toMatch(PRICE_REGEX);
    }
  });

  it("all scheduled days are valid weekday names", () => {
    for (const trip of TRIPS) {
      expect(trip.days.length).toBeGreaterThan(0);
      for (const day of trip.days) {
        expect(VALID_DAYS).toContain(day);
      }
    }
  });

  it("each route has a matching reverse trip", () => {
    for (const trip of TRIPS) {
      const reverse = TRIPS.find((t) => t.from === trip.to && t.to === trip.from);
      expect(reverse).toBeDefined();
    }
  });
});
