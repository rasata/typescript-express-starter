import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import { SECRET_KEY } from '@config/env';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { UsersRepository } from '@repositories/users.repository';
import type { IUsersRepository } from '@repositories/users.repository';

@injectable()
export class AuthService {
  constructor(@inject(UsersRepository) private usersRepository: IUsersRepository) {}

  private createToken(user: User): TokenData {
    if (!SECRET_KEY) throw new Error('SECRET_KEY is not defined');

    if (user.id === undefined) {
      throw new Error('User id is undefined');
    }

    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const expiresIn = 60 * 60; // 1h
    const token = sign(dataStoredInToken, SECRET_KEY as string, { expiresIn });
    return { expiresIn, token };
  }

  private createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/; SameSite=Lax;${process.env.NODE_ENV === 'production' ? ' Secure;' : ''}`;
  }

  public async signup(userData: User): Promise<User> {
    const findUser = await this.usersRepository.findByEmail(userData.email);
    if (findUser) throw new HttpException(409, `Email is already in use`);

    const hashedPassword = await hash(userData.password, 10);
    const newUser: User = { id: String(Date.now()), email: userData.email, password: hashedPassword };

    await this.usersRepository.save(newUser);
    return newUser;
  }

  public async login(loginData: User): Promise<{ cookie: string; user: User }> {
    const findUser = await this.usersRepository.findByEmail(loginData.email);
    if (!findUser) throw new HttpException(401, `Invalid email or password.`);

    const isPasswordMatching = await compare(loginData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(401, 'Password is incorrect');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, user: findUser };
  }

  public async logout(user: User): Promise<void> {
    // 로그아웃은 실제 서비스에서는 서버에서 세션/리프레시토큰을 블랙리스트 처리 등 구현 가능
    // 여기서는 클라이언트의 쿠키를 삭제하면 충분
    console.log(`User with email ${user.email} logged out.`);

    return;
  }
}
