import { useMemo } from 'react';
import { addMonths, differenceInMonths } from 'date-fns';
import { toLocaleDateString } from '@fowusu/calendar-kit';
import { YEARS_TO_DISPLAY } from '@/constants/calendar-constants';

const useCalculateMonths = () => {
  return useMemo(() => {
    const today = new Date();
    const fiveYearsAgo = toLocaleDateString(
      addMonths(today, -YEARS_TO_DISPLAY * 12)
    );
    const fiveYearsLater = toLocaleDateString(
      addMonths(today, YEARS_TO_DISPLAY * 12)
    );
    const pastMonthsCount = differenceInMonths(today, fiveYearsAgo);
    const futureMonthsCount = differenceInMonths(
      fiveYearsLater,
      today
    );
    return { pastMonthsCount, futureMonthsCount };
  }, []);
};

export default useCalculateMonths;
