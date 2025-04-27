import { View } from 'react-native';
import React from 'react';

const CalendarEllipsis = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        width: '100%',
      }}
    >
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <View
            key={index}
            style={{
              backgroundColor: '#BDBDBF',
              height: 4,
              width: 12,
              borderRadius: 8,
            }}
          />
        ))}
    </View>
  );
};

export default CalendarEllipsis;
