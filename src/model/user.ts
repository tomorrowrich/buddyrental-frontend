export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  citizenId: string;
  email: string;
  phoneNumber: string;
  verified: boolean;
  displayName?: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "UNKNOWN";
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  profilePicture?: string;
  description?: string;
  interests?: Interest[];
}

export interface Interest {
  tagId: string;
  name: string;
}
