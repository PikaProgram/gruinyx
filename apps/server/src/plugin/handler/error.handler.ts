import type { Server } from "bun";
import Elysia, { t, type Static } from "elysia";

export const requestContext = t.Object({
  method: t.String(),
  url: t.String(),
  ip: t.String(),
  headers: t.Record(t.String(), t.String()),
  query: t.Record(t.String(), t.String()),
  params: t.Record(t.String(), t.String()),
  body: t.Optional(t.Any()),
});

export const exceptionMetadata = t.Object({
  message: t.String(),
  type: t.String(),
  code: t.Number(),
  timestamp: t.Date(),
  context: requestContext,
});

export const HTTPExceptions = [
  // Client Exceptions (4xx)
  { type: "BAD_REQUEST", code: 400 },
  { type: "UNAUTHORIZED", code: 401 },
  { type: "PAYMENT_REQUIRED", code: 402 },
  { type: "FORBIDDEN", code: 403 },
  { type: "NOT_FOUND", code: 404 },
  { type: "METHOD_NOT_ALLOWED", code: 405 },
  { type: "NOT_ACCEPTABLE", code: 406 },
  { type: "PROXY_AUTHENTICATION_REQUIRED", code: 407 },
  { type: "REQUEST_TIMEOUT", code: 408 },
  { type: "CONFLICT", code: 409 },
  { type: "GONE", code: 410 },
  { type: "LENGTH_REQUIRED", code: 411 },
  { type: "PRECONDITION_FAILED", code: 412 },
  { type: "PAYLOAD_TOO_LARGE", code: 413 },
  { type: "URI_TOO_LONG", code: 414 },
  { type: "UNSUPPORTED_MEDIA_TYPE", code: 415 },
  { type: "RANGE_NOT_SATISFIABLE", code: 416 },
  { type: "EXPECTATION_FAILED", code: 417 },
  { type: "IM_A_TEAPOT", code: 418 },
  { type: "MISDIRECTED_REQUEST", code: 421 },
  { type: "UNPROCESSABLE_ENTITY", code: 422 },
  { type: "LOCKED", code: 423 },
  { type: "FAILED_DEPENDENCY", code: 424 },
  { type: "TOO_EARLY", code: 425 },
  { type: "UPGRADE_REQUIRED", code: 426 },
  { type: "PRECONDITION_REQUIRED", code: 428 },
  { type: "TOO_MANY_REQUESTS", code: 429 },
  { type: "REQUEST_HEADER_FIELDS_TOO_LARGE", code: 431 },
  { type: "UNAVAILABLE_FOR_LEGAL_REASONS", code: 451 },
  // Server Exceptions (5xx)
  { type: "INTERNAL_SERVER_ERROR", code: 500 },
  { type: "NOT_IMPLEMENTED", code: 501 },
  { type: "BAD_GATEWAY", code: 502 },
  { type: "SERVICE_UNAVAILABLE", code: 503 },
  { type: "GATEWAY_TIMEOUT", code: 504 },
  { type: "HTTP_VERSION_NOT_SUPPORTED", code: 505 },
  { type: "VARIANT_ALSO_NEGOTIATES", code: 506 },
  { type: "INSUFFICIENT_STORAGE", code: 507 },
  { type: "LOOP_DETECTED", code: 508 },
  { type: "NOT_EXTENDED", code: 510 },
  { type: "NETWORK_AUTHENTICATION_REQUIRED", code: 511 }
];

export function getHTTPExceptionCode(type: HTTPExceptionTypes): number | null {
  const exception = HTTPExceptions.find(e => e.type === type);
  return exception ? exception.code : null;
}

export function createRequestContext({ request, server, params }: {
  request: Request;
  server: Server<unknown> | null;
  params: Record<string, string>;
}): Static<typeof requestContext> {
  const ip = server ? server.requestIP(request) : null;
  return {
    method: request.method,
    url: request.url,
    ip: typeof ip === "string" ? ip : ip?.address ?? "unknown",
    headers: request.headers.toJSON(),
    query: Object.fromEntries(new URL(request.url).searchParams),
    params,
    body: request.body ? request.json() : undefined,
  };
}

export type HTTPExceptionTypes = typeof HTTPExceptions[number]['type'];

export class HTTPException extends Error {
  public type: HTTPExceptionTypes;
  public code: number;

  constructor(message: string, type: HTTPExceptionTypes) {
    super(message);
    this.type = type;
    const code = getHTTPExceptionCode(type);
    this.code = code ? code : 500;
  }
};


export function errorHandler() {
  return new Elysia()
    .onError({ as: "scoped" }, ({ error, request, server, params }) => {
      const context = createRequestContext({ request, server, params });

      if (error instanceof Error) {
        const errorType = error.message;
        const exceptionPayload = {
          message: "Unknown error occurred",
          type: errorType,
          code: getHTTPExceptionCode(errorType as HTTPExceptionTypes) || 500,
          timestamp: new Date(),
          context,
        };

        console.error("Unknown Exception:", exceptionPayload);

        return exceptionPayload;
      }
      else if (error instanceof HTTPException) {
        const exceptionPayload = {
          message: error.message,
          type: error instanceof HTTPException ? error.type : "INTERNAL_SERVER_ERROR",
          code: error instanceof HTTPException ? error.code : 500,
          timestamp: new Date(),
          context,
        };

        console.error("HTTP Exception:", exceptionPayload);

        return exceptionPayload;
      }
    });
};
