import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function NeonText({ children, color = '#FF3CAC', size = 24, style, ...props }) {
  return (
    <Text
      style={[
        styles.base,
        {
          color,
          fontSize: size,
          textShadowColor: color,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 12,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontWeight: '900',
    letterSpacing: 2,
  },
});
