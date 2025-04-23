import { Review } from "./review";
import { User } from "./user";

export interface Buddy {
  buddyId: string;
  description: string;
  balanceWithdrawable: number;
  ratingAvg: number | null;
  totalReviews: number;
  priceMin: number;
  priceMax: number | null;
  tagsCount: number;
  userId: string | null;
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface BuddyWithUser extends Buddy {
  user: User;
}
