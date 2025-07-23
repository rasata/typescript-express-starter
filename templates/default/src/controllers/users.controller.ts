import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { User } from '@interfaces/users.interface';
import { UsersService } from '@services/users.service';

@injectable()
export class UsersController {
  constructor(@inject(UsersService) private readonly userService: UsersService) {}

  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.json({ data: users, message: 'findAll' });
    } catch (e) {
      next(e);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.params.id;
      const user = await this.userService.getUserById(userId);
      res.json({ data: user, message: 'findById' });
    } catch (e) {
      next(e);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const user = await this.userService.createUser(userData);
      res.status(201).json({ data: user, message: 'create' });
    } catch (e) {
      next(e);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.params.id;
      const userData: User = req.body;
      const user = await this.userService.updateUser(userId, userData);
      res.json({ data: user, message: 'update' });
    } catch (e) {
      next(e);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.params.id;
      await this.userService.deleteUser(userId);
      res.status(204).json({ message: 'delete' });
    } catch (e) {
      next(e);
    }
  };
}
