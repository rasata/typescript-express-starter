import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { User } from '@interfaces/users.interface';
import { UsersService } from '@services/users.service';

@Service()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.json({ data: users });
    } catch (e) {
      next(e);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.params.id;
      const user = await this.userService.getUserById(userId);
      res.json({ data: user });
    } catch (e) {
      next(e);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const user = await this.userService.createUser(userData);
      res.status(201).json({ data: user });
    } catch (e) {
      next(e);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.params.id;
      const userData: User = req.body;
      const user = await this.userService.updateUser(userId, userData);
      res.json({ data: user });
    } catch (e) {
      next(e);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.params.id;
      await this.userService.deleteUser(userId);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}
