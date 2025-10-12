import { RequestHandler } from "express";

export type RouteDefinition<
  P = any,
  Q = Record<string, string | undefined>,
  ResBody = any,
  B = any
> = {
  method: "get" | "post" | "put" | "delete";
  path: string;
  handler: RequestHandler<P, ResBody, B, Q>;
  middlewares?: RequestHandler[];
};
