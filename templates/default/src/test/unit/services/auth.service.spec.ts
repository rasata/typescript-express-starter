import { compare, hash } from 'bcryptjs';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { UsersRepository } from '@repositories/users.repository';
import { AuthService } from '@services/auth.service';

describe('AuthService (with UserMemoryRepository)', () => {
  let authService: AuthService;
  let userRepo: UsersRepository;
  const testUser: User = {
    id: '1',
    email: 'authuser@example.com',
    password: '', // 실제 해시로 교체
  };

  beforeEach(async () => {
    userRepo = new UsersRepository();
    testUser.password = await hash('plainpw', 10);
    // 초기 유저 추가
    await userRepo.save({ ...testUser });
    authService = new AuthService(userRepo); // repo 주입
  });

  it('signup: 신규 유저를 추가한다', async () => {
    const dto: CreateUserDto = {
      email: 'newuser@example.com',
      password: 'newpassword123',
    };
    const created = await authService.signup(dto);
    expect(created.email).toBe(dto.email);

    const found = await userRepo.findByEmail(dto.email);
    expect(found).toBeDefined();
    expect(await compare(dto.password, found!.password)).toBe(true);
  });

  it('signup: 중복 이메일은 에러 발생', async () => {
    const dto: CreateUserDto = {
      email: testUser.email,
      password: 'anypw',
    };
    await expect(authService.signup(dto)).rejects.toThrow(/already in use/);
  });

  it('login: 정상 로그인시 user, cookie 반환', async () => {
    // 비밀번호 해시 생성
    const plainPassword = 'mySecret123';
    const email = 'loginuser@example.com';
    const hashed = await hash(plainPassword, 10);
    await userRepo.save({ id: '2', email, password: hashed });

    const result = await authService.login({ email, password: plainPassword });
    expect(result.user.email).toBe(email);
    expect(result.cookie).toContain('Authorization=');
  });

  it('login: 이메일 또는 비밀번호가 틀리면 에러', async () => {
    // 없는 이메일
    await expect(authService.login({ email: 'nobody@example.com', password: 'xxx' })).rejects.toThrow(/Invalid email or password/i);

    // 잘못된 비밀번호
    const email = testUser.email;
    await expect(authService.login({ email, password: 'wrongpw' })).rejects.toThrow(/password/i);
  });

  it('logout: 정상 호출시 오류 없이 끝난다', async () => {
    await expect(authService.logout(testUser)).resolves.toBeUndefined();
  });
});
