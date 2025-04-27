import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import useCalendarStore from '@/lib/store/store';
import { useCalendarContext } from '@/lib/context/calendar-context';
import { format, addMonths, subMonths } from 'date-fns';
import Ionicons from '@expo/vector-icons/Ionicons';

const MonthHeader = () => {
  const currentMonth = useCalendarStore(
    (state) => state.currentMonth
  );
  const setCurrentMonth = useCalendarStore(
    (state) => state.setCurrentMonth
  );
  const { calendarListRef } = useCalendarContext();

  const goToPreviousMonth = useCallback(() => {
    if (calendarListRef?.current) {
      const currentDate = new Date(currentMonth);
      const prevMonth = subMonths(currentDate, 1);
      const prevMonthStr = format(prevMonth, 'yyyy-MM-dd');
      setCurrentMonth(prevMonthStr);
      calendarListRef.current.scrollToDate?.(prevMonthStr);
    }
  }, [calendarListRef, currentMonth, setCurrentMonth]);

  const goToNextMonth = useCallback(() => {
    if (calendarListRef?.current) {
      const nextMonth = addMonths(currentMonth, 1);
      const nextMonthStr = format(nextMonth, 'yyyy-MM-dd');
      setCurrentMonth(nextMonthStr);
      calendarListRef.current.scrollToDate?.(nextMonthStr);
    }
  }, [calendarListRef, currentMonth, setCurrentMonth]);

  return (
    <View style={{ marginHorizontal: 20, marginTop: 20 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          {format(currentMonth, 'MMMM yyyy')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Pressable
            onPress={goToPreviousMonth}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </Pressable>
          <Pressable onPress={goToNextMonth}>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="black"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default MonthHeader;
