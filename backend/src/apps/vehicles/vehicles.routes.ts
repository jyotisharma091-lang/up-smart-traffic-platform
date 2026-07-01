import { Router } from 'express';
import * as VehiclesController from './vehicles.controller';
import { validate } from '../../middlewares/validationMiddleware';
import { authenticate } from '../../middlewares/authMiddleware';
import { createVehicleSchema } from './dtos/vehicle.dto';

const router = Router();

router.use(authenticate);

router.post('/', validate(createVehicleSchema), VehiclesController.createVehicle);
router.get('/:vehicleNumber', VehiclesController.getVehicle);

export default router;
