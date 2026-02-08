// backend model
export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  upiId?: string;
  createdAt: string;
}

export interface RegisterUserData {
  name: string;
  email: string;
  phoneNumber?: string;
  upiId?: string;
}

/**
 * API error response structure
 * Matches GlobalExceptionHandler ErrorResponse
 */
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface FormState {
  success?: boolean;
  error?: string;
  data?: User;
}
