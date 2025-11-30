import { decodeJwt } from "jose";
import * as SecureStore from "expo-secure-store";
import { IPerfil } from "../types/index.type";

const TOKEN_KEY = "auth_token";

export const authService = {
  saveToken: async (token: string): Promise<void> => {
    if (typeof localStorage !== "undefined")
      localStorage.setItem(TOKEN_KEY, token);
    else await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  getToken: async (): Promise<string | null> => {
    if (typeof localStorage !== "undefined")
      return localStorage.getItem(TOKEN_KEY);
    else return await SecureStore.getItemAsync(TOKEN_KEY);
  },
  deleteToken: async (): Promise<void> => {
    if (typeof localStorage !== "undefined") localStorage.removeItem(TOKEN_KEY);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
  // getUserInfo: (): any => {
  //   const token = localStorage.getItem(TOKEN_KEY);

  //   if (!token || token === "") return false;

  //   try {
  //     const { id, email, nome, perfil } = decodeJwt(token);
  //     return { id, email, nome, perfil };
  //   } catch {
  //     localStorage.removeItem(TOKEN_KEY);
  //     return false;
  //   }
  // },
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
