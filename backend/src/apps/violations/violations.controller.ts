import { Request, Response, NextFunction } from 'express';
import { ViolationService } from './violations.service';

export const createViolation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const officerId = req.user!.id;
    const district = req.user!.district;

    const violation = await ViolationService.createViolation(req.body, officerId, district!);
    res.status(201).json({ success: true, message: 'Violation submitted successfully', data: violation });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getViolations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const violationsData = await ViolationService.getViolations(req.user!.role, req.user!.id, req.user!.district);
    console.log(`Sending ${violationsData.length} violations for user ${req.user!.id} in district ${req.user!.district}. Verification queue count: ${violationsData.filter(v => v.status === 'VERIFICATION_QUEUE').length}`);
    res.status(200).json({ success: true, data: violationsData });
  } catch (error: any) {
    console.error('getViolations Error:', error);
    res.status(403).json({ success: false, message: error.message });
  }
};

export const getVerificationQueue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role !== 'DISTRICT_ADMIN') {
      throw new Error('Only district admins can access the verification queue');
    }
    const queueData = await ViolationService.getVerificationQueue(req.user!.district!);
    res.status(200).json({ success: true, data: queueData });
  } catch (error: any) {
    res.status(403).json({ success: false, message: error.message });
  }
};

export const getViolationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const violation = await ViolationService.getViolationById(id, req.user!.role, req.user!.id, req.user!.district);
    res.status(200).json({ success: true, data: violation });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

  export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params as { id: string };
      const { status, violationType } = req.body;
      const violation = await ViolationService.updateStatus(id, status, req.user!.id, req.user!.role, req.user!.district, violationType);
      res.status(200).json({ success: true, message: 'Status updated', data: violation });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

export const analyzeImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageUrl, base64Image } = req.body;
    const aiData = await ViolationService.analyzeImage(imageUrl, base64Image);
    res.status(200).json({ success: true, data: aiData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
