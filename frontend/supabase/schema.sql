-- Create Users Table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('traffic_officer', 'district_admin', 'state_admin')),
    pno_number TEXT,
    district_id TEXT,
    police_station_id TEXT,
    designation TEXT,
    status TEXT DEFAULT 'active'
);

-- Create Vehicles Table
CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number TEXT UNIQUE NOT NULL,
    vehicle_type TEXT NOT NULL,
    owner_name TEXT,
    owner_mobile TEXT,
    warning_count INTEGER DEFAULT 0
);

-- Create Violations Table
CREATE TABLE public.violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    officer_id UUID REFERENCES public.users(id),
    district_id TEXT NOT NULL,
    image_url TEXT,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'verification_queue' CHECK (status IN ('verification_queue', 'warning_issued', 'challan_generated', 'closed', 'rejected')),
    detected_violations TEXT[] DEFAULT '{}',
    location_description TEXT,
    confidence_score INTEGER,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    admin_decision TEXT
);

-- Insert Demo Users
INSERT INTO public.users (id, full_name, username, role, pno_number, district_id, police_station_id, designation, status)
VALUES
    (gen_random_uuid(), 'IG Rajesh Kumar', 'rkumar_state', 'state_admin', 'UP112233', NULL, NULL, 'Inspector General', 'active'),
    (gen_random_uuid(), 'SP Amit Singh', 'asingh_dist', 'district_admin', 'UP445566', 'D01', NULL, 'Superintendent', 'active'),
    (gen_random_uuid(), 'Constable Sharma', 'csharma', 'traffic_officer', 'UP891234', 'D01', 'PS01', 'Constable', 'active');
