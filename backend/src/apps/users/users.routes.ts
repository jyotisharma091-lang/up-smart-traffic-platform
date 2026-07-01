import { Router } from 'express';
import * as UsersController from './users.controller';
import { validate } from '../../middlewares/validationMiddleware';
import { authenticate } from '../../middlewares/authMiddleware';
import { authorizeRoles } from '../../middlewares/roleMiddleware';
import { createUserSchema, updateUserSchema, resetPasswordSchema } from './dtos/user.dto';

const router = Router();

router.use(authenticate);

// Only State Admin and District Admin can manage users
router.use(authorizeRoles('STATE_ADMIN', 'DISTRICT_ADMIN'));

router.get('/', UsersController.getUsers);
router.post('/', validate(createUserSchema), UsersController.createUser);
router.put('/:id', validate(updateUserSchema), UsersController.updateUser);
router.put('/:id/reset-password', validate(resetPasswordSchema), UsersController.resetPassword);
router.delete('/:id', UsersController.deleteUser);

export default router;
