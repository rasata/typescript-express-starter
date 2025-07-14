import { User } from '@interfaces/users.interface';
import { UsersRepository } from '@repositories/users.repository';
import { UsersService } from '@services/users.service';

describe('UsersService (with UsersRepository)', () => {
  let usersService: UsersService;
  let userRepo: UsersRepository;

  // 샘플 유저 데이터
  const user1: User & { id: string } = { id: '1', email: 'one@example.com', password: 'pw1' };
  const user2: User & { id: string } = { id: '2', email: 'two@example.com', password: 'pw2' };

  beforeEach(async () => {
    userRepo = new UsersRepository();
    userRepo.reset();
    // users 직접 저장 (save는 비동기지만 초기화엔 await 생략해도 무방)
    await userRepo.save({ ...user1 });
    await userRepo.save({ ...user2 });
    usersService = new UsersService(userRepo);
  });

  it('getAllUsers: 전체 유저 목록 반환', async () => {
    const users = await usersService.getAllUsers();
    expect(users.length).toBe(2);
    expect(users[0].email).toBe(user1.email);
  });

  it('getUserById: ID로 유저 조회', async () => {
    const user = await usersService.getUserById('2');
    expect(user.email).toBe(user2.email);
  });

  it('getUserById: 없는 ID는 예외 발생', async () => {
    await expect(usersService.getUserById('999')).rejects.toThrow(/not found/);
  });

  it('createUser: 새 유저 추가', async () => {
    const created = await usersService.createUser({
      id: '', // 무시됨
      email: 'new@example.com',
      password: 'pw3',
    });
    expect(created.email).toBe('new@example.com');
    const all = await usersService.getAllUsers();
    expect(all.length).toBe(3);
  });

  it('createUser: 이미 존재하는 이메일은 예외', async () => {
    await expect(
      usersService.createUser({
        id: '',
        email: user1.email,
        password: 'pwX',
      }),
    ).rejects.toThrow(/exists/);
  });

  it('updateUser: 유저 비밀번호 수정', async () => {
    const newPassword = 'newpw';
    const updated = await usersService.updateUser(user2.id as string, {
      id: user2.id as string,
      email: user2.email,
      password: newPassword,
    });
    expect(updated).toBeDefined();
    expect(updated!.password).not.toBe(user2.password); // 해시값으로 변경됨
  });

  it('updateUser: 없는 ID는 예외', async () => {
    await expect(
      usersService.updateUser('999', {
        id: '999',
        email: 'no@no.com',
        password: 'no',
      }),
    ).rejects.toThrow(/not found/);
  });

  it('deleteUser: 삭제 성공', async () => {
    await usersService.deleteUser(user1.id as string);
    const users = await usersService.getAllUsers();
    expect(users.length).toBe(1);
    expect(users[0].id).toBe(user2.id);
  });

  it('deleteUser: 없는 ID는 예외', async () => {
    await expect(usersService.deleteUser('999')).rejects.toThrow(/not found/);
  });
});
