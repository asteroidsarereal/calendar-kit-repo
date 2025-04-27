import mockCalendarData from '../utils/calendarMockdata';
import { CalendarItem } from '../types';

// Type for calendar day data returned by API
export interface CalendarDayData {
  date: string;
  items: CalendarItem[];
}

// Interface for our calendar API service
export interface CalendarApiService {
  getCalendarDays(): Promise<Record<string, CalendarDayData>>;
  getCalendarDay(date: string): Promise<CalendarDayData | null>;
  getEventsForDateRange(
    startDate: string,
    endDate: string
  ): Promise<Record<string, CalendarDayData>>;
}

// Simulated network delay (ms)
const SIMULATED_DELAY = 500;

/**
 * Mock Calendar API Service
 *
 * This class simulates API calls to fetch calendar data.
 * Each method returns a Promise that resolves after a delay
 * to mimic network latency.
 */
class MockCalendarApiService implements CalendarApiService {
  /**
   * Get all calendar days
   * @returns Promise with all calendar days data
   */
  getCalendarDays(): Promise<Record<string, CalendarDayData>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCalendarData.calendarDays);
      }, SIMULATED_DELAY);
    });
  }

  /**
   * Get data for a specific calendar day
   * @param date Date string in YYYY-MM-DD format
   * @returns Promise with calendar day data or null if not found
   */
  getCalendarDay(date: string): Promise<CalendarDayData | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Try to find the date in the mock data
        const dayData = mockCalendarData.calendarDays[date];

        // Also try with 2025 version if not found
        if (!dayData && !date.startsWith('2025')) {
          const dateObj = new Date(date);
          const year2025Date = `2025-${String(
            dateObj.getMonth() + 1
          ).padStart(2, '0')}-${String(dateObj.getDate()).padStart(
            2,
            '0'
          )}`;

          if (mockCalendarData.calendarDays[year2025Date]) {
            resolve(mockCalendarData.calendarDays[year2025Date]);
            return;
          }
        }

        resolve(dayData || null);
      }, SIMULATED_DELAY);
    });
  }

  /**
   * Get calendar events for a date range
   * @param startDate Start date in YYYY-MM-DD format
   * @param endDate End date in YYYY-MM-DD format
   * @returns Promise with calendar days in the range
   */
  getEventsForDateRange(
    startDate: string,
    endDate: string
  ): Promise<Record<string, CalendarDayData>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const result: Record<string, CalendarDayData> = {};

        // Filter days that fall within the range
        Object.keys(mockCalendarData.calendarDays).forEach(
          (dateStr) => {
            const date = new Date(dateStr);
            if (date >= start && date <= end) {
              result[dateStr] =
                mockCalendarData.calendarDays[dateStr];
            }
          }
        );

        resolve(result);
      }, SIMULATED_DELAY);
    });
  }
}

// Export a singleton instance
export const calendarApi = new MockCalendarApiService();

export default calendarApi;
