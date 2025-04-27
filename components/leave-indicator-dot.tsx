import { View, Text } from 'react-native';
import React from 'react';

const LeaveIndicatorDot = ({ hasMore }: { hasMore: boolean }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <View
            key={`dot-${index}`}
            style={{
              backgroundColor: '#FF4500',
              height: 6,
              width: 6,
              borderRadius: 6,
              marginHorizontal: 1,
            }}
          />
        ))}
        {hasMore ? (
          <Text
            style={{
              marginLeft: 1,
              marginBottom: 1,
              fontSize: 12,
              fontWeight: 'bold',
            }}
          >
            +
          </Text>
        ) : (
          <Text
            style={{ marginLeft: 1, marginBottom: 1, fontSize: 12 }}
          ></Text>
        )}
      </View>
    </View>
  );
};

export default LeaveIndicatorDot;
