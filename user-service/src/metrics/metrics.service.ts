import { Injectable } from '@nestjs/common';
import { Registry, Counter, Histogram, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class MetricsService {
  public readonly register: Registry;
  private readonly httpRequestsTotal: Counter;
  private readonly httpRequestDuration: Histogram;

  constructor() {
    this.register = new Registry();
    
    // Collect default metrics
    collectDefaultMetrics({ register: this.register });

    // Custom metrics
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });
  }

  incrementHttpRequests(method: string, route: string, statusCode: number) {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode });
  }

  observeHttpDuration(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);
  }

  async getMetrics(): Promise<string> {
    return this.register.metrics();
  }
}
