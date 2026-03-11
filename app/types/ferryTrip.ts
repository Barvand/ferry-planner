export type FerryLeg = {
  departure_port: string;
  arrival_port: string;
  departure_date: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  operator: string;
  price: string;
  notes?: string;
};

export type FerryTrip = {
  outbound: FerryLeg;
  return: FerryLeg | null;
};
