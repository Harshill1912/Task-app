import axios from "axios";

interface ApiErrorBody {
  message?: string;
  errors?: { msg?: string }[];
}

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again."
) => {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const data = error.response?.data;
    const validationMessage = data?.errors?.[0]?.msg;

    return data?.message || validationMessage || fallback;
  }

  return fallback;
};
