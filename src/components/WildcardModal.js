import React, { useRef, useEffect } from 'react';
import {
  Modal, View, Text, StyleSheet, Animated, TouchableOpacity, Easing,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/theme';

export default function WildcardModal({ visible, wildcard, onDismiss }) {
  const scale = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 1, duration: 600, easing: Easing.out(Easing.back(2)), useNativeDriver: true }),
      ]).start();
    } else {
      scale.setValue(0);
      rotate.setValue(0);
    }
  }, [visible]);

  const rotateInterp = rotate.interpolate({ inputRange: [0, 1], outputRange: ['-20deg', '0deg'] });

  if (!wildcard) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { transform: [{ scale }, { rotate: rotateInterp }] }]}>
          <LinearGradient
            colors={['#1a0030', '#0a0020', '#1a0030']}
            style={styles.gradient}
          >
            <Text style={styles.wildLabel}>⚡ WILDCARD ⚡</Text>
            <Text style={styles.text}>{wildcard.text}</Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onDismiss();
              }}
            >
              <Text style={styles.btnText}>GOT IT</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#A855F7',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 20,
  },
  gradient: {
    padding: 32,
    alignItems: 'center',
  },
  wildLabel: {
    color: '#A855F7',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 4,
    marginBottom: 20,
    textShadowColor: '#A855F7',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 28,
  },
  btn: {
    borderWidth: 2,
    borderColor: '#A855F7',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  btnText: {
    color: '#A855F7',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 3,
  },
});
