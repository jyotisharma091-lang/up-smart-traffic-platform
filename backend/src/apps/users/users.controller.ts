import { Request, Response, NextFunction } from 'express';
import { UserService } from './users.service';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Creating user...", req.body);
    const creatorRole = req.user!.role;
    const creatorDistrict = req.user!.district;

    const user = await UserService.createUser(req.body, creatorRole, creatorDistrict);
    console.log("User created successfully");
    res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (error: any) {
    let errorMessage = error.message;
    const cause = error.cause as any;
    
    if (cause && cause.code === '23505') {
      if (cause.constraint_name?.includes('mobile')) errorMessage = 'Mobile Number is already registered.';
      else if (cause.constraint_name?.includes('pno')) errorMessage = 'PNO Number is already registered.';
      else if (cause.constraint_name?.includes('username')) errorMessage = 'User is already registered with these details.';
      else errorMessage = 'User already exists with these details.';
    } else if (errorMessage.startsWith('Failed query')) {
      errorMessage = 'Database error occurred while saving.';
    }

    res.status(400).json({ success: false, message: errorMessage });
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = req.user!.role;
    const district = req.user!.district;

    const usersList = await UserService.getUsers(role, district);
    res.status(200).json({ success: true, data: usersList });
  } catch (error: any) {
    res.status(403).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const user = await UserService.updateUser(id, req.body, req.user!.role, req.user!.district);
    res.status(200).json({ success: true, message: 'User updated successfully', data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const { newPassword } = req.body;
    await UserService.resetPassword(id, newPassword, req.user!.role, req.user!.district);
    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    await UserService.deleteUser(id, req.user!.role, req.user!.district);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
