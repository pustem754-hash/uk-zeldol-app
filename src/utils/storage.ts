import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const STORAGE_KEYS = {
  USER: '@user',
  AUTH_TOKEN: '@auth_token',
};

export const Storage = {
  // Сохранить пользователя
  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // Получить пользователя
  async getUser(): Promise<User | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  // Удалить пользователя (выход)
  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Проверка авторизации
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getUser();
    return user !== null;
  },
};

