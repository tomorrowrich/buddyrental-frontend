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
