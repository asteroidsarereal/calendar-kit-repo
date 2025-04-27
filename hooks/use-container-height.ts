import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import useCalendarStore from '@/lib/store/store';

export type CalendarCellDimensions = {
  cellHeight: number;
  textSize: number;
};

export const useContainerHeight = (): CalendarCellDimensions => {
  const { width, height } = useWindowDimensions();
  const layoutMode = useCalendarStore((state) => state.layoutMode);

  return useMemo(() => {
    const isFullLayout = layoutMode === 'FULL_SCREEN';
    const screenFactor = Math.min(width, height) / 400;

    const baseHeightFull = 45 * screenFactor;
    const baseHeightSplit = 48 * screenFactor;

    const baseTextFull = 18 * screenFactor;
    const baseTextSplit = 16 * screenFactor;

    const cellHeight = isFullLayout
      ? Math.max(baseHeightFull, 45)
      : Math.max(baseHeightSplit, 40);

    const textSize = isFullLayout
      ? Math.max(baseTextFull, 14)
      : Math.max(baseTextSplit, 10);

    return { cellHeight, textSize };
  }, [width, height, layoutMode]);
};

export default useContainerHeight;
