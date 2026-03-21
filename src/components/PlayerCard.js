import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

export default function PlayerCard({ player, isActive = false, compact = false }) {
  return (
    <View
      style={[
        styles.card,
        compact ? styles.compact : styles.full,
        isActive && { borderColor: player.color, shadowColor: player.color },
      ]}
    >
      <Text style={[styles.emoji, compact && styles.emojiSmall]}>{player.emoji}</Text>
      {!compact && (
        <>
          <Text style={[styles.name, { color: player.color }]}>{player.name}</Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{player.sips}</Text>
              <Text style={styles.statLabel}>SIPS</Text>
            </View>
            {player.streak > 1 && (
              <View style={styles.stat}>
                <Text style={[styles.statNum, { color: COLORS.accent }]}>🔥{player.streak}</Text>
                <Text style={styles.statLabel}>STREAK</Text>
              </View>
            )}
            {player.isImmune && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>🛡️ IMMUNE</Text>
              </View>
            )}
          </View>
        </>
      )}
      {compact && (
        <Text style={[styles.nameSmall, { color: player.color }]}>{player.name.split(' ')[0]}</Text>
      )}
      {isActive && <View style={[styles.activeDot, { backgroundColor: player.color }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  full: {
    padding: 16,
    minWidth: 120,
  },
  compact: {
    padding: 10,
    minWidth: 72,
    flexDirection: 'row',
    gap: 6,
  },
  emoji: {
    fontSize: 32,
  },
  emojiSmall: {
    fontSize: 20,
  },
  name: {
    fontWeight: '800',
    fontSize: 16,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  nameSmall: {
    fontWeight: '700',
    fontSize: 13,
    alignSelf: 'center',
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
  },
  statNum: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
});
