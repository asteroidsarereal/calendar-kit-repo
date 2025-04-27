import { useQuery } from '@tanstack/react-query';
import calendarApi from '../api/mockCalendarApi';

/**
 * Calendar query keys for TanStack Query cache
 */
export const calendarKeys = {
  all: ['calendar'] as const,
  days: () => [...calendarKeys.all, 'days'] as const,
  day: (date: string) => [...calendarKeys.days(), date] as const,
  range: (start: string, end: string) =>
    [...calendarKeys.days(), 'range', start, end] as const,
};

/**
 * Hook to fetch all calendar days
 */
export function useCalendarDays() {
  return useQuery({
    queryKey: calendarKeys.days(),
    queryFn: () => calendarApi.getCalendarDays(),
  });
}

/**
 * Hook to fetch a specific calendar day
 */
export function useCalendarDay(date: string) {
  return useQuery({
    queryKey: calendarKeys.day(date),
    queryFn: () => calendarApi.getCalendarDay(date),
    // Skip the query if no date is provided
    enabled: !!date,
  });
}

/**
 * Hook to fetch calendar data for a specific date range
 */
export function useCalendarRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: calendarKeys.range(startDate, endDate),
    queryFn: () =>
      calendarApi.getEventsForDateRange(startDate, endDate),
    // Skip the query if either date is missing
    enabled: !!startDate && !!endDate,
  });
}
