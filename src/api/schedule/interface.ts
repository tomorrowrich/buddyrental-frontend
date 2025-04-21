export enum ReservationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  UNAVAILABLE = "UNAVAILABLE",
  COMPLETED = "COMPLETED",
}

export interface ScheduleQueryParams {
  role?: string;
  status?: ReservationStatus;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}
