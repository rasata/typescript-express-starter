import { Router } from 'express';
import { injectable, inject } from 'tsyringe';
import { AuthController } from '@controllers/auth.controller';
import { createUserSchema } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

@injectable()
export class AuthRoute implements Routes {
  public router: Router = Router();
  public path = '/auth';

  constructor(@inject(AuthController) private authController: AuthController) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/signup`,
      ValidationMiddleware(createUserSchema),
      this.authController.signUp,
    );
    this.router.post(
      `${this.path}/login`,
      ValidationMiddleware(createUserSchema),
      this.authController.logIn,
    );
    this.router.post(`${this.path}/logout`, AuthMiddleware, this.authController.logOut);
  }
}
