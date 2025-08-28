import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { User } from '@interfaces/users.interface';
import { UsersService } from '@services/users.service';
import { asyncHandler } from '@utils/asyncHandler';

@injectable()
export class UsersController {
  constructor(@inject(UsersService) private readonly userService: UsersService) { }

  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.userService.getAllUsers();

    res.json({ data: users, message: 'findAll' });
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id;
    const user = await this.userService.getUserById(userId);

    res.json({ data: user, message: 'findById' });
  });

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const userData: User = req.body;
    const user = await this.userService.createUser(userData);

    res.status(201).json({ data: user, message: 'create' });
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id;
    const userData: User = req.body;
    const user = await this.userService.updateUser(userId, userData);

    res.json({ data: user, message: 'update' });
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id;
    await this.userService.deleteUser(userId);

    res.status(204).json({ message: 'delete' });
  });
}
