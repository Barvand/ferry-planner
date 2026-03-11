export type routes = {
  from: string;
  to: string;
  operator: string;
}[];

export type FerryRequest = {
  tripType: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
};