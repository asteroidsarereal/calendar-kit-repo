import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import useCalendarStore from '@/lib/store/store';
import {
  CalendarList,
  CalendarListRef,
  StateInputParams,
} from '@fowusu/calendar-kit';
import { useCallback, useRef } from 'react';
import useCalculateMonths from '@/hooks/useCalculateMonths';
import CalendarProvider, {
  useCalendarContext,
} from '@/lib/context/calendar-context';
import MonthHeader from '@/components/month-header';
import WeekHeader from '@/components/week-header';
import { CalendarItem, CalendarItemType } from '@/lib/types';
import { DayComponent } from '@/components/Day';
import React from 'react';
import { useCalendarDays } from '@/lib/hooks/useCalendarQueries';

const { width } = Dimensions.get('window');

export default function TabTwoScreen() {
  // Create a global ref that persists across renders
  const calendarListRef = useRef<CalendarListRef>(null);

  return (
    <CalendarProvider calendarListRef={calendarListRef}>
      <ExploreContent />
    </CalendarProvider>
  );
}

// Separated component for cleaner organization
function ExploreContent() {
  const calendarStore = useCalendarStore();
  const { calendarListRef } = useCalendarContext();
  const { pastMonthsCount, futureMonthsCount } = useCalculateMonths();
  const initialDate = useCalendarStore((state) => state.initialDate);
  const setCurrentMonth = useCalendarStore(
    (state) => state.setCurrentMonth
  );

  // Fetch calendar data using TanStack Query
  const {
    data: calendarDays,
    isLoading,
    isError,
    error,
  } = useCalendarDays();

  console.log('calendarDays', calendarDays);

  // Force navigation to 2025 when calendar loads
  React.useEffect(() => {
    // Delay by 500ms to ensure everything is loaded
    const timer = setTimeout(() => {
      if (calendarListRef && calendarListRef.current) {
        // Create a date string for Jan 15, 2025
        const date2025String = '2025-01-15';

        // Navigate to that date
        calendarListRef.current.scrollToDate(date2025String);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [calendarListRef]);

  const onDayPress = useCallback((day: any) => {
    // User pressed a day, can be used for selection logic if needed
  }, []);

  const onMonthChange = useCallback((month: any) => {
    setCurrentMonth(month);
  }, []);

  const createDayState = useCallback(
    ({ dateString }: StateInputParams) => {

      console.log('dateString', dateString)// Show an empty state while data is loading
      if (isLoading || !calendarDays) {
        return { availability: { items: [] } };
      }

      // Try various date formats to ensure we find the data
      let dayData = null;

      // First, try direct lookup with the given dateString
      if (calendarDays[dateString]) {
        dayData = calendarDays[dateString];
      }
      // Try treating it as a Date object string that might include time
      else {
        // Try to extract just the date part and look up again
        try {
          const datePart = dateString.split('T')[0];
          if (calendarDays[datePart]) {
            dayData = calendarDays[datePart];
          } else {
            // Try to create 2025 version of this date
            const dateObj = new Date(dateString);
            const year2025Date = `2025-${String(
              dateObj.getMonth() + 1
            ).padStart(2, '0')}-${String(dateObj.getDate()).padStart(
              2,
              '0'
            )}`;

            if (calendarDays[year2025Date]) {
              dayData = calendarDays[year2025Date];
            }
          }
        } catch (err) {
          // Ignore date parsing errors
        }
      }

      if (!dayData) {
        return { availability: { items: [] } };
      }

      // Map types properly to ensure they match the expected types
      const processedItems = dayData.items.map(
        (item: CalendarItem) => {
          // Ensure itemType is set properly if missing
          if (!item.itemType) {
            let itemType: CalendarItemType = 'LEAVE';
            if (item.type === 'Holiday') itemType = 'HOLIDAY';
            else if (item.type === 'Sick Leave') itemType = 'ABSENCE';
            return { ...item, itemType };
          }
          return item;
        }
      );

      const state = {
        availability: {
          status:
            processedItems.length > 0 ? 'HAS_EVENTS' : 'AVAILABLE',
          items: processedItems || [],
        },
      };

      return state;
    },
    [isLoading, calendarDays]
  );

  // Show loading state when data is being fetched
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#458c4f" />
        <Text style={styles.loadingText}>
          Loading calendar data...
        </Text>
      </View>
    );
  }

  // Show error state if API request failed
  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error loading calendar data
        </Text>
        <Text>
          {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </View>
    );
  }



  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <MonthHeader />
      <CalendarList
        ref={calendarListRef}
        estimatedCalendarSize={{
          fiveWeekCalendarSize: Platform.select({
            android: 251.4,
            default: 248.7,
          }),
        }}
        futureMonthsCount={futureMonthsCount}
        pastMonthsCount={pastMonthsCount}
        showExtraDays={true}
        currentDate={initialDate}
        onDayPress={onDayPress}
        firstDayOfWeek={1}
        locale={'en-US'}
        weekdaysFormat="short"
        customStateCreator={createDayState}
        DayComponent={DayComponent}
        horizontal
        weeksContainerStyle={{
          borderWidth: 1,
          borderRadius: 8,
          borderColor: '#D0E2FB',
          gap: 0,
        }}
        calendarContentContainerStyle={{
          flex: 1,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}
        showScrollIndicator={false}
        showMonthName={false}
        WeekDayNameComponent={WeekHeader}
        onActiveMonthChange={onMonthChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 8,
  },
});
