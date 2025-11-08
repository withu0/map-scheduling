// Test places for booking form - some within service area, some outside
export interface TestPlace {
  name: string;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
  withinRadius: boolean; // Whether this place is within the service area radius
}

export const testPlaces: TestPlace[] = [
  // Within service area (San Francisco)
  {
    name: "Ferry Building",
    address: "1 Ferry Building, San Francisco, CA 94111",
    coordinates: [-122.3932, 37.7956],
    withinRadius: true,
  },
  {
    name: "Golden Gate Park",
    address: "Golden Gate Park, San Francisco, CA 94117",
    coordinates: [-122.4833, 37.7694],
    withinRadius: true,
  },
  {
    name: "Mission District",
    address: "Mission St & 24th St, San Francisco, CA 94110",
    coordinates: [-122.4194, 37.7528],
    withinRadius: true,
  },
  {
    name: "Fisherman's Wharf",
    address: "Fisherman's Wharf, San Francisco, CA 94133",
    coordinates: [-122.4098, 37.8080],
    withinRadius: true,
  },
  {
    name: "Presidio",
    address: "Presidio of San Francisco, CA 94129",
    coordinates: [-122.4662, 37.7989],
    withinRadius: true,
  },
  // Outside service area
  {
    name: "Oakland Downtown",
    address: "Broadway & 14th St, Oakland, CA 94612",
    coordinates: [-122.2711, 37.8044],
    withinRadius: false,
  },
  {
    name: "Berkeley",
    address: "University Ave & Shattuck Ave, Berkeley, CA 94704",
    coordinates: [-122.2585, 37.8715],
    withinRadius: false,
  },
  {
    name: "San Jose",
    address: "1 N 1st St, San Jose, CA 95113",
    coordinates: [-121.8863, 37.3382],
    withinRadius: false,
  },
  {
    name: "Palo Alto",
    address: "University Ave, Palo Alto, CA 94301",
    coordinates: [-122.1430, 37.4419],
    withinRadius: false,
  },
  {
    name: "Sausalito",
    address: "Bridgeway, Sausalito, CA 94965",
    coordinates: [-122.4852, 37.8591],
    withinRadius: false,
  },
];

