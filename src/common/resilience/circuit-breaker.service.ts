import { Injectable } from "@nestjs/common";
import CircuitBreaker from "opossum";

@Injectable()
export class CircuitBreakerService {
  create<T>(fn: (...args: any[]) => Promise<T>) {
    return new CircuitBreaker(fn, {
      timeout: 4000,
      errorThresholdPercentage: 50,
      resetTimeout: 10000,
    });
  }
}
