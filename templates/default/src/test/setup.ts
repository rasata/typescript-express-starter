import Container from 'typedi';
import App from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UsersRoute } from '@routes/users.route';
import { UsersRepository, IUsersRepository } from '@repositories/users.repository';

let sharedRepo: UsersRepository;

export function createTestApp({ mockRepo }: { mockRepo?: IUsersRepository } = {}) {
  if (!sharedRepo) {
    sharedRepo = new UsersRepository();
    Container.set('UserRepository', sharedRepo);
  }
  if (mockRepo) Container.set('UserRepository', mockRepo);

  const routes = [Container.get(UsersRoute), Container.get(AuthRoute)];
  const appInstance = new App(routes);
  return appInstance.getServer();
}

export function resetUserDB() {
  if (sharedRepo) {
    sharedRepo.reset();
  }
}
