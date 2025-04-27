import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { InnerDayProps } from '@fowusu/calendar-kit';
import useContainerHeight from '@/hooks/use-container-height';
import useCalendarStore from '@/lib/store/store';
import LeaveIndicatorBar from './leave-indicator-bar';
import { CalendarItem } from '@/lib/types';
import CalendarEllipsis from './calendar-ellipsis';

export const DayComponent: React.FC<
  InnerDayProps<{ availability?: { items?: CalendarItem[] } }>
> = ({
  day,
  locale = 'en-US',
  state,
  isToday,
  isSelected,
  availability,
}) => {
  const { cellHeight, textSize } = useContainerHeight();
  const layoutMode = useCalendarStore((state) => state.layoutMode);
  const selectedDate = useCalendarStore(
    (state) => state.selectedDate
  );
  const isFullLayoutMode = layoutMode === 'FULL_SCREEN';
  const isInactive = state === 'inactive';

  // Check if this day matches the selected date from store
  const isStoreSelected = useMemo(() => {
    if (!selectedDate || !day) return false;
    const dayStr = day.toISOString().split('T')[0];
    return dayStr === selectedDate;
  }, [day, selectedDate]);

  // Get leave items directly from availability state created by customStateExtractor
  const leaveItems = useMemo(() => {
    // First check for real data
    let realItems: CalendarItem[] = [];
    if (
      availability?.items &&
      Array.isArray(availability.items) &&
      availability.items.length > 0
    ) {
      // Use the actual types from the mock data
      realItems = availability.items.filter(
        (item: CalendarItem | null) =>
          item &&
          item.type &&
          [
            'Holiday',
            'Sick Leave',
            'Personal Leave',
            'Training',
          ].includes(item.type)
      );

      if (realItems.length > 0) {
        return realItems;
      }
    }

    return [];
  }, [availability?.items, day]);


  const dayStyle = useMemo(() => {
    // Base styles object
    const styles: any = {};

    if (isInactive) {
      styles.containerStyle = containerStyles.inactive;
    }

    // For full layout mode
    if (isFullLayoutMode) {
      if (isToday) {
        styles.textStyle = textStyles.todayFullLayout;
        styles.textContainerStyle =
          textContainerStyles.todayFullLayout;
      }
    }
    // For split layout mode
    else {
      if (isStoreSelected) {
        // Selection styling takes precedence over inactive styling for text
        styles.textStyle = textStyles.selectedSplitLayout;
        styles.textContainerStyle =
          textContainerStyles.selectedSplitLayout;
      } else if (isToday) {
        styles.textStyle = textStyles.today;
      }
    }

    return styles;
  }, [state, isStoreSelected, isToday, isFullLayoutMode, isInactive]);

  return (
    <View
      style={[
        containerStyles.defaultContainer,
        dayStyle.containerStyle,
      ]}
    >
      <View
        style={[
          textContainerStyles.default,
          dayStyle.textContainerStyle,
          { height: cellHeight },
        ]}
      >
        <Text
          style={[
            textStyles.defaultDayText,
            dayStyle.textStyle,
            { fontSize: textSize },
          ]}
        >
          {day.toLocaleDateString(locale, { day: 'numeric' })}
        </Text>
      </View>

      <>
        {leaveItems.length > 0 && (
          <View
            style={[
              containerStyles.leaveIndicatorsContainer,
              {
                paddingBottom: 3,
                backgroundColor: '#f0f8ff',
                borderRadius: 4,
                width: '90%',
              },
            ]}
          >
            {leaveItems
              .slice(0, 3)
              .map((item: CalendarItem, index: number) => (
                <View key={`${day.toISOString()}-leave-${index}`}>
                  <LeaveIndicatorBar
                    type={item.type}
                    index={index}
                    total={Math.min(3, leaveItems.length)}
                  />
                </View>
              ))}
            {leaveItems.length > 3 && <CalendarEllipsis />}
          </View>
        )}
      </>
    </View>
  );
};

const containerStyles = StyleSheet.create({
  defaultContainer: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0E2FB',
  },
  inactive: {
    backgroundColor: '#ECECEF',
  },
  leaveIndicatorsContainer: {
    marginHorizontal: 8,
  },
  extraIndicator: {
    marginLeft: 2,
    justifyContent: 'center',
  },
  dotStyle: {
    height: 5,
    width: 5,
    borderRadius: 4,
    backgroundColor: '#cacaca',
    marginTop: 2,
  },
  dotPartiallyAvailable: {
    backgroundColor: '#ffcd50',
  },
  dotAvailable: {
    backgroundColor: '#458c4f',
  },
});

const textContainerStyles = StyleSheet.create({
  default: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayFullLayout: {
    backgroundColor: '#458c4f', // Green background for today in full layout
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSplitLayout: {
    backgroundColor: '#458c4f', // Blue background for selected date in split layout
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const textStyles = StyleSheet.create({
  defaultDayText: {
    textAlign: 'center',
  },
  today: {
    fontWeight: 'bold',
  },
  todayFullLayout: {
    color: '#fff', // White text for today in full layout
    fontWeight: 'bold',
  },
  selectedSplitLayout: {
    color: '#fff', // White text for selected date in split layout
    fontWeight: 'normal',
  },
  active: {
    color: '#5a5a5a',
  },
  extraIndicator: {
    fontSize: 10,
    color: '#5a5a5a',
  },
});
