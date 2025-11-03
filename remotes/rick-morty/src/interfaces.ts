import type { ReactNode } from 'react';

export interface CharacterOrigin {
  name: string;
  url: string;
}

export interface CharacterLocation {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: CharacterOrigin;
  location: CharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface ApiResponse {
  info: ApiInfo;
  results: Character[];
}

export type SortKey = 'id' | 'name' | 'species' | 'gender' | 'created' | null;
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export interface SortIconProps {
  columnKey: SortKey;
}

export interface AuthGuardProps {
  children: ReactNode;
}

export interface AuthStorageState {
  state?: {
    isAuthenticated?: boolean;
  };
}

