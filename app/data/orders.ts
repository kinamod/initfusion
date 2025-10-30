export interface Order {
  id: string;
  customerId: string;
  customer: string;
  vendor: string;
  estimatedArrival: number;
  status: "confirmed" | "en-route" | "near-delivery";
  riderStatus: "assigned" | "en-route" | "arriving";
  distanceRemaining: number;
  location: string;
}

export const sampleOrders: Order[] = [
  {
    id: "DHX-2024-00157",
    customerId: "CUST-4521",
    customer: "Sarah Anderson",
    vendor: "Thai Palace",
    estimatedArrival: 12,
    status: "en-route",
    riderStatus: "en-route",
    distanceRemaining: 2.3,
    location: "Downtown",
  },
  {
    id: "DHX-2024-00158",
    customerId: "CUST-4522",
    customer: "James Mitchell",
    vendor: "Fresh Groceries Co.",
    estimatedArrival: 8,
    status: "near-delivery",
    riderStatus: "arriving",
    distanceRemaining: 0.5,
    location: "Midtown East",
  },
  {
    id: "DHX-2024-00159",
    customerId: "CUST-4523",
    customer: "Emily Rodriguez",
    vendor: "Burger Express",
    estimatedArrival: 25,
    status: "confirmed",
    riderStatus: "assigned",
    distanceRemaining: 8.7,
    location: "Westside",
  },
  {
    id: "DHX-2024-00160",
    customerId: "CUST-4524",
    customer: "David Chen",
    vendor: "Sushi Master",
    estimatedArrival: 18,
    status: "en-route",
    riderStatus: "en-route",
    distanceRemaining: 4.2,
    location: "Arts District",
  },
  {
    id: "DHX-2024-00161",
    customerId: "CUST-4525",
    customer: "Lisa Thompson",
    vendor: "Espresso Corner",
    estimatedArrival: 5,
    status: "near-delivery",
    riderStatus: "arriving",
    distanceRemaining: 0.3,
    location: "Financial District",
  },
  {
    id: "DHX-2024-00162",
    customerId: "CUST-4526",
    customer: "Marcus Johnson",
    vendor: "Pizza Kingdom",
    estimatedArrival: 32,
    status: "confirmed",
    riderStatus: "assigned",
    distanceRemaining: 11.5,
    location: "Riverside",
  },
];
