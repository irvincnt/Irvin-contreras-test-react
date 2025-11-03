import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';

import { decrypt, encrypt } from '../utils/secureStorage';
import { AuthState, User } from '../interfaces';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutos

const STORAGE_KEY = 'auth-storage';
type PersistedAuthState = Pick<AuthState, 'isAuthenticated' | 'user'>;

const defaultAuthState: Pick<AuthState, 'isAuthenticated' | 'user' | 'lastActivity'> = {
  isAuthenticated: false,
  user: null,
  lastActivity: null,
};

const isBrowser = typeof window !== 'undefined' && !!window.localStorage;

const encryptedStorage: StateStorage = {
  getItem: (name) => {
    if (!isBrowser) {
      return null;
    }

    const encryptedValue = window.localStorage.getItem(name);

    if (!encryptedValue) {
      return null;
    }

    try {
      return decrypt(encryptedValue);
    } catch (error) {
      console.warn(`No se pudo descifrar ${name}, se eliminará el almacenamiento.`, error);
      window.localStorage.removeItem(name);
      return null;
    }
  },
  setItem: (name, value) => {
    if (!isBrowser) {
      return;
    }

    const currentValue = window.localStorage.getItem(name);

    if (currentValue) {
      try {
        const decryptedCurrentValue = decrypt(currentValue);
        if (decryptedCurrentValue === value) {
          return;
        }
      } catch (error) {
        console.warn(`No se pudo descifrar ${name} al comparar, se sobrescribirá.`, error);
      }
    }

    const encryptedValue = encrypt(value);
    window.localStorage.setItem(name, encryptedValue);
  },
  removeItem: (name) => {
    if (!isBrowser) {
      return;
    }

    window.localStorage.removeItem(name);
  },
};

const storage = createJSONStorage<PersistedAuthState>(() => encryptedStorage);

const useAuthStore = create<AuthState>()(
  persist<AuthState, [], [], PersistedAuthState>(
    (set, get) => ({
      ...defaultAuthState,
      
      login: (userData: User) => set({ 
        isAuthenticated: true, 
        user: userData,
        lastActivity: Date.now()
      }),
      
      logout: () => set({ 
        ...defaultAuthState,
      }),
      
      updateActivity: () => {
        const state = get();
        if (state.isAuthenticated) {
          set({ lastActivity: Date.now() });
        }
      },
      
      checkSession: (): boolean => {
        const state = get();
        if (state.isAuthenticated && state.lastActivity) {
          const timeElapsed = Date.now() - state.lastActivity;
          if (timeElapsed > INACTIVITY_TIMEOUT) {
            set({ 
              ...defaultAuthState,
            });
            return false;
          }
          return true;
        }
        return state.isAuthenticated;
      },
    }),
    {
      name: STORAGE_KEY,
      storage,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;

