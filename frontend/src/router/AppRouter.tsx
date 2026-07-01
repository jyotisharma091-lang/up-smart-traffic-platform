import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import { RoleGuard } from '../components/shared/RoleGuard';

// Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { OfficerDashboard } from '../pages/officer/OfficerDashboard';
import { CaptureViolation } from '../pages/officer/CaptureViolation';
import { MyCases } from '../pages/officer/MyCases';
import { VehicleSearch } from '../pages/officer/VehicleSearch';
import { DistrictDashboard } from '../pages/district/DistrictDashboard';
import { VerificationQueue } from '../pages/district/VerificationQueue';
import { OfficerManagement } from '../pages/district/OfficerManagement';
import { IssuedChallans } from '../pages/district/IssuedChallans';
import { StateDashboard } from '../pages/state/StateDashboard';
import { UserManagement } from '../pages/state/UserManagement';
import { MapHeatmaps } from '../pages/shared/MapHeatmaps';
import { Reports } from '../pages/shared/Reports';
import { Settings } from '../pages/shared/Settings';
import { ProfileSettings } from '../pages/shared/ProfileSettings';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ChangePassword } from '../pages/auth/ChangePassword';

export const AppRouter: React.FC = () => {
  const { user, role } = useAuth();

  const getDashboardRoute = () => {
    if (!role) return '/login';
    if (role === 'traffic_officer') return '/officer/dashboard';
    if (role === 'district_admin') return '/district/dashboard';
    if (role === 'state_admin') return '/state/dashboard';
    return '/login';
  };

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={getDashboardRoute()} replace /> : <LoginPage />} />
      <Route path="/forgot-password" element={user ? <Navigate to={getDashboardRoute()} replace /> : <ForgotPasswordPage />} />
      <Route path="/change-password" element={user ? (user.isFirstLogin ? <ChangePassword /> : <Navigate to={getDashboardRoute()} replace />) : <Navigate to="/login" replace />} />
      
      <Route path="/" element={user ? (user.isFirstLogin ? <Navigate to="/change-password" replace /> : <AppShell />) : <Navigate to="/login" replace />}>
        {/* Redirect root to appropriate dashboard */}
        <Route index element={<Navigate to={getDashboardRoute()} replace />} />

        {/* Traffic Officer Routes */}
        <Route path="officer">
          <Route path="dashboard" element={<RoleGuard allowedRoles={['traffic_officer']}><OfficerDashboard /></RoleGuard>} />
          <Route path="capture" element={<RoleGuard allowedRoles={['traffic_officer']}><CaptureViolation /></RoleGuard>} />
          <Route path="cases" element={<RoleGuard allowedRoles={['traffic_officer']}><MyCases /></RoleGuard>} />
          <Route path="search" element={<RoleGuard allowedRoles={['traffic_officer', 'district_admin', 'state_admin']}><VehicleSearch /></RoleGuard>} />
        </Route>

        {/* District Admin Routes */}
        <Route path="district">
          <Route path="dashboard" element={<RoleGuard allowedRoles={['district_admin']}><DistrictDashboard /></RoleGuard>} />
          <Route path="queue" element={<RoleGuard allowedRoles={['district_admin']}><VerificationQueue /></RoleGuard>} />
          <Route path="challans" element={<RoleGuard allowedRoles={['district_admin']}><IssuedChallans /></RoleGuard>} />
          <Route path="officers" element={<RoleGuard allowedRoles={['district_admin']}><OfficerManagement /></RoleGuard>} />
        </Route>

        {/* State Admin Routes */}
        <Route path="state">
          <Route path="dashboard" element={<RoleGuard allowedRoles={['state_admin']}><StateDashboard /></RoleGuard>} />
          <Route path="users" element={<RoleGuard allowedRoles={['state_admin']}><UserManagement /></RoleGuard>} />
        </Route>

        {/* Shared Routes */}
        <Route path="shared">
          <Route path="profile" element={<RoleGuard allowedRoles={['state_admin', 'district_admin', 'traffic_officer']}><ProfileSettings /></RoleGuard>} />
          <Route path="reports" element={<RoleGuard allowedRoles={['district_admin', 'state_admin']}><Reports /></RoleGuard>} />
          <Route path="map" element={<RoleGuard allowedRoles={['district_admin', 'state_admin']}><MapHeatmaps /></RoleGuard>} />
          <Route path="settings" element={<RoleGuard allowedRoles={['state_admin']}><Settings /></RoleGuard>} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
