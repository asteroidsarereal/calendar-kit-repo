import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  type PersistOptions,
} from 'zustand/middleware';
import { format } from 'date-fns';
import calendarDataStorage from '@/lib/utils/calendar-storage';
import { toLocaleDateString } from '@fowusu/calendar-kit';
type CalendarState = {
  calendarDays: any[];
  currentMonth: string;
  initialDate: string;
  layoutMode: string;
  selectedDate: string;
};

type CalendarActions = {
  setCalendarDays: (days: any[]) => void;
  setCurrentMonth: (month: string) => void;
  setInitialDate: (date: string) => void;
  setLayoutMode: (mode: string) => void;
  setSelectedDate: (date: string) => void;
};

type CalendarPersist = PersistOptions<
  CalendarState & CalendarActions
>;

const persistConfig: CalendarPersist = {
  name: 'calendar-store-03',
  storage: createJSONStorage(() => calendarDataStorage),
};

// Create a date in 2025 that matches today's month/day
const today = new Date();
const initial2025Date = new Date(
  2025,
  today.getMonth(),
  today.getDate()
);
const formatDate = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

const useCalendarStore = create(
  persist<CalendarState & CalendarActions>(
    (set) => ({
      calendarDays: [],
      currentMonth: formatDate(initial2025Date),
      initialDate: formatDate(initial2025Date),
      selectedDate: formatDate(initial2025Date),
      layoutMode: 'FULL_SCREEN',
      setCalendarDays: (days: any[]) => set({ calendarDays: days }),
      setCurrentMonth: (month: string) =>
        set({ currentMonth: month }),
      setInitialDate: (date: string) => set({ initialDate: date }),
      setLayoutMode: (mode: string) => set({ layoutMode: mode }),
      setSelectedDate: (date: string) => set({ selectedDate: date }),
    }),
    persistConfig
  )
);

export default useCalendarStore;
