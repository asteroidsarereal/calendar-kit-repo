import { Pressable } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import useCalendarStore from '@/lib/store/store';
import { useCalendarContext } from '@/lib/context/calendar-context';
import { toLocaleDateString } from '@fowusu/calendar-kit';

const ResetTodayButton = () => {
  const setCurrentMonth = useCalendarStore(
    (state) => state.setCurrentMonth
  );
  const { calendarListRef } = useCalendarContext();

  const handleResetToday = () => {
    setCurrentMonth(toLocaleDateString(new Date()));
    console.log('calendarListRef', calendarListRef);
    if (calendarListRef?.current) {
      console.log('calendarListRef', calendarListRef.current);
      calendarListRef.current.scrollToDate?.(
        new Date().toISOString()
      );
    }
  };

  return (
    <Pressable onPress={handleResetToday} style={{ marginLeft: 18 }}>
      <FontAwesome6 name="calendar" size={22} color="black" />
    </Pressable>
  );
};

export default ResetTodayButton;
