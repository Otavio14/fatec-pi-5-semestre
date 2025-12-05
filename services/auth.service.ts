import { decodeJwt } from "jose";
import * as SecureStore from "expo-secure-store";
import { IPerfil } from "../types/index.type";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";

const isWeb = Platform.OS === "web";

const storage = {
  setItem: async (key: string, value: string): Promise<void> => {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  getItem: async (key: string): Promise<string | null> => {
    if (isWeb) {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const authService = {
  saveToken: async (token: string): Promise<void> => {
    await storage.setItem(TOKEN_KEY, token);
  },
  getToken: async (): Promise<string | null> => {
    return await storage.getItem(TOKEN_KEY);
  },
  deleteToken: async (): Promise<void> => {
    await storage.removeItem(TOKEN_KEY);
  },
  isAuthenticated: async (): Promise<boolean> => {
    const token = await authService.getToken();

    if (!token || token === "") return false;

    try {
      const { exp } = decodeJwt(token) as { exp: number };
      return exp * 1000 >= Date.now();
    } catch {
      await authService.deleteToken();
      return false;
    }
  },
  isAuthenticatedAdmin: async (): Promise<boolean> => {
    const token = await authService.getToken();

    if (!token || token === "") return false;

    try {
      const { exp, perfil } = decodeJwt(token) as {
        exp: number;
        perfil: IPerfil;
      };
      return exp * 1000 >= Date.now() && perfil === "Administrador";
    } catch {
      await authService.deleteToken();
      return false;
    }
  },
};
