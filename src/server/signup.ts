import { SignUpFormData } from "@/interface/signup/signup";
import axios from "axios";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function registerUser(data: SignUpFormData) {
  console.log("Registering user with data:", data);
  return axios
    .post(`${baseURL}/auth/register`, data, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      console.log("User registered successfully", res.data);
      return { success: true, data: res.data, error: null };
    })
    .catch((err) => {
      console.error("Error registering user", err);
      return { success: false, error: err, data: null };
    });
}
