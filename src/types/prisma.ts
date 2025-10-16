import { Prisma } from "@prisma/client";

export type Reports = Prisma.ReportGetPayload<{
  omit: {
    categoryId: true;
    rewardBadgeId: true;
  };
  include: {
    user: { select: { id: true; name: true; email: true } };
    images: { select: { url: true } };
    category: { select: { id: true; name: true } };
    Notification: { select: { id: true } };
  };
}>;
