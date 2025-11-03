import type { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export interface PasswordValidations {
  minLength: boolean;
  maxLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasSpecialChar: boolean;
  hasNumber: boolean;
}

export interface ValidationItemProps {
  isValid: boolean;
  text: string;
}

export interface User {
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  lastActivity: number | null;
  login: (userData: User) => void;
  logout: () => void;
  updateActivity: () => void;
  checkSession: () => boolean;
}

export interface AuthHandlerProps {
  children: ReactNode;
}

export interface ProtectedRouteProps {
  children: ReactNode;
}

