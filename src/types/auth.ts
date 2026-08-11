import { DrinkDetail } from "./cocktail";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordFormValues {
  password: string;
}

export interface ResetPasswordRequestFormValues {
  email: string;
}

export interface UpdateProfileFormValues {
  name: string;
}

export interface UserFeedbackItem {
  id: number;
  comment: string;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
  drink: DrinkDetail;
}
