import { Dayjs } from "dayjs";

export interface LoginResponse {
  accessToken: string;
}

export type UserGender = "MALE" | "FEMALE" | "OTHER" | "UNKNOWN";
export interface SignUpFormData {
  firstName: string;
  lastName: string;
  idCard: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;

  nickname: string;
  dateOfBirth: Dayjs | null;
  gender: UserGender;
  address: string;
  city: string;
  zipcode: string;
  profilePicture?: File | null;
}

export const initialSignUpData: SignUpFormData = {
  firstName: "",
  lastName: "",
  idCard: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
  nickname: "",
  dateOfBirth: null,
  gender: "UNKNOWN",
  address: "",
  city: "",
  zipcode: "",
  profilePicture: null,
};
