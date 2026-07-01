import type { Notification } from '@/types/vehicle.types';

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    userId: 3,
    violationId: 1,
    type: 'warning_issued',
    title: '3rd Warning Issued — UP32AB1234',
    message: 'Vehicle UP32AB1234 has received its 3rd warning for No Helmet violation. The case has been moved to the Verification Queue.',
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    readAt: null,
  },
  {
    id: 2,
    userId: 3,
    violationId: 4,
    type: 'admin_decision',
    title: 'Case Closed — UP88EF9012',
    message: 'District Admin SP Suresh Verma has closed case for UP88EF9012 (Mobile Usage). No further action required.',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    readAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    userId: 3,
    violationId: null,
    type: 'system_alert',
    title: 'System Update — Demo Mode Active',
    message: 'The platform is currently running in Demo Mode. All data is synthetic and no real enforcement actions are taken.',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    readAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 4,
    userId: 3,
    violationId: 2,
    type: 'warning_issued',
    title: '2nd Warning Issued — UP70CD5678',
    message: 'Vehicle UP70CD5678 has received its 2nd warning for No Helmet violation.',
    isRead: false,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    readAt: null,
  },
  {
    id: 5,
    userId: 2,
    violationId: 1,
    type: 'case_updated',
    title: 'New Case in Verification Queue',
    message: 'Case for UP32AB1234 (No Helmet — 3rd Warning) is ready for your review in Lucknow district.',
    isRead: false,
    createdAt: new Date(Date.now() - 7100000).toISOString(),
    readAt: null,
  },
  {
    id: 6,
    userId: 2,
    violationId: 5,
    type: 'case_updated',
    title: 'New Case in Verification Queue',
    message: 'Case for UP31IJ7890 (Wrong Parking — 3rd Warning) is ready for your review.',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    readAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

export const getNotificationsByUser = (userId: number) =>
  MOCK_NOTIFICATIONS.filter(n => n.userId === userId);

export const getUnreadCount = (userId: number): number =>
  MOCK_NOTIFICATIONS.filter(n => n.userId === userId && !n.isRead).length;
