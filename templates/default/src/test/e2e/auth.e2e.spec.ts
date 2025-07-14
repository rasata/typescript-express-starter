import request from 'supertest';
import { createTestApp, resetUserDB } from '@/test/setup';

describe('Auth API', () => {
  let server: any;
  const prefix = '/api/v1';

  beforeAll(() => {
    server = createTestApp(); // 공유 리포지토리 사용
  });

  beforeEach(() => {
    resetUserDB(); // 각 테스트 전에 리포지토리 초기화
  });

  const user = { email: 'authuser@example.com', password: 'authpassword123' };

  it('should signup a user', async () => {
    const res = await request(server).post(`${prefix}/auth/signup`).send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.data.email).toBe(user.email);
  });

  it('should login a user and set cookie', async () => {
    await request(server).post(`${prefix}/auth/signup`).send(user);
    const res = await request(server).post(`${prefix}/auth/login`).send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe(user.email);
    expect(res.header['set-cookie']).toBeDefined();
  });

  it('should logout a user', async () => {
    await request(server).post(`${prefix}/auth/signup`).send(user);
    const loginRes = await request(server).post(`${prefix}/auth/login`).send(user);
    const cookie = loginRes.headers['set-cookie'];
    const logoutRes = await request(server).post(`${prefix}/auth/logout`).set('Cookie', cookie[0]);
    expect(logoutRes.statusCode).toBe(200);
    expect(logoutRes.body.message).toBe('logout');
  });
});
