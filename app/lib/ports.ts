import ROUTES from "./routes";
import type { routes } from "../types/types";

export const PORTS = Array.from(
  new Set(ROUTES.flatMap((route: routes[number]) => [route.from, route.to])),
);
