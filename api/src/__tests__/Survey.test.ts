import request from 'supertest';

import app from '../app';
import createConnection from '../database';

describe('Survey', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  it('Should be able to create a new survey', async () => {
    const res = await request(app).post('/surveys').send({
      description: 'This is a description',
      title: 'Example Title',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('Should be able to list all surveys', async () => {
    await request(app).post('/surveys').send({
      description: 'This is also a description',
      title: 'Example Title 2',
    });

    const res = await request(app).get('/surveys');

    expect(res.body.length).toBe(2);
  });
});
