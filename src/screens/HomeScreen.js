import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
  Dimensions, StatusBar, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/theme';
import GlowButton from '../components/GlowButton';

const { width, height } = Dimensions.get('window');

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * width,
  delay: Math.random() * 3000,
  duration: 4000 + Math.random() * 3000,
  emoji: ['🍺', '🥂', '🍻', '🎉', '⚡', '🔥', '💀', '🌙'][Math.floor(Math.random() * 8)],
}));

function FloatingParticle({ x, delay, duration, emoji }) {
  const y = useRef(new Animated.Value(height + 20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = () => {
      y.setValue(height + 20);
      opacity.setValue(0);
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(y, { toValue: -40, duration, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.7, duration: 500, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.7, duration: duration - 1000, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
          ]),
        ]).start(loop);
      }, delay);
    };
    loop();
  }, []);

  return (
    <Animated.Text
      style={{
        position: 'absolute',
        left: x,
        transform: [{ translateY: y }],
        opacity,
        fontSize: 20,
      }}
    >
      {emoji}
    </Animated.Text>
  );
}

export default function HomeScreen({ navigation }) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoGlow = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(60)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(titleY, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(btnOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // Pulse glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlow, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(logoGlow, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const glowRadius = logoGlow.interpolate({ inputRange: [0, 1], outputRange: [20, 45] });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070714" />
      <LinearGradient
        colors={['#070714', '#0d0d2b', '#070714']}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating particles */}
      {PARTICLES.map(p => (
        <FloatingParticle key={p.id} {...p} />
      ))}

      {/* Grid lines for aesthetic */}
      <View style={styles.gridOverlay} pointerEvents="none">
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={[styles.gridLine, { top: (height / 6) * i }]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <Animated.View style={[styles.logoWrap, { transform: [{ scale: logoScale }] }]}>
          <Text style={styles.logoEmoji}>🍺</Text>
          <Animated.Text
            style={[
              styles.logoText,
              {
                textShadowRadius: glowRadius,
                textShadowColor: COLORS.primary,
              },
            ]}
          >
            DRINK
          </Animated.Text>
          <Animated.Text
            style={[
              styles.logoTextSub,
              {
                textShadowRadius: glowRadius,
                textShadowColor: COLORS.secondary,
              },
            ]}
          >
            NOW
          </Animated.Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleY }] }}>
          <Text style={styles.tagline}>The party game that</Text>
          <Text style={[styles.taglineHigh, { color: COLORS.primary }]}>goes viral</Text>
          <Text style={styles.taglineSub}>📱 Built for content • 🔥 Designed to chaos</Text>
        </Animated.View>

        {/* Category preview pills */}
        <Animated.View style={[styles.pills, { opacity: btnOpacity }]}>
          {[
            { label: '🔥 TRUTH', color: COLORS.TRUTH },
            { label: '💀 DARE', color: COLORS.DARE },
            { label: '📱 VIRAL', color: COLORS.VIRAL },
            { label: '⚡ CHAOS', color: COLORS.CHAOS },
          ].map(({ label, color }) => (
            <View key={label} style={[styles.pill, { borderColor: color }]}>
              <Text style={[styles.pillText, { color }]}>{label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Main CTA */}
        <Animated.View style={[styles.btns, { opacity: btnOpacity }]}>
          <GlowButton
            label="START THE CHAOS"
            icon="⚡"
            onPress={() => navigation.navigate('Setup')}
            color={COLORS.primary}
            size="lg"
            style={{ width: '100%' }}
          />

          <GlowButton
            label="HOW TO PLAY"
            icon="📖"
            onPress={() => navigation.navigate('HowToPlay')}
            color={COLORS.secondary}
            size="md"
            style={{ width: '100%' }}
          />
        </Animated.View>

        {/* Age disclaimer */}
        <Text style={styles.disclaimer}>
          🔞 For adults only. Drink responsibly. Never drink and drive.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 28,
    gap: 24,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,60,172,0.05)',
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 64,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 8,
    textShadowOffset: { width: 0, height: 0 },
    lineHeight: 68,
  },
  logoTextSub: {
    fontSize: 64,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: 12,
    textShadowOffset: { width: 0, height: 0 },
    lineHeight: 68,
  },
  tagline: {
    color: COLORS.textSub,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  taglineHigh: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  taglineSub: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  pill: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  pillText: {
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  btns: {
    width: '100%',
    gap: 14,
    alignItems: 'center',
  },
  disclaimer: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
