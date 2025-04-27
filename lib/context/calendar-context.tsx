import React, {
  createContext,
  useContext,
  ReactNode,
  RefObject,
} from 'react';
import { CalendarListRef } from '@fowusu/calendar-kit';

type CalendarContextType = {
  calendarListRef: RefObject<CalendarListRef> | null;
};

const CalendarContext = createContext<CalendarContextType>({
  calendarListRef: null,
});

export const useCalendarContext = () => useContext(CalendarContext);

type CalendarProviderProps = {
  children: ReactNode;
  calendarListRef: RefObject<CalendarListRef>;
};

const CalendarProvider: React.FC<CalendarProviderProps> = ({
  children,
  calendarListRef,
}) => {
  return (
    <CalendarContext.Provider value={{ calendarListRef }}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarProvider;
