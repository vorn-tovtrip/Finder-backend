import { Prisma } from "@prisma/client";
declare global {
  namespace Express {
    interface Request {
      filters?: Prisma.ReportWhereInput;
    }
  }
}
