import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/theme';

export default function GlowButton({
  label,
  onPress,
  color = COLORS.primary,
  size = 'md',
  disabled = false,
  style,
  textStyle,
  icon,
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress && onPress();
  };

  const padding = size === 'lg' ? 20 : size === 'sm' ? 10 : 14;
  const fontSize = size === 'lg' ? 20 : size === 'sm' ? 14 : 17;

  return (
    <Animated.View style={{ transform: [{ scale }], ...style }}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.9}
        style={[
          styles.btn,
          {
            borderColor: color,
            paddingVertical: padding,
            shadowColor: color,
            opacity: disabled ? 0.4 : 1,
          },
        ]}
      >
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={[styles.label, { color, fontSize }, textStyle]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  label: {
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
});
