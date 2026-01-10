import type { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { type UserCreateData } from '@entities/user.entity';
import { UsersService } from '@services/users.service';
import { asyncHandler } from '@utils/asyncHandler';

@injectable()
export class UsersController {
  constructor(@inject(UsersService) private readonly userService: UsersService) {}

  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.userService.getAllUsers();
    const userResponses = users.map((user) => user.toResponse());

    res.json({ data: userResponses, message: 'findAll' });
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id;
    const user = await this.userService.getUserById(userId);

    res.json({ data: user.toResponse(), message: 'findById' });
  });

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const userData: UserCreateData = req.body;
    const user = await this.userService.createUser(userData);

    res.status(201).json({ data: user.toResponse(), message: 'create' });
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id;
    const updateData: { email?: string; password?: string } = req.body;
    const user = await this.userService.updateUser(userId, updateData);

    res.json({ data: user.toResponse(), message: 'update' });
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id;
    await this.userService.deleteUser(userId);

    res.status(204).json({ message: 'delete' });
  });
}
