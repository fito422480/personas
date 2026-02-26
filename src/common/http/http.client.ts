import { HttpException, Injectable } from "@nestjs/common";
import { request } from "undici";

@Injectable()
export class HttpClient {
  async get<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
    const { body, statusCode } = await request(url, {
      method: "GET",
      headers,
      headersTimeout: 3000,
      bodyTimeout: 3000,
    });

    if (statusCode < 200 || statusCode >= 300) {
      throw new HttpException(
        { message: "Error HTTP en proveedor externo", statusCode },
        statusCode,
      );
    }

    return (await body.json()) as T;
  }
}
