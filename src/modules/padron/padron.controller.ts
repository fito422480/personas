import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PadronService } from "./application/padron.service";
import { CedulaParamDto } from "./dto/cedula-param.dto";

@Controller("padron")
export class PadronController {
  constructor(private readonly service: PadronService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get(":cedula")
  buscar(@Param() params: CedulaParamDto) {
    return this.service.buscar(params.cedula);
  }
}
