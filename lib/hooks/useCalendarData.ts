import { useState, useEffect } from 'react';
import calendarApi, { CalendarDayData } from '../api/mockCalendarApi';

interface CalendarDataState {
  loading: boolean;
  error: Error | null;
  data: Record<string, CalendarDayData> | null;
}

// Custom hook to fetch calendar data
export function useCalendarData() {
  const [state, setState] = useState<CalendarDataState>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Show loading state
        setState((prev) => ({ ...prev, loading: true }));

        // Fetch data from the API
        const calendarData = await calendarApi.getCalendarDays();

        // Update state if component is still mounted
        if (isMounted) {
          setState({
            loading: false,
            error: null,
            data: calendarData,
          });
        }
      } catch (error) {
        // Handle error if component is still mounted
        if (isMounted) {
          setState({
            loading: false,
            error:
              error instanceof Error
                ? error
                : new Error('Unknown error occurred'),
            data: null,
          });
        }
      }
    };

    fetchData();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}

// Custom hook to fetch data for a specific date
export function useCalendarDay(date: string) {
  const [state, setState] = useState<{
    loading: boolean;
    error: Error | null;
    data: CalendarDayData | null;
  }>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchDay = async () => {
      if (!date) return;

      try {
        setState((prev) => ({ ...prev, loading: true }));

        const dayData = await calendarApi.getCalendarDay(date);

        if (isMounted) {
          setState({
            loading: false,
            error: null,
            data: dayData,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            loading: false,
            error:
              error instanceof Error
                ? error
                : new Error('Unknown error occurred'),
            data: null,
          });
        }
      }
    };

    fetchDay();

    return () => {
      isMounted = false;
    };
  }, [date]);

  return state;
}

// Custom hook to fetch data for a date range
export function useCalendarRange(startDate: string, endDate: string) {
  const [state, setState] = useState<CalendarDataState>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchRange = async () => {
      if (!startDate || !endDate) return;

      try {
        setState((prev) => ({ ...prev, loading: true }));

        const rangeData = await calendarApi.getEventsForDateRange(
          startDate,
          endDate
        );

        if (isMounted) {
          setState({
            loading: false,
            error: null,
            data: rangeData,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            loading: false,
            error:
              error instanceof Error
                ? error
                : new Error('Unknown error occurred'),
            data: null,
          });
        }
      }
    };

    fetchRange();

    return () => {
      isMounted = false;
    };
  }, [startDate, endDate]);

  return state;
}
