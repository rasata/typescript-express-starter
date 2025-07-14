import { Router } from 'express';
import { Service, Inject } from 'typedi';
import { UsersController } from '@controllers/users.controller';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

@Service()
export class UsersRoute implements Routes {
  public router: Router = Router();
  public path = '/users';

  constructor(@Inject() private userController: UsersController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.userController.getUsers);
    this.router.get(`${this.path}/:id`, this.userController.getUserById);
    this.router.post(this.path, ValidationMiddleware(CreateUserDto), this.userController.createUser);
    this.router.put(`${this.path}/:id`, ValidationMiddleware(UpdateUserDto), this.userController.updateUser);
    this.router.delete(`${this.path}/:id`, this.userController.deleteUser);
  }
}
