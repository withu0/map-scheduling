import type { Job } from './types';

export const initialJobsA: Job[] = [
  {
    id: 'job-5',
    customerName: 'Twin Peaks',
    address: '501 Twin Peaks Blvd, San Francisco, CA 94114',
    scheduledTime: '02:30 PM',
    coordinates: [-122.4475, 37.7545],
  },
  {
    id: 'job-2',
    customerName: 'Coit Tower',
    address: '1 Telegraph Hill Blvd, San Francisco, CA 94133',
    scheduledTime: '10:00 AM',
    coordinates: [-122.4058, 37.8024],
  },
  {
    id: 'job-3',
    customerName: 'Palace of Fine Arts',
    address: '3601 Lyon St, San Francisco, CA 94123',
    scheduledTime: '11:30 AM',
    coordinates: [-122.4486, 37.8021],
  },
  {
    id: 'job-1',
    customerName: 'Ferry Building Marketplace',
    address: '1 Ferry Building, San Francisco, CA 94111',
    scheduledTime: '09:00 AM',
    coordinates: [-122.3932, 37.7956],
  },
  {
    id: 'job-4',
    customerName: 'Alamo Square Park',
    address: 'Steiner St & Hayes St, San Francisco, CA 94117',
    scheduledTime: '01:00 PM',
    coordinates: [-122.433, 37.776],
  },
];

export const initialJobsB: Job[] = [
  {
    id: 'job-9',
    customerName: 'Oracle Park',
    address: '24 Willie Mays Plaza, San Francisco, CA 94107',
    scheduledTime: '01:30 PM',
    coordinates: [-122.389, 37.778],
  },
  {
    id: 'job-10',
    customerName: 'de Young Museum',
    address: '50 Hagiwara Tea Garden Dr, San Francisco, CA 94118',
    scheduledTime: '03:00 PM',
    coordinates: [-122.468, 37.771],
  },
  {
    id: 'job-6',
    customerName: 'Alcatraz Island',
    address: 'Alcatraz Island, San Francisco, CA 94133',
    scheduledTime: '09:30 AM',
    coordinates: [-122.423, 37.827],
  },
  {
    id: 'job-8',
    customerName: 'Ghirardelli Square',
    address: '900 North Point St, San Francisco, CA 94109',
    scheduledTime: '12:00 PM',
    coordinates: [-122.422, 37.806],
  },
  {
    id: 'job-7',
    customerName: 'Lombard Street',
    address: '1070 Lombard St, San Francisco, CA 94109',
    scheduledTime: '10:45 AM',
    coordinates: [-122.419, 37.802],
  },
];

export const candidateJobs: Job[] = [
  {
    id: 'candidate-1',
    customerName: 'California Academy of Sciences',
    address: '55 Music Concourse Dr, San Francisco, CA 94118',
    scheduledTime: '04:00 PM',
    coordinates: [-122.466, 37.77],
  },
  {
    id: 'candidate-2',
    customerName: 'Fisherman\'s Wharf',
    address: 'Jefferson St, San Francisco, CA 94133',
    scheduledTime: '04:00 PM',
    coordinates: [-122.417, 37.808],
  },
  {
    id: 'candidate-3',
    customerName: 'Sutro Baths',
    address: '1004 Point Lobos Ave, San Francisco, CA 94121',
    scheduledTime: '04:00 PM',
    coordinates: [-122.514, 37.78],
  },
  {
    id: 'candidate-4',
    customerName: 'Golden Gate Bridge Pavilion',
    address: 'Golden Gate Bridge, San Francisco, CA 94129',
    scheduledTime: '04:00 PM',
    coordinates: [-122.4783, 37.8079]
  }
];

export const initialJobs = [...initialJobsA, ...initialJobsB];