import { type StateStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const calendarStorage = new MMKV({
  id: 'calendar-storage',
  encryptionKey: 'tryitagain',
});

const calendarDataStorage: StateStorage = {
  setItem: (key: string, value: any) => {
    return calendarStorage.set(key, value);
  },
  getItem: (key: string) => {
    const value = calendarStorage.getString(key);
    return value ?? null;
  },
  removeItem: (key: string) => {
    return calendarStorage.delete(key);
  },
};

export default calendarDataStorage;
