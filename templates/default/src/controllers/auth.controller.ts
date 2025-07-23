import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const signUpUserData = await this.authService.signup(userData);
      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: User = req.body;
      const { cookie, user } = await this.authService.login(loginData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: user, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userReq = req as RequestWithUser;
      const user = userReq.user;
      await this.authService.logout(user);

      res.clearCookie('Authorization', {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        // secure: true, // 프로덕션에서 HTTPS일 때만
      });
      res.status(200).json({ message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}
