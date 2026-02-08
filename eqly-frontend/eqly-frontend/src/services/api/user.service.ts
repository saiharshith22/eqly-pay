/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiError, RegisterUserData, User } from "@/types/user.types";

const API_BASE_URL = "http://localhost:8080/api";

export class ApiErrorException extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public apiError?: ApiError,
  ) {
    super(message);
    this.name = "ApiErrorException";
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
    // const data = await response.json();
    /**
     * Check if response has body
     * 204 No Content = no body
     * 205 Reset Content = no body
     */
    const hasBody = response.status !== 204 && response.status !== 205;

    // Parse JSON only if response has body
    let data: any = null;
    if (hasBody) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }
    }

    if (!response.ok) {
      throw new ApiErrorException(
        data.message,
        response.status,
        data as ApiError,
      );
    }

    return data as T;
  } catch (error) {
    // Re-throw ApiErrorException as-is
    if (error instanceof ApiErrorException) {
      throw error;
    }

    // Network errors, JSON parse errors, etc.
    throw new ApiErrorException(
      error instanceof Error ? error.message : "Unknown error occurred",
      0,
    );
  }
}

export const userService = {
  async registerUser(userData: RegisterUserData): Promise<User> {
    return fetchApi<User>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },
  async getAllUsers(): Promise<User[]> {
    return fetchApi<User[]>("/users");
  },
  async getById(id: number): Promise<User> {
    return fetchApi<User>(`/users/${id}`);
  },
  async getByEmail(email: string): Promise<User> {
    return fetchApi<User>(`/users/email/${email}`);
  },
  async update(id: number, userData: Partial<RegisterUserData>): Promise<User> {
    return fetchApi<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },
  async deleteUser(id: number): Promise<void> {
    return fetchApi<void>(`/users/${id}`, {
      method: "DELETE",
    });
  },
};
