import { Request, Response, NextFunction } from 'express';
import { VehicleService } from './vehicles.service';

export const createVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicle = await VehicleService.createVehicle(req.body);
    res.status(201).json({ success: true, message: 'Vehicle added successfully', data: vehicle });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vehicleNumber } = req.params as { vehicleNumber: string };
    const vehicleData = await VehicleService.getVehicleByNumber(vehicleNumber);
    res.status(200).json({ success: true, data: vehicleData });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};
