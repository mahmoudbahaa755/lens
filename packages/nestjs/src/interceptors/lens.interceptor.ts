// This file provides a NestJS interceptor for capturing request data
// Users will need to implement this with proper NestJS decorators and RxJS imports

export interface LensInterceptorInterface {
  intercept(context: any, next: any): any;
}

export class LensInterceptor implements LensInterceptorInterface {
  constructor(private readonly requestWatcher?: any) {}

  intercept(context: any, next: any): any {
    // Implementation would use proper NestJS and RxJS imports
    // This is a template that users can extend

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const start = process.hrtime();

    // Generate and set request ID
    const requestId = this.generateRequestId();
    this.setRequestId(request, requestId);

    // In a real implementation, this would use RxJS operators
    return next.handle();
  }

  private generateRequestId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private setRequestId(request: any, requestId: string): void {
    if (!request.lensEntry) {
      request.lensEntry = {};
    }
    request.lensEntry.requestId = requestId;
  }

  private async logRequest(
    request: any,
    response: any,
    start: [number, number],
    responseData: any,
    requestId: string,
    error?: any
  ): Promise<void> {
    if (!this.requestWatcher) return;

    const duration = process.hrtime(start);
    const durationMs = duration[0] * 1000 + duration[1] * 1e-6;

    const requestEntry = {
      request: {
        id: requestId,
        method: request.method,
        duration: `${durationMs.toFixed(2)} ms`,
        path: request.url,
        headers: request.headers || {},
        body: request.body || {},
        status: response.statusCode || (error ? 500 : 200),
        ip: request.ip || request.connection?.remoteAddress || "unknown",
        createdAt: new Date().toISOString(),
      },
      response: {
        json: error ? { error: error.message } : responseData,
        headers: response.getHeaders ? response.getHeaders() : {},
      },
    };

    await this.requestWatcher.log(requestEntry);
  }
}
