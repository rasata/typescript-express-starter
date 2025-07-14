import { Router } from 'express';
import { Service, Inject } from 'typedi';
import { AuthController } from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

@Service()
export class AuthRoute implements Routes {
  public router: Router = Router();
  public path = '/auth';

  constructor(@Inject() private authController: AuthController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, ValidationMiddleware(CreateUserDto), this.authController.signUp);
    this.router.post(`${this.path}/login`, ValidationMiddleware(CreateUserDto), this.authController.logIn);
    this.router.post(`${this.path}/logout`, AuthMiddleware, this.authController.logOut);
  }
}
