import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("App E2E", () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.JWT_SECRET = "this-is-a-very-secure-dev-secret";
    process.env.REDIS_URL = "redis://localhost:6379";
    process.env.REDIS_PASSWORD = "test-password";
    process.env.PLRA_TOKENS = "token1,token2";

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api");
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it("/api/health (GET)", async () => {
    await request(app.getHttpServer())
      .get("/api/health")
      .expect(200)
      .expect({ status: "ok" });
  });
});
