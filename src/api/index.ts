import axios from "axios";

import { BASE_URL } from "~/shared/constants/apiURL";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    common: {
      "Content-Type": "application/json",
    },
  },
});
