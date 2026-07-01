import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (data) => {
  const response = await axios.post(
    `${API_URL}/register`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return response.data;
};

export const loginUser = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};