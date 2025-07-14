import { Service } from 'typedi';
import { User } from '@interfaces/users.interface';

export interface IUsersRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<User>;
  update(id: string, update: User): Promise<User | undefined>;
  delete(id: string): Promise<boolean>;
}

@Service('UsersRepository')
export class UsersRepository implements IUsersRepository {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async update(id: string, user: User): Promise<User | undefined> {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;

    this.users[idx] = { ...this.users[idx], password: user.password };
    return this.users[idx];
  }

  async delete(id: string): Promise<boolean> {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    this.users.splice(idx, 1);
    return true;
  }

  reset() {
    this.users = [];
  }
}
