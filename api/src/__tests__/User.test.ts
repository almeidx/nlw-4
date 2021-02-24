import request from 'supertest';

import app from '../app';
import createConnection from '../database';

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  it('Should be able to create a new user', async () => {
    const res = await request(app).post('/users').send({
      email: 'user@example.com',
      name: 'Example User',
    });

    expect(res.status).toBe(201);
  });

  it('Should not be able to create a user with an already existing email', async () => {
    const res = await request(app).post('/users').send({
      email: 'user@example.com',
      name: 'Cool Name',
    });

    expect(res.status).toBe(400);
  });
});
