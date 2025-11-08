import type { Job } from './types';

export const initialJobs: Job[] = [
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
