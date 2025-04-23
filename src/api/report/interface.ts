export interface ReportPayload {
  buddyId?: string;
  categoryId: string;
  details: string;
}

export interface ReportResponse {
  reportId: string;
  userId: string;
  buddyId: string;
  categoryId: string;
  details: string;
  status: string;
}

export interface CategoriesProps {
  take: number;
  skip: number;
}

export interface CategoriesResponse {
  id: string;
  name: string;
}

export interface CategoriesApiResponse {
  success: boolean;
  data: {
    data: CategoriesResponse[];
    take: number;
    skip: number;
    totalCount: number;
  };
}

export interface ReportData {
  id: string;
  reporterId: string;
  userId: string;
  buddyId?: string;
  categoryId: string;
  details: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export enum status {
  "PENDING",
  "RESOLVED",
}
