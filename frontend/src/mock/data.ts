import type { User, Vehicle, Violation, Hotspot, Notification } from '../types';

export const mockUser: User = {
  id: '1',
  fullName: 'Constable Sharma',
  username: 'csharma',
  role: 'traffic_officer',
  pnoNumber: 'UP891234',
  districtId: 'D01',
  policeStationId: 'PS01',
  designation: 'Constable',
  status: 'active'
};

export const mockStateAdmin: User = {
  id: '2',
  fullName: 'IG Rajesh Kumar',
  username: 'rkumar_state',
  role: 'state_admin',
  pnoNumber: 'UP112233',
  districtId: null,
  policeStationId: null,
  designation: 'Inspector General',
  status: 'active'
};

export const mockDistrictAdmin: User = {
  id: '3',
  fullName: 'SP Amit Singh',
  username: 'asingh_dist',
  role: 'district_admin',
  pnoNumber: 'UP445566',
  districtId: 'D01',
  policeStationId: null,
  designation: 'Superintendent',
  status: 'active'
};

export const mockUsers: User[] = [mockUser, mockStateAdmin, mockDistrictAdmin];

export const mockVehicles: Vehicle[] = [
  { id: 'v1', registrationNumber: 'UP32AB1234', vehicleType: 'two_wheeler', ownerName: 'Ramesh Singh', ownerMobile: '9876543210', warningCount: 3 },
  { id: 'v2', registrationNumber: 'UP70CD5678', vehicleType: 'two_wheeler', ownerName: 'Anita Desai', ownerMobile: '9123456789', warningCount: 2 },
  { id: 'v3', registrationNumber: 'UP88EF9012', vehicleType: 'four_wheeler', ownerName: 'Prakash Tech', ownerMobile: '9988776655', warningCount: 1 }
];

export const mockViolations: Violation[] = [
  {
    id: 'vio1',
    officerId: '1',
    districtId: 'D01',
    imageUrl: 'https://images.unsplash.com/photo-1596481759530-58c9735d4872?q=80&w=600&auto=format&fit=crop',
    capturedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'verification_queue',
    detectedViolations: ['triple_riding', 'no_helmet'],
    locationDescription: 'Hazratganj Crossing, Lucknow',
    vehicleDetails: mockVehicles[0],
    confidenceScore: 94
  },
  {
    id: 'vio2',
    officerId: '1',
    districtId: 'D01',
    imageUrl: 'https://images.unsplash.com/photo-1627885347209-66c5a6ba6b7b?q=80&w=600&auto=format&fit=crop',
    capturedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'warning_issued',
    detectedViolations: ['no_helmet'],
    locationDescription: 'Gomti Nagar, Lucknow',
    vehicleDetails: mockVehicles[1],
    confidenceScore: 88
  },
  {
    id: 'vio3',
    officerId: '1',
    districtId: 'D02',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600&auto=format&fit=crop',
    capturedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'closed',
    detectedViolations: ['wrong_parking'],
    locationDescription: 'Alambagh Bus Stand',
    vehicleDetails: mockVehicles[2],
    adminDecision: 'closed'
  }
];

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'case_updated', title: 'Case UP32AB1234 Moved to Queue', message: 'Vehicle hit 3rd warning limit.', isRead: false, createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: 'n2', type: 'warning_issued', title: 'Warning Issued', message: '2nd Warning issued to UP70CD5678.', isRead: true, createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() }
];

export const mockHotspots: Hotspot[] = [
  { id: 'h1', name: 'Hazratganj Intersection', centerLatitude: 26.8467, centerLongitude: 80.9462, violationCount: 450, severity: 'critical' },
  { id: 'h2', name: 'Gomti Nagar Extension', centerLatitude: 26.8521, centerLongitude: 81.0021, violationCount: 210, severity: 'high' }
];
