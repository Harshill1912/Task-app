import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const TOKEN_KEY = "task_tracker_token";
export const USER_KEY = "task_tracker_user";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
}

const getWebStorage = () =>
  typeof window === "undefined" ? undefined : window.localStorage;

export const tokenStorage = {
  get: async () => {
    if (Platform.OS === "web") {
      return getWebStorage()?.getItem(TOKEN_KEY) || null;
    }

    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  set: async (token: string) => {
    if (Platform.OS === "web") {
      getWebStorage()?.setItem(TOKEN_KEY, token);
      return;
    }

    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  remove: async () => {
    if (Platform.OS === "web") {
      getWebStorage()?.removeItem(TOKEN_KEY);
      return;
    }

    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

export const userStorage = {
  get: async () => {
    const value =
      Platform.OS === "web"
        ? getWebStorage()?.getItem(USER_KEY) || null
        : await SecureStore.getItemAsync(USER_KEY);

    return value ? (JSON.parse(value) as StoredUser) : null;
  },
  set: async (user: StoredUser) => {
    const value = JSON.stringify(user);

    if (Platform.OS === "web") {
      getWebStorage()?.setItem(USER_KEY, value);
      return;
    }

    await SecureStore.setItemAsync(USER_KEY, value);
  },
  remove: async () => {
    if (Platform.OS === "web") {
      getWebStorage()?.removeItem(USER_KEY);
      return;
    }

    await SecureStore.deleteItemAsync(USER_KEY);
  }
};
