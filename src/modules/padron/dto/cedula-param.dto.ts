import { IsString, Matches } from "class-validator";

export class CedulaParamDto {
  @IsString()
  @Matches(/^\d{3,20}$/, {
    message: "cedula debe contener solo digitos (3 a 20 caracteres)",
  })
  cedula!: string;
}
