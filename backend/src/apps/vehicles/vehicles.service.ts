import { db } from '../../config/db';
import { vehicles, violations } from '../../config/schema';
import { eq } from 'drizzle-orm';

export class VehicleService {
  
  static async createVehicle(data: any) {
    const existing = await db.select().from(vehicles).where(eq(vehicles.vehicleNumber, data.vehicleNumber));
    if (existing.length > 0) {
      throw new Error('Vehicle with this number already exists');
    }

    const result = await db.insert(vehicles).values(data).returning();
    return result[0];
  }

  static async getVehicleByNumber(vehicleNumber: string) {
    const result = await db.select().from(vehicles).where(eq(vehicles.vehicleNumber, vehicleNumber));
    if (result.length === 0) {
      throw new Error('Vehicle not found');
    }
    
    const vehicle = result[0];
    
    // Fetch associated violations
    const history = await db.select().from(violations).where(eq(violations.vehicleId, vehicle.id));
    
    return {
      ...vehicle,
      history
    };
  }
}
