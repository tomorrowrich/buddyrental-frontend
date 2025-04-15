export interface Review {
  commenterId: string;
  profileId: string;
  rating: number;
  comment: string;
  reviewId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
