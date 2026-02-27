import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { HttpClient } from "../../../common/http/http.client";
import { CacheService } from "../../../common/cache/cache.service";
import { RetryService } from "../../../common/resilience/retry.service";
import { CircuitBreakerService } from "../../../common/resilience/circuit-breaker.service";
import { TokenManager } from "../../../common/token/token.manager";
import { PadronMapper } from "../domain/padron.mapper";

type PadronRaw = {
  nombre?: string;
  apellido?: string;
  nombresYApellido: string;
  cedula: string;
  fec_nac: string;
  sexo: string;
  departamento_nombre: string;
  distrito_nombre: string;
  zona_nombre: string;
};

@Injectable()
export class PadronService {
  private readonly breaker: { fire(cedula: string): Promise<PadronRaw[]> };

  constructor(
    private readonly http: HttpClient,
    private readonly cache: CacheService,
    private readonly retry: RetryService,
    private readonly breakerFactory: CircuitBreakerService,
    private readonly tokenManager: TokenManager,
  ) {
    this.breaker = this.breakerFactory.create(this.fetchFromPlra.bind(this));
  }

  private async fetchFromPlra(cedula: string): Promise<PadronRaw[]> {
    const token = this.tokenManager.getToken();
    const url = new URL("https://plra.org.py/public/buscar_padron.php");
    url.searchParams.set("cedula", cedula);

    return this.retry.execute(() =>
      this.http.get<PadronRaw[]>(url.toString(), {
        Authorization: `Bearer ${token}`,
        Referer: "https://plra.org.py/public/buscar_enrcp.php",
      }),
    );
  }

  async buscar(cedula: string) {
    const cacheKey = `padron:${cedula}`;

    const cached =
      await this.cache.get<ReturnType<typeof PadronMapper.toResponse>>(
        cacheKey,
      );
    if (cached) return cached;

    let data: PadronRaw[];
    try {
      data = await this.breaker.fire(cedula);
    } catch {
      throw new BadGatewayException(
        "No se pudo consultar el proveedor externo",
      );
    }

    if (!data.length) {
      throw new NotFoundException("No se encontro informacion para la cedula");
    }

    const mapped = PadronMapper.toResponse(data[0]);

    await this.cache.set(cacheKey, mapped);

    return mapped;
  }
}
