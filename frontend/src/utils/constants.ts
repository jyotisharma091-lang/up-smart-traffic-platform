// ── Constants ──────────────────────────────────────────────────

export const ROLES = {
  OFFICER: 'traffic_officer' as const,
  DISTRICT_ADMIN: 'district_admin' as const,
  STATE_ADMIN: 'state_admin' as const,
};

export const USER_STATUSES = {
  PENDING: 'pending_verification',
  ACTIVE: 'active',
  DEACTIVATED: 'deactivated',
  SUSPENDED: 'suspended',
  TRANSFERRED: 'transferred',
  RETIRED: 'retired',
  REJECTED: 'rejected',
} as const;

export const VIOLATION_TYPES = {
  no_helmet:     { label: 'No Helmet',      emoji: '⛑️' },
  no_seatbelt:   { label: 'No Seatbelt',    emoji: '🔒' },
  triple_riding: { label: 'Triple Riding',  emoji: '🏍️' },
  wrong_parking: { label: 'Wrong Parking',  emoji: '🚫' },
  mobile_usage:  { label: 'Mobile Usage',   emoji: '📱' },
  number_plate:  { label: 'Number Plate',   emoji: '🔢' },
  other:         { label: 'Other',          emoji: '⚠️' },
} as const;

export const VIOLATION_STATUSES = {
  pending_ai_review:    { label: 'Pending AI Review',   color: 'info' },
  ai_reviewed:          { label: 'AI Reviewed',          color: 'info' },
  warning_issued:       { label: 'Warning Issued',       color: 'warning' },
  verification_queue:   { label: 'Verification Queue',   color: 'danger' },
  challan_recommended:  { label: 'Challan Recommended',  color: 'danger' },
  rejected:             { label: 'Rejected',             color: 'muted' },
  closed:               { label: 'Closed',               color: 'success' },
} as const;

export const STATUS_COLORS: Record<string, string> = {
  active:               'bg-green-50 text-green-700 border-green-200',
  pending_verification: 'bg-amber-50 text-amber-700 border-amber-200',
  deactivated:          'bg-slate-100 text-slate-500 border-slate-200',
  suspended:            'bg-red-50 text-red-700 border-red-200',
  transferred:          'bg-blue-50 text-blue-700 border-blue-200',
  retired:              'bg-purple-50 text-purple-700 border-purple-200',
  rejected:             'bg-red-50 text-red-700 border-red-200',
  // violation statuses
  pending_ai_review:   'bg-blue-50 text-blue-700 border-blue-200',
  ai_reviewed:         'bg-blue-50 text-blue-700 border-blue-200',
  warning_issued:      'bg-amber-50 text-amber-700 border-amber-200',
  verification_queue:  'bg-red-50 text-red-700 border-red-200',
  challan_recommended: 'bg-red-50 text-red-700 border-red-200',
  rejected_violation:  'bg-slate-100 text-slate-500 border-slate-200',
  closed:              'bg-green-50 text-green-700 border-green-200',
};

export const DEMO_CREDENTIALS = [
  { role: 'Traffic Officer', username: 'officer.sharma', password: 'demo123' },
  { role: 'District Admin',  username: 'admin.lucknow',  password: 'demo123' },
  { role: 'State Admin',     username: 'state.admin',    password: 'demo123' },
];

export const UP_DISTRICTS = [
  'Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya',
  'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki',
  'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli',
  'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur',
  'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur',
  'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi',
  'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri',
  'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri',
  'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit',
  'Pratapgarh', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar',
  'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra',
  'Sultanpur', 'Unnao', 'Varanasi',
];

export const MOCK_DELAY = 600; // ms — simulates API latency
