import { INestApplication } from "@nestjs/common"
import { AuthService } from "../src/modules/auth/auth.service";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import * as request from 'supertest'

describe('AuthController (e2e)', () => {
    let app: INestApplication;
  
    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
  
      app = moduleRef.createNestApplication();
      await app.init();
    });
  
    afterAll(async () => {
      await app.close();
    });
  
    it('iniciar sesión correctamente', async () => {
      const user = {
        username: process.env.TEST_USER,
        password: process.env.TEST_PWD
      };
  
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(200)
        .then(({ body }) => {
          process.env.TOKEN = body.access_token;
  
          expect(body.user).toBeDefined();
          expect(body.user.email).toEqual(user.username);
          expect(body.access_token).toBeDefined();
        });
    });
  
    it(' debe manejar el error de correo electrónico no encontrado', async () => {
      const user = {
        username: "davidlh251@gmail.com",
        password: "12345678"
      };
  
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(401)
        .expect({
          message: 'Credenciales invalidas',
          error: 'Unauthorized',
          statusCode: 401,
        });
    });
  
    it('debe manejar el error de correo electrónico si no está verificado', async () => {
      const user = {
        username: "davidlh252@gmail.com",
        password: "123456Da!"
      };
  
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(401)
        .expect({
          message: 'El correo electrónico no ha sido verificado.',
          error: 'Unauthorized',
          statusCode: 401,
        });
    });
  
    it(' debe manejar el error de contraseña incorrecta', async () => {
      const user = {
        username: "davidlh257@gmail.com",
        password: "123456Da"
      };
  
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(401)
        .expect({
          message: 'Credenciales invalidas',
          error: 'Unauthorized',
          statusCode: 401,
        });
    });
  });