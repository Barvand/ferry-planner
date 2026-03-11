const BASE_ROUTES = [
  { from: "Hirtshals", to: "Kristiansand", operator: "Fjord Line" },
  { from: "Hirtshals", to: "Stavanger", operator: "Fjord Line" },
  { from: "Stavanger", to: "Bergen", operator: "Fjord Line" },
];

export const ROUTES = [
  ...BASE_ROUTES,
  ...BASE_ROUTES.map((route) => ({
    from: route.to,
    to: route.from,
    operator: route.operator,
  })),
];

export default ROUTES;
