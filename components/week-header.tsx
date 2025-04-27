import React from 'react';
import { View, Text } from 'react-native';

const WeekHeader = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
      }}
    >
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
        (day, index) => (
          <Text style={{ color: '#808080' }} key={index}>
            {day}
          </Text>
        )
      )}
    </View>
  );
};

export default WeekHeader;
