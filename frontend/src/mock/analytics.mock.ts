import type {
  Hotspot, StateDashboardStats, DistrictDashboardStats,
  OfficerDashboardStats, ViolationTrendPoint, ViolationTypeBreakdown, DistrictPerformance,
} from '@/types/vehicle.types';

// ── Hotspots ──────────────────────────────────────────────────
export const MOCK_HOTSPOTS: Hotspot[] = [
  {
    id: 1, districtId: 1, districtName: 'Lucknow',
    name: 'MG Road — Hazratganj',
    centerLatitude: 26.8467, centerLongitude: 80.9462,
    radiusMeters: 500, violationCount: 47,
    dominantViolationType: 'no_helmet', severity: 'critical', isActive: true,
  },
  {
    id: 2, districtId: 1, districtName: 'Lucknow',
    name: 'Hazratganj Chowk',
    centerLatitude: 26.8481, centerLongitude: 80.9474,
    radiusMeters: 300, violationCount: 38,
    dominantViolationType: 'wrong_parking', severity: 'high', isActive: true,
  },
  {
    id: 3, districtId: 1, districtName: 'Lucknow',
    name: 'Alambagh Crossing',
    centerLatitude: 26.8380, centerLongitude: 80.9200,
    radiusMeters: 400, violationCount: 29,
    dominantViolationType: 'triple_riding', severity: 'high', isActive: true,
  },
  {
    id: 4, districtId: 1, districtName: 'Lucknow',
    name: 'Charbagh Railway Station',
    centerLatitude: 26.8340, centerLongitude: 80.9120,
    radiusMeters: 600, violationCount: 22,
    dominantViolationType: 'wrong_parking', severity: 'medium', isActive: true,
  },
  {
    id: 5, districtId: 1, districtName: 'Lucknow',
    name: 'Gomti Nagar — Vipin Khand',
    centerLatitude: 26.8550, centerLongitude: 80.9700,
    radiusMeters: 350, violationCount: 18,
    dominantViolationType: 'mobile_usage', severity: 'medium', isActive: true,
  },
  {
    id: 6, districtId: 2, districtName: 'Agra',
    name: 'Taj Mahal — Gate 1',
    centerLatitude: 27.1751, centerLongitude: 78.0421,
    radiusMeters: 400, violationCount: 33,
    dominantViolationType: 'wrong_parking', severity: 'high', isActive: true,
  },
  {
    id: 7, districtId: 2, districtName: 'Agra',
    name: 'Agra Cantt Chowk',
    centerLatitude: 27.1584, centerLongitude: 77.9737,
    radiusMeters: 300, violationCount: 15,
    dominantViolationType: 'no_helmet', severity: 'medium', isActive: true,
  },
  {
    id: 8, districtId: 3, districtName: 'Kanpur',
    name: 'Kanpur Civil Lines',
    centerLatitude: 26.4631, centerLongitude: 80.3240,
    radiusMeters: 500, violationCount: 41,
    dominantViolationType: 'no_seatbelt', severity: 'critical', isActive: true,
  },
  {
    id: 9, districtId: 3, districtName: 'Kanpur',
    name: 'Rawatpur Crossing',
    centerLatitude: 26.4748, centerLongitude: 80.3456,
    radiusMeters: 250, violationCount: 8,
    dominantViolationType: 'mobile_usage', severity: 'low', isActive: true,
  },
];

// ── Trend Data ────────────────────────────────────────────────
const generateTrend = (days: number, baseCount: number): ViolationTrendPoint[] => {
  const points: ViolationTrendPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const variance = Math.round((Math.random() - 0.5) * baseCount * 0.4);
    points.push({
      date: d.toISOString().slice(0, 10),
      count: Math.max(10, baseCount + variance),
    });
  }
  return points;
};

export const MOCK_VIOLATION_TREND_7D  = generateTrend(7, 180);
export const MOCK_VIOLATION_TREND_30D = generateTrend(30, 180);
export const MOCK_VIOLATION_TREND_90D = generateTrend(90, 180);

// ── Violation Type Breakdown ──────────────────────────────────
export const MOCK_VIOLATION_TYPE_BREAKDOWN: ViolationTypeBreakdown[] = [
  { type: 'no_helmet',     label: 'No Helmet',     count: 3241, percentage: 38.5 },
  { type: 'wrong_parking', label: 'Wrong Parking',  count: 1876, percentage: 22.3 },
  { type: 'triple_riding', label: 'Triple Riding',  count: 1420, percentage: 16.9 },
  { type: 'no_seatbelt',   label: 'No Seatbelt',    count: 987,  percentage: 11.7 },
  { type: 'mobile_usage',  label: 'Mobile Usage',   count: 654,  percentage: 7.8  },
  { type: 'other',         label: 'Other',           count: 242,  percentage: 2.8  },
];

// ── District Performance ──────────────────────────────────────
export const MOCK_DISTRICT_PERFORMANCE: DistrictPerformance[] = [
  { rank: 1,  districtId: 3, districtName: 'Kanpur',    violationsCount: 1284, pendingQueue: 23, challans: 45 },
  { rank: 2,  districtId: 1, districtName: 'Lucknow',   violationsCount: 1247, pendingQueue: 31, challans: 52 },
  { rank: 3,  districtId: 4, districtName: 'Varanasi',  violationsCount: 987,  pendingQueue: 18, challans: 34 },
  { rank: 4,  districtId: 2, districtName: 'Agra',      violationsCount: 876,  pendingQueue: 15, challans: 28 },
  { rank: 5,  districtId: 5, districtName: 'Meerut',    violationsCount: 743,  pendingQueue: 12, challans: 19 },
  { rank: 6,  districtId: 6, districtName: 'Gorakhpur', violationsCount: 621,  pendingQueue: 9,  challans: 15 },
  { rank: 7,  districtId: 7, districtName: 'Ghaziabad', violationsCount: 589,  pendingQueue: 8,  challans: 12 },
  { rank: 8,  districtId: 8, districtName: 'Mathura',   violationsCount: 456,  pendingQueue: 6,  challans: 9  },
  { rank: 9,  districtId: 9, districtName: 'Bareilly',  violationsCount: 398,  pendingQueue: 5,  challans: 7  },
  { rank: 10, districtId: 10, districtName: 'Allahabad', violationsCount: 321, pendingQueue: 4,  challans: 5  },
];

// ── Dashboard Stats ───────────────────────────────────────────
export const MOCK_STATE_STATS: StateDashboardStats = {
  totalViolationsToday:      1247,
  totalViolationsTodayTrend: 12,
  pendingVerificationQueue:  89,
  challansRecommended:       34,
  challansRecommendedTrend:  5,
  activeOfficers:            412,
};

export const MOCK_DISTRICT_STATS: DistrictDashboardStats = {
  pendingQueue:      31,
  closedCases:       48,
  activeOfficers:    47,
  challansThisWeek:  12,
  violationsToday:   284,
};

export const MOCK_OFFICER_STATS: OfficerDashboardStats = {
  casesToday:          12,
  pendingCases:         2,
  challansRecommended:  1,
  stationViolationsToday: 47,
};
