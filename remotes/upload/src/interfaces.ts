import type { ReactNode } from 'react';

export interface UploadedFile {
  id: number;
  file: File;
  name: string;
  size: string;
  type: string;
  uploadProgress: number;
  previewUrl: string | null;
}

export interface AuthGuardProps {
  children: ReactNode;
}

export interface AuthStorageState {
  state?: {
    isAuthenticated?: boolean;
  };
}

