import React, { memo, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { CalendarDay, CalendarItem, CalendarItemType } from '@/features/calendar/calendar.props';
import { Text } from '@/ui/atoms/rn-text';
import { View } from '@/ui/atoms/view';
import { theme } from '@/theme';
import CalendarIndicator from './calendar-indicator';
import LeaveIndicatorBar from './leave-indicator-bar';
import { CalendarLayoutMode } from '@/core/calendar/calendar';
import { useNavigation } from '@react-navigation/native';
import { CalendarScreenProps } from '@/navigation/types';
import CalendarEllipsis from './calendar-ellipsis';
import { isEqual, format } from 'date-fns';

// Define color constants to avoid theme property access issues
const PRIMARY_COLOR = theme.palette.brand[500]; // Blue for today's date
const SECONDARY_COLOR = theme.palette.brand[500]; // Blue for selected dates
const TEXT_COLOR = theme.palette.grey[900]; // Dark color for text

type CalendarDayCellProps = {
  date: Date;
  dayNumber: string;
  calendarData?: CalendarDay;
  isCurrentMonth: boolean;
  isToday?: boolean;
  isSelected: boolean;
  onPress: (date: Date) => void;
  layoutMode: CalendarLayoutMode;
  hasBorder?: boolean;
};

type ContainerStyleName = 'regularContainer' | 'todayContainer' | 'selectedContainer';

type ProcessedCalendarItems = {
  leaveItems: CalendarItem[];
  visibleItems: CalendarItem[];
  hasMoreItems: boolean;
};

// Optimized processing function with memoization support
const processCalendarItems = (
  items: CalendarItem[] = [],
  maxVisibleItems: number = 3,
): ProcessedCalendarItems => {
  if (!items || items.length === 0) {
    return {
      leaveItems: [],
      visibleItems: [],
      hasMoreItems: false,
    };
  }

  // Filter leave-related items for horizontal bars
  const leaveItems = items.filter((item) => ['LEAVE', 'HOLIDAY', 'ABSENCE'].includes(item.type));

  // For both layouts, limit visible indicators
  const visibleItems = items.slice(0, maxVisibleItems);
  const hasMoreItems = items.length > maxVisibleItems;

  return {
    leaveItems,
    visibleItems,
    hasMoreItems,
  };
};

// Get container style name based on cell state
const getContainerStyleName = (
  isToday: boolean,
  isSelected: boolean,
  layoutMode: string,
): ContainerStyleName => {
  if (isToday) {
    return 'todayContainer';
  } else if (isSelected && layoutMode === 'SPLIT_SCREEN') {
    return 'selectedContainer';
  }
  return 'regularContainer';
};

// Create a comparison function for CalendarDayCell props to avoid unnecessary re-renders
const arePropsEqual = (
  prevProps: CalendarDayCellProps,
  nextProps: CalendarDayCellProps,
): boolean => {
  // Basic property comparison
  if (
    prevProps.dayNumber !== nextProps.dayNumber ||
    prevProps.isCurrentMonth !== nextProps.isCurrentMonth ||
    prevProps.isToday !== nextProps.isToday ||
    prevProps.isSelected !== nextProps.isSelected ||
    prevProps.layoutMode !== nextProps.layoutMode ||
    prevProps.hasBorder !== nextProps.hasBorder
  ) {
    return false;
  }

  // Date comparison
  if (!isEqual(prevProps.date, nextProps.date)) {
    return false;
  }

  // Calendar data comparison - compare only what's needed for rendering
  const prevItems = prevProps.calendarData?.items || [];
  const nextItems = nextProps.calendarData?.items || [];

  if (prevItems.length !== nextItems.length) {
    return false;
  }

  // Only do deep comparison of items if lengths match and there are items
  if (prevItems.length > 0) {
    // Simple signature-based comparison instead of deep equality
    const prevTypes = prevItems.map((item: CalendarItem) => item.type).join(',');
    const nextTypes = nextItems.map((item: CalendarItem) => item.type).join(',');

    if (prevTypes !== nextTypes) {
      return false;
    }
  }

  // Props are considered equal
  return true;
};

// Cache for processed item data to prevent redundant calculations
const processedItemsCache = new Map();

// Type definition for cell style component
type CellStyleResult = {
  cellStyle: ViewStyle;
  textStyle: TextStyle;
  containerStyle: ViewStyle;
};

const CalendarDayCell = memo(
  ({
    date,
    dayNumber,
    calendarData,
    isCurrentMonth,
    isToday = false,
    isSelected,
    onPress,
    layoutMode,
    hasBorder = false,
  }: CalendarDayCellProps) => {
    const navigation = useNavigation<CalendarScreenProps<'CalendarScreen'>['navigation']>();
    const dateKey = date.toISOString();

    // Extract items from calendar data - memoize this calculation with caching
    const { items, leaveItems, visibleItems, hasMoreItems } = useMemo(() => {
      // Check if we've already processed this date's data
      const cacheKey = `${dateKey}-${calendarData?.items?.length || 0}`;
      if (processedItemsCache.has(cacheKey)) {
        return processedItemsCache.get(cacheKey);
      }

      const allItems = calendarData?.items || [];

      // Process items using our optimized function
      const MAX_VISIBLE_INDICATORS = 3;
      const processed = processCalendarItems(allItems, MAX_VISIBLE_INDICATORS);

      // Create full result with the original items
      const result = {
        items: allItems,
        leaveItems: processed.leaveItems,
        visibleItems: processed.visibleItems,
        hasMoreItems: processed.hasMoreItems,
      };

      // Cache the processed data
      processedItemsCache.set(cacheKey, result);
      // Prevent the cache from growing too large
      if (processedItemsCache.size > 500) {
        const oldestKey = processedItemsCache.keys().next().value;
        processedItemsCache.delete(oldestKey);
      }

      return result;
    }, [dateKey, calendarData]);

    // Memoize style calculations to prevent recalculation on every render
    const { cellStyle, textStyle, containerStyle } = useMemo<CellStyleResult>(() => {
      // Base text style for all dates (today and regular)
      const baseFontSize = layoutMode === 'FULL_SCREEN' ? 16 : 14;

      // Cell styles based on day state
      const cellStyleCalc = [
        styles.cell,
        hasBorder && styles.cellWithBorder,
        // Adjust cell padding based on layout mode
        { padding: layoutMode === 'FULL_SCREEN' ? 2 : 1 },
        !isCurrentMonth && { backgroundColor: '#e9e9ec' },
      ];

      // Text styles without "today" styling
      const textStyleCalc = [
        styles.dayText,
        // Only apply white text for selected dates in split screen mode
        layoutMode === 'SPLIT_SCREEN' && isSelected && !isToday && { color: 'white' },
        // Apply consistent font size to all days
        { fontSize: baseFontSize },
        // If today, use white text for better contrast
        isToday && { color: 'white' },
      ];

      // Get container style name
      const containerStyleName = getContainerStyleName(isToday, isSelected, layoutMode);

      // Map the style name to the actual style object
      let containerStyleObj: ViewStyle;
      switch (containerStyleName) {
        case 'todayContainer':
          containerStyleObj = styles.todayContainer;
          break;
        case 'selectedContainer':
          containerStyleObj = styles.selectedContainer;
          break;
        default:
          containerStyleObj = styles.regularContainer;
      }

      return {
        cellStyle: StyleSheet.flatten(cellStyleCalc),
        textStyle: StyleSheet.flatten(textStyleCalc),
        containerStyle: containerStyleObj,
      };
    }, [layoutMode, isCurrentMonth, isSelected, isToday, hasBorder]);

    // Memoize the press handler to maintain referential equality
    const handlePress = useMemo(() => {
      return () => {
        // Always call the original onPress function to handle selection
        onPress(date);

        // Only navigate to employee list if in fullscreen mode and there are leave items
        if (layoutMode === 'FULL_SCREEN' && leaveItems.length > 0) {
          navigation.navigate('LeaveEmployeesScreen', {
            date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
            items: leaveItems,
          });
        }
      };
    }, [date, onPress, layoutMode, leaveItems, navigation]);

    return (
      <TouchableOpacity
        style={cellStyle}
        onPress={handlePress}
        accessibilityLabel={`${dayNumber}${isToday ? ', Today' : ''}${
          leaveItems.length > 0 ? `, ${leaveItems.length} employees on leave` : ''
        }`}
        accessibilityRole="button"
        activeOpacity={0.7}>
        <View style={containerStyle}>
          <Text style={textStyle}>{dayNumber}</Text>
        </View>

        {/* Display appropriate indicators based on layout mode */}
        {layoutMode === 'FULL_SCREEN' && leaveItems.length > 0 ? (
          <View style={styles.barsContainer}>
            {leaveItems
              .slice(0, Math.min(3, leaveItems.length))
              .map((item: CalendarItem, index: number) => (
                <LeaveIndicatorBar
                  key={`${item.id}-${index}`}
                  type={item.type as CalendarItemType}
                  index={index}
                  total={Math.min(leaveItems.length > 3 ? 4 : leaveItems.length, 4)}
                />
              ))}
            {leaveItems.length > 3 && <CalendarEllipsis />}
          </View>
        ) : (
          visibleItems.length > 0 && (
            <View style={styles.indicatorsContainer}>
              {visibleItems.map((item: CalendarItem, index: number) => (
                <CalendarIndicator
                  key={`${index}-${item.type}`}
                  type={item.type as CalendarItemType}
                  size="small"
                />
              ))}
              {hasMoreItems && <CalendarEllipsis />}
            </View>
          )
        )}
      </TouchableOpacity>
    );
  },
  arePropsEqual,
);

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    padding: 4,
    alignItems: 'center',
    position: 'relative',
  },
  cellWithBorder: {
    borderWidth: 0.3,
    borderColor: '#e2e8f0',
  },
  regularContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  todayContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: PRIMARY_COLOR,
  },
  selectedContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: SECONDARY_COLOR,
  },
  dayText: {
    color: TEXT_COLOR,
    fontWeight: '600',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
    gap: 2,
  },
  barsContainer: {
    width: '100%',
    marginTop: 2,
    paddingHorizontal: 2,
  },
});

export default CalendarDayCell;
