import { ReportType } from "@prisma/client";

export type CreateReportPayload = {
  type: ReportType;
  title: string;
  description: string;
  location?: string;
  imageId?: number;
  imageUrl: string;
  userId: number;
  contactnumber: string;
  rewardBadgeId?: number;
  categoryId?: number;
};

export type UpdateReportPayload = Partial<CreateReportPayload>;
