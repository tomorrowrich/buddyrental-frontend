import { Dayjs } from "dayjs";

export interface SignUpFormData {
  // Initial signup fields
  firstName: string;
  lastName: string;
  idCard: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;

  // Complete profile fields
  nickname: string;
  dateOfBirth: Dayjs | null;
  gender: "M" | "F" | "O";
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
  gender: "O",
  address: "",
  city: "",
  zipcode: "",
  profilePicture: null,
};
