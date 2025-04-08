export interface GetBuddyParams {
  buddyId: string;
}

export interface ListBuddiesParams {
  page?: number;
  limit?: number;
  filter?: {
    priceMin?: number;
    priceMax?: number;
    ratingMin?: number;
    tags?: string[];
  };
  sort?: {
    field: string;
    direction: string;
  };
}

export interface CreateBuddyRequest {
  priceMin: number;
  priceMax?: number | null;
  description?: string | null;
}

export interface UpdateBuddyRequest {
  buddyId: string;
  priceMin?: number;
  priceMax?: number | null;
  balanceWithdrawable?: number;
}
