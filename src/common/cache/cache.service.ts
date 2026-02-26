import {
  Injectable,
  Logger,
  OnModuleDestroy,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisClientType, createClient } from "redis";

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly redis: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>("providers.redis.url");
    const redisHost = this.configService.get<string>("providers.redis.host");
    const redisPort = this.configService.get<number>("providers.redis.port");
    const redisUsername = this.configService.get<string>("providers.redis.username");
    const redisPassword = this.configService.get<string>("providers.redis.password");

    if (redisUrl) {
      this.redis = createClient({ url: redisUrl });
    } else if (redisHost && redisPort && redisPassword) {
      this.redis = createClient({
        username: redisUsername ?? "default",
        password: redisPassword,
        socket: {
          host: redisHost,
          port: redisPort,
        },
      });
    } else {
      throw new Error(
        "Configuracion Redis incompleta. Usa REDIS_URL o REDIS_HOST/REDIS_PORT/REDIS_PASSWORD.",
      );
    }

    this.redis.on("error", (error) => {
      this.logger.error("Redis Client Error", error);
    });
  }

  private async ensureConnection(): Promise<void> {
    if (!this.redis.isOpen) {
      await this.redis.connect();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    await this.ensureConnection();
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: unknown, ttl = 300): Promise<void> {
    await this.ensureConnection();
    await this.redis.set(key, JSON.stringify(value), { EX: ttl });
  }

  async onModuleDestroy(): Promise<void> {
    try {
      if (this.redis.isOpen) {
        await this.redis.quit();
      }
    } catch {
      if (this.redis.isOpen) {
        await this.redis.disconnect();
      }
    }
  }
}
