import React from 'react';
import { View, Text } from 'react-native';
import { CalendarItemType } from '@/lib/types';

// Colors for different types of leave - made more vibrant
const LEAVE_COLORS = {
  // Original CalendarItemType values
  LEAVE: '#FFD700', // Bright yellow for leave requests
  HOLIDAY: '#1E90FF', // Brighter blue for booked holidays
  ABSENCE: '#FF6347', // Tomato red for absences

  // Actual leave types from the mock data
  Holiday: '#1E90FF', // Blue for holidays
  'Sick Leave': '#FF6347', // Red for sick leave
  'Personal Leave': '#FFD700', // Yellow for personal leave
  Training: '#8A2BE2', // Purple for training

  DEFAULT: '#FFA500', // Orange for unknown types
};

type LeaveIndicatorBarProps = {
  type: CalendarItemType | string;
  index: number; // Position in stack (0-3)
  total: number; // Total number of bars
};

const LeaveIndicatorBar: React.FC<LeaveIndicatorBarProps> = ({
  type,
  index,
  total,
}) => {
  // Get color based on leave type
  const getColor = () => {
    return (
      LEAVE_COLORS[type as keyof typeof LEAVE_COLORS] ||
      LEAVE_COLORS.DEFAULT
    );
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          backgroundColor: getColor(),
          height: 6, // Increased from 4 to 6
          borderRadius: 8,
          marginBottom: index < total - 1 ? 4 : 0,
          width: '100%',
          marginTop: 1,
        }}
      >
        <Text style={{ paddingHorizontal: 17 }}></Text>
      </View>
    </View>
  );
};

export default LeaveIndicatorBar;
