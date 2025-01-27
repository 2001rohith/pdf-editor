import axios from "axios";
import { BACKEND_URL } from "../utils/axiosUrl";

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export const handleSignup = async (payload: SignupPayload) => {
  console.log("log from user service", payload)
  const response = await axios.post(`${BACKEND_URL}/signup`, payload);
  return response.data;
};

export const handleLogin = async (email: string, password: string) => {
  console.log("log from user service")
  const response = await axios.post(`${BACKEND_URL}/login`, { email, password });
  return response.data;
};