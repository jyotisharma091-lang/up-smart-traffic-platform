import { format, formatDistanceToNow, parseISO } from 'date-fns';

/** Format: "3 Jun 2025" */
export const formatDate = (dateStr: string): string => {
  try { return format(parseISO(dateStr), 'd MMM yyyy'); }
  catch { return dateStr; }
};

/** Format: "3 Jun 2025, 14:32" */
export const formatDateTime = (dateStr: string): string => {
  try { return format(parseISO(dateStr), 'd MMM yyyy, HH:mm'); }
  catch { return dateStr; }
};

/** Format: "2h ago", "3 days ago" */
export const formatRelative = (dateStr: string): string => {
  try { return formatDistanceToNow(parseISO(dateStr), { addSuffix: true }); }
  catch { return dateStr; }
};

/** Format: "14:32" */
export const formatTime = (dateStr: string): string => {
  try { return format(parseISO(dateStr), 'HH:mm'); }
  catch { return dateStr; }
};

/** Today's date formatted */
export const todayFormatted = (): string =>
  format(new Date(), 'EEEE, d MMMM yyyy');

/** Current ISO string */
export const nowIso = (): string => new Date().toISOString();
