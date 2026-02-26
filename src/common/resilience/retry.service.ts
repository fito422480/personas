import { Injectable } from "@nestjs/common";

@Injectable()
export class RetryService {
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const retries = 2;
    const minTimeout = 500;

    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          const delay = minTimeout * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }
}
