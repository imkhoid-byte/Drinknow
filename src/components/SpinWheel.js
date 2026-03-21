import React, { useRef, useCallback } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity, Easing } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/theme';
import { CATEGORIES, CATEGORY_ORDER, getWeightedCategory } from '../data/challenges';

const WHEEL_SIZE = 300;
const NUM_SEGMENTS = CATEGORY_ORDER.length;
const SEGMENT_ANGLE = 360 / NUM_SEGMENTS;

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function segmentPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
}

const SEGMENT_COLORS = CATEGORY_ORDER.map(cat => CATEGORIES[cat].color);

export default function SpinWheel({ onResult, spinning, setSpinning }) {
  const rotation = useRef(new Animated.Value(0)).current;
  const currentAngle = useRef(0);

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    const targetCategory = getWeightedCategory();
    const catIndex = CATEGORY_ORDER.indexOf(targetCategory);

    // Calculate angle so the pointer (at top/0°) lands on this segment
    const segmentCenter = catIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    // We want segmentCenter to end at top — spin it to align
    const extraSpins = 5 * 360;
    const targetRotation = extraSpins + (360 - segmentCenter);

    // Tick haptics during spin
    let ticks = 0;
    const tickInterval = setInterval(() => {
      ticks++;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (ticks > 20) clearInterval(tickInterval);
    }, 150);

    const totalRotation = currentAngle.current + targetRotation;
    currentAngle.current = totalRotation % 360;

    Animated.timing(rotation, {
      toValue: totalRotation,
      duration: 3500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      clearInterval(tickInterval);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSpinning(false);
      onResult(targetCategory);
    });
  }, [spinning, rotation, onResult, setSpinning]);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'extend',
  });

  const cx = WHEEL_SIZE / 2;
  const cy = WHEEL_SIZE / 2;
  const r = WHEEL_SIZE / 2 - 8;

  return (
    <View style={styles.container}>
      {/* Pointer */}
      <View style={styles.pointer}>
        <View style={styles.pointerTriangle} />
      </View>

      {/* Wheel */}
      <TouchableOpacity onPress={spin} activeOpacity={0.95} disabled={spinning}>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
          <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
            {CATEGORY_ORDER.map((cat, i) => {
              const startAngle = i * SEGMENT_ANGLE;
              const endAngle = startAngle + SEGMENT_ANGLE;
              const mid = startAngle + SEGMENT_ANGLE / 2;
              const labelPos = polarToCartesian(cx, cy, r * 0.65, mid);

              return (
                <G key={cat}>
                  <Path
                    d={segmentPath(cx, cy, r, startAngle, endAngle)}
                    fill={SEGMENT_COLORS[i]}
                    opacity={0.9}
                    stroke="#070714"
                    strokeWidth={2}
                  />
                  <SvgText
                    x={labelPos.x}
                    y={labelPos.y}
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="900"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(${mid}, ${labelPos.x}, ${labelPos.y})`}
                  >
                    {CATEGORIES[cat].label.split(' ')[0]}
                  </SvgText>
                  <SvgText
                    x={labelPos.x}
                    y={labelPos.y + 14}
                    fill="#ffffff"
                    fontSize="16"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(${mid}, ${labelPos.x}, ${labelPos.y + 14})`}
                  >
                    {CATEGORIES[cat].label.split(' ')[1]}
                  </SvgText>
                </G>
              );
            })}
            {/* Center circle */}
            <Path
              d={`M ${cx} ${cy} m -28 0 a 28 28 0 1 0 56 0 a 28 28 0 1 0 -56 0`}
              fill="#070714"
              stroke="#FF3CAC"
              strokeWidth={3}
            />
            <SvgText
              x={cx}
              y={cy + 5}
              fill="#FF3CAC"
              fontSize="14"
              fontWeight="900"
              textAnchor="middle"
            >
              TAP
            </SvgText>
          </Svg>
        </Animated.View>
      </TouchableOpacity>

      {spinning && (
        <Text style={styles.spinText}>SPINNING...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointer: {
    position: 'absolute',
    top: -8,
    zIndex: 10,
    alignItems: 'center',
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 28,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF3CAC',
    shadowColor: '#FF3CAC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  spinText: {
    marginTop: 12,
    color: '#FF3CAC',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 4,
  },
});
