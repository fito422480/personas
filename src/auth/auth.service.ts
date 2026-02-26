import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(input: LoginDto = {}) {
    const payload = {
      sub: input.sub ?? "dev-user",
      name: input.name ?? "Developer",
    };

    return {
      access_token: this.jwtService.sign(payload),
      token_type: "Bearer",
      expires_in: 3600,
    };
  }
}
