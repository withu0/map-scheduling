import type { Job } from './types';

export const initialJobsA: Job[] = [
  {
    id: 'job-1',
    customerName: 'Ferry Building Marketplace',
    address: '1 Ferry Building, San Francisco, CA 94111',
    scheduledTime: '09:00 AM',
    coordinates: [-122.3932, 37.7956],
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
    id: 'job-4',
    customerName: 'Golden Gate Bridge Pavilion',
    address: 'Golden Gate Bridge, San Francisco, CA 94129',
    scheduledTime: '01:00 PM',
    coordinates: [-122.4784, 37.8078],
  },
  {
    id: 'job-5',
    customerName: 'Twin Peaks',
    address: '501 Twin Peaks Blvd, San Francisco, CA 94114',
    scheduledTime: '02:30 PM',
    coordinates: [-122.4475, 37.7545],
  },
];

export const initialJobsB: Job[] = [
  {
    id: 'job-6',
    customerName: 'Alcatraz Island',
    address: 'Alcatraz Island, San Francisco, CA 94133',
    scheduledTime: '09:30 AM',
    coordinates: [-122.423, 37.827],
  },
  {
    id: 'job-7',
    customerName: 'Lombard Street',
    address: '1070 Lombard St, San Francisco, CA 94109',
    scheduledTime: '10:45 AM',
    coordinates: [-122.419, 37.802],
  },
  {
    id: 'job-8',
    customerName: 'Ghirardelli Square',
    address: '900 North Point St, San Francisco, CA 94109',
    scheduledTime: '12:00 PM',
    coordinates: [-122.422, 37.806],
  },
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
];

export const initialJobs = [...initialJobsA, ...initialJobsB];
