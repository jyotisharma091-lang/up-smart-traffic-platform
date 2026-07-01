import { MOCK_VEHICLES } from '@/mock/vehicles.mock';
import { MOCK_VIOLATIONS } from '@/mock/violations.mock';
import { MOCK_NOTIFICATIONS } from '@/mock/notifications.mock';
import type { Vehicle, Notification } from '@/types/vehicle.types';
import type { Violation } from '@/types/violation.types';

class DemoService {
  private vehicles: Vehicle[] = [...MOCK_VEHICLES];
  private violations: Violation[] = [...MOCK_VIOLATIONS];
  private notifications: Notification[] = [...MOCK_NOTIFICATIONS];
  private notificationIdCounter = Math.max(...MOCK_NOTIFICATIONS.map(n => n.id), 0) + 1;

  /**
   * Listeners for notification updates
   */
  private notificationListeners: (() => void)[] = [];

  public subscribeToNotifications(listener: () => void) {
    this.notificationListeners.push(listener);
    return () => {
      this.notificationListeners = this.notificationListeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.notificationListeners.forEach(listener => listener());
  }

  /**
   * Mock SMS Service
   */
  public async mockSMSService(mobileNumber: string, message: string): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`[Mock SMS] Sent to ${mobileNumber}:\n${message}`);
        resolve();
      }, 1000); // Simulate network delay
    });
  }

  /**
   * Mock Registry Lookup
   */
  public async mockRegistryLookup(registrationNumber: string): Promise<Vehicle | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const vehicle = this.vehicles.find(
          v => v.registrationNumber.toUpperCase() === registrationNumber.toUpperCase()
        );
        resolve(vehicle || null);
      }, 500);
    });
  }

  /**
   * Get Queue
   */
  public async mockGetQueue(districtId: number): Promise<Violation[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const queue = this.violations.filter(
          v => v.districtId === districtId && v.status === 'verification_queue'
        );
        resolve(queue);
      }, 600);
    });
  }

  /**
   * Get Violation by ID
   */
  public async mockGetViolationById(id: number): Promise<Violation | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        const violation = this.violations.find(v => v.id === id);
        resolve(violation || null);
      }, 300);
    });
  }

  /**
   * Mock Control Room Decision
   */
  public async mockControlRoomDecision(
    violationId: number,
    decision: 'challan' | 'reject' | 'close',
    notes: string,
    reviewerId: number,
    reviewerName: string
  ): Promise<void> {
    return new Promise(resolve => {
      setTimeout(async () => {
        const violationIndex = this.violations.findIndex(v => v.id === violationId);
        if (violationIndex === -1) return resolve();

        const violation = this.violations[violationIndex];
        const newStatus = decision === 'challan' ? 'challan_recommended' : (decision === 'reject' ? 'rejected' : 'closed');

        this.violations[violationIndex] = {
          ...violation,
          status: newStatus as any,
          adminDecision: (decision === 'challan' ? 'recommend_challan' : decision === 'reject' ? 'rejected' : 'closed') as any,
          adminNotes: notes,
          reviewedByUserId: reviewerId,
          reviewedByName: reviewerName,
          reviewedAt: new Date().toISOString()
        };

        // Notify user if applicable
        const titleMap = {
          challan: 'Challan Recommended',
          reject: 'Case Rejected',
          close: 'Case Closed'
        };

        // Add a notification for the officer who captured it
        if (violation.officerId) {
          this.notifications.unshift({
            id: this.notificationIdCounter++,
            userId: violation.officerId,
            violationId: violation.id,
            type: 'admin_decision',
            title: `${titleMap[decision]} — ${violation.vehicleRegistration}`,
            message: `Admin ${reviewerName} has marked this case as ${decision}. Notes: ${notes || 'None'}`,
            isRead: false,
            createdAt: new Date().toISOString(),
            readAt: null
          });
          this.notifyListeners();
        }

        // Send SMS to vehicle owner if challan or warning is issued
        const vehicle = await this.mockRegistryLookup(violation.vehicleRegistration as string);
        if (vehicle && vehicle.ownerMobile) {
          if (decision === 'challan') {
            await this.mockSMSService(
              vehicle.ownerMobile as string,
              `UP Traffic Police: A challan has been recommended for vehicle ${vehicle.registrationNumber} for ${violation.violationType}.`
            );
          }
        }

        resolve();
      }, 800);
    });
  }

  /**
   * Notifications
   */
  public mockGetNotifications(userId: number): Notification[] {
    return this.notifications.filter(n => n.userId === userId);
  }

  public mockMarkAsRead(notificationId: number) {
    const idx = this.notifications.findIndex(n => n.id === notificationId);
    if (idx !== -1) {
      this.notifications[idx] = { ...this.notifications[idx], isRead: true, readAt: new Date().toISOString() };
      this.notifyListeners();
    }
  }

  public mockMarkAllAsRead(userId: number) {
    this.notifications = this.notifications.map(n => 
      n.userId === userId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
    );
    this.notifyListeners();
  }
}

export const demoService = new DemoService();
