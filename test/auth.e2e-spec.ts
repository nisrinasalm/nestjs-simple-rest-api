import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'b@gmail.com',
        password: 'b@password',
      })
      .expect(201);
  });

  it('/auth/login (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'b@gmail.com',
        password: 'b@password',
      })
      .expect(201);

    token = res.body.access_token;
  });

  it('/posts (GET) protected route', async () => {
    await request(app.getHttpServer())
      .get('/posts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
