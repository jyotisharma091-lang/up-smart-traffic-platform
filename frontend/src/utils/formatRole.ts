import type { UserRole } from '@/types/auth.types';
import type { ViolationType, ViolationStatus } from '@/types/violation.types';
import { VIOLATION_TYPES, VIOLATION_STATUSES } from './constants';

export const formatRole = (role: UserRole): string => {
  const map: Record<UserRole, string> = {
    traffic_officer: 'Traffic Officer',
    district_admin:  'District Admin',
    state_admin:     'State Admin',
  };
  return map[role] ?? role;
};

export const formatRoleShort = (role: UserRole): string => {
  const map: Record<UserRole, string> = {
    traffic_officer: 'Officer',
    district_admin:  'Dist. Admin',
    state_admin:     'State Admin',
  };
  return map[role] ?? role;
};

export const formatViolationType = (type: ViolationType | string): string =>
  VIOLATION_TYPES[type as ViolationType]?.label ?? type;

export const formatViolationStatus = (status: ViolationStatus): string =>
  VIOLATION_STATUSES[status]?.label ?? status;

export const formatWarningLabel = (count: number): string => {
  if (count === 1) return '1st Warning';
  if (count === 2) return '2nd Warning';
  if (count === 3) return '3rd Warning';
  return `${count} Warnings`;
};

export const getInitials = (name: string): string =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('en-IN').format(n);
