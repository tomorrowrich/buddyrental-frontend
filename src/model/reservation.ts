export interface Reservation {
  reservationId: string;
  price: number;
  reservationStart: string;
  reservationEnd: string;
  status: string;
  userId: string;
  buddyId: string;
  scheduleId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  buddy: {
    buddyId: string;
    balanceWithdrawable: number;
    description: string;
    ratingAvg: number;
    totalReviews: number;
    priceMin: number;
    priceMax: number;
    tagsCount: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    user: {
      userId: string;
      firstName: string;
      lastName: string;
      profilePicture: string | null;
      email: string;
      phoneNumber: string;
      citizenId: string;
      address: string;
    };
    tags: { id: string; name: string }[];
  };
}

export interface BookingData {
  id: string;
  name: string;
  email?: string;
  avatar: string | null;
  status: string;
  date: string;
  price: number;
}
