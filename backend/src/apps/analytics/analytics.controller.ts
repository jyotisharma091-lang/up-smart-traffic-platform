import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metrics = await AnalyticsService.getDashboardMetrics(req.user!.role, req.user!.id, req.user!.district);
    res.status(200).json({ success: true, data: metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHeatmap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const heatmapGeoJSON = await AnalyticsService.getHeatmapData(req.user!.role, req.user!.district);
    res.status(200).json({ success: true, data: heatmapGeoJSON });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOfficerActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activity = await AnalyticsService.getOfficerActivity(req.user!.role === 'DISTRICT_ADMIN' ? req.user!.district : undefined);
    res.status(200).json({ success: true, data: activity });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
