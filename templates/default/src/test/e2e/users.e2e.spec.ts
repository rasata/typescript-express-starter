import request from 'supertest';
import { createTestApp, resetUserDB } from '@/test/setup';

describe('Users API', () => {
  let server: any;
  const prefix = '/api/v1';

  beforeAll(() => {
    server = createTestApp();
  });

  beforeEach(() => {
    resetUserDB();
  });

  // 공통 유저 데이터
  const user = { email: 'user1@example.com', password: 'password123' };
  let userId: string;

  it('should create a user', async () => {
    const res = await request(server).post(`${prefix}/users`).send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.data.email).toBe(user.email);
    userId = res.body.data.id;
  });

  it('should get all users', async () => {
    await request(server).post(`${prefix}/users`).send(user);
    const res = await request(server).get(`${prefix}/users`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].email).toBe(user.email);
  });

  it('should get a user by id', async () => {
    // 먼저 유저 생성
    const createRes = await request(server).post(`${prefix}/users`).send(user);
    const id = createRes.body.data.id;

    const res = await request(server).get(`${prefix}/users/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe(user.email);
  });

  it('should update a user', async () => {
    // 유저 생성
    const createRes = await request(server).post(`${prefix}/users`).send(user);
    const id = createRes.body.data.id;

    const newPassword = 'newpassword123';
    const res = await request(server).put(`${prefix}/users/${id}`).send({ password: newPassword });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(id);
  });

  it('should delete a user', async () => {
    // 유저 생성
    const createRes = await request(server).post(`${prefix}/users`).send(user);
    const id = createRes.body.data.id;

    const res = await request(server).delete(`${prefix}/users/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('deleted');
  });

  it('should return 404 if user does not exist', async () => {
    const res = await request(server).get(`${prefix}/users/invalid-id`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not exist|not found/i);
  });
});
