/**
 * ContentModeFrame
 * A recording-UI overlay that shows when Viral Mode challenges are active.
 * Mimics a "live" recording frame so whoever is watching/recording knows
 * to point their phone at the player. This is the feature that makes
 * the game look great in recordings and drives viral sharing.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS } from '../utils/theme';

const { width, height } = Dimensions.get('window');

export default function ContentModeFrame({ active, playerName, category }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const [recSeconds, setRecSeconds] = useState(0);

  useEffect(() => {
    if (!active) return;

    // Pulse the REC indicator
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.2, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    anim.start();

    // Counter
    const counter = setInterval(() => setRecSeconds(s => s + 1), 1000);

    return () => {
      anim.stop();
      clearInterval(counter);
    };
  }, [active]);

  if (!active) return null;

  const mm = String(Math.floor(recSeconds / 60)).padStart(2, '0');
  const ss = String(recSeconds % 60).padStart(2, '0');

  return (
    <View style={styles.frame} pointerEvents="none">
      {/* Corner brackets */}
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.recPill}>
          <Animated.View style={[styles.recDot, { opacity: pulse }]} />
          <Text style={styles.recText}>REC</Text>
          <Text style={styles.recTimer}>{mm}:{ss}</Text>
        </View>
        <View style={[styles.categoryPill, { borderColor: COLORS[category] || COLORS.primary }]}>
          <Text style={[styles.categoryText, { color: COLORS[category] || COLORS.primary }]}>
            📱 VIRAL
          </Text>
        </View>
      </View>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.playerLabel}>{playerName?.toUpperCase()}</Text>
        <Text style={styles.shareHint}>#DrinkNow</Text>
      </View>
    </View>
  );
}

const CORNER_SIZE = 24;
const CORNER_WIDTH = 3;

const styles = StyleSheet.create({
  frame: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    pointerEvents: 'none',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: COLORS.primary,
  },
  topLeft: {
    top: 10,
    left: 10,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 10,
    right: 10,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 10,
    right: 10,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderBottomRightRadius: 4,
  },
  topBar: {
    position: 'absolute',
    top: 14,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },
  recText: {
    color: COLORS.danger,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 2,
  },
  recTimer: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  categoryPill: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  categoryText: {
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 14,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerLabel: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  shareHint: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
