import axios from "axios";
import { API_BASE_URL } from "@/constants";

export async function refreshSession(){
  const { data } = await axios.post(
    `${API_BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true, timeout: 15000 }
  );
  return data;
}
