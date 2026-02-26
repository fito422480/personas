import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TokenManager {
  private index = 0;
  private tokens: string[];

  constructor(private readonly configService: ConfigService) {
    this.tokens = this.configService.getOrThrow<string[]>("providers.plraTokens");

    if (!this.tokens.length) {
      throw new InternalServerErrorException(
        "PLRA_TOKENS no tiene tokens validos",
      );
    }
  }

  getToken(): string {
    const token = this.tokens[this.index];
    this.index = (this.index + 1) % this.tokens.length;
    return token;
  }
}
