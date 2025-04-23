export interface Booking {
  reservationId: string;
  price: number;
  reservationStart: string;
  reservationEnd: string;
  status: string;
  userId: string;
  buddyId: string;
  scheduleId: string;
  createdAt: string;
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
    tags: { tagId: string; name: string }[];
  };
}

export interface Reservation {
  reservationId: string;
  detail: string;
  price: number;
  reservationStart: string;
  reservationEnd: string;
  status: string;
  userId: string;
  buddyId: string;
  scheduleId: string;
  createdAt: string;
  user: {
    userId: string;
    firstName: string;
    lastName: string;
    profilePicture: null | string;
    email: string;
    phoneNumber: string;
    citizenId: string;
    address: string;
    interests: { tagId: string; name: string }[];
  };
}
