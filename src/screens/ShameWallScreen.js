import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  Dimensions, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/theme';
import { useGame } from '../utils/GameContext';
import { getShamePhrase } from '../data/challenges';
import GlowButton from '../components/GlowButton';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48 - 12) / 2;

const SHAME_LABELS = {
  0: '🌟 VIRGIN',
  1: '😬 AMATEUR',
  2: '😈 REGULAR',
  3: '💀 VETERAN',
  4: '🏆 LEGEND',
};

function ShamePhotoCard({ photo, player, phrase }) {
  const handleShare = async () => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(photo.uri);
    }
  };

  return (
    <TouchableOpacity style={styles.photoCard} onLongPress={handleShare} activeOpacity={0.9}>
      <Image source={{ uri: photo.uri }} style={styles.photoImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.photoOverlay}
      >
        <Text style={[styles.photoPlayerName, { color: player?.color || '#fff' }]}>
          {player?.emoji} {player?.name}
        </Text>
        <Text style={styles.photoPhrase}>{phrase}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function ShameWallScreen({ navigation }) {
  const { gameState } = useGame();
  const [phrases] = useState(() =>
    (gameState?.shameWallPhotos || []).map(() => getShamePhrase())
  );

  const photos = gameState?.shameWallPhotos || [];
  const players = gameState?.players || [];

  const getPlayer = (playerId) => players.find(p => p.id === playerId);

  if (photos.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#070714', '#0d0d2b', '#070714']} style={StyleSheet.absoluteFill} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📸</Text>
          <Text style={styles.emptyTitle}>NO SHAME YET</Text>
          <Text style={styles.emptyDesc}>Play Viral Mode challenges to fill this wall with evidence.</Text>
          <GlowButton label="← BACK TO GAME" onPress={() => navigation.goBack()} color={COLORS.primary} style={{ marginTop: 20 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#070714', '#0d0d2b', '#070714']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>SHAME WALL</Text>
          <Text style={styles.subtitle}>{photos.length} crimes documented</Text>
        </View>
        <Text style={styles.headerEmoji}>📸</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Player shame stats */}
        <View style={styles.shameStats}>
          <Text style={styles.sectionLabel}>WHO'S THE WORST</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
            {[...players].sort((a, b) => b.shameCount - a.shameCount).map(p => (
              <View key={p.id} style={[styles.statCard, { borderColor: p.color }]}>
                <Text style={styles.statEmoji}>{p.emoji}</Text>
                <Text style={[styles.statName, { color: p.color }]}>{p.name.split(' ')[0]}</Text>
                <Text style={styles.statCount}>{p.shameCount}</Text>
                <Text style={styles.statBadge}>
                  {SHAME_LABELS[Math.min(p.shameCount, 4)]}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Photo grid */}
        <Text style={styles.sectionLabel}>THE EVIDENCE</Text>
        <Text style={styles.holdHint}>Hold a photo to share it 👇</Text>
        <View style={styles.photoGrid}>
          {photos.map((photo, i) => (
            <ShamePhotoCard
              key={i}
              photo={photo}
              player={getPlayer(photo.playerId)}
              phrase={phrases[i] || getShamePhrase()}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backText: { color: COLORS.primary, fontWeight: '800', fontSize: 15, letterSpacing: 1 },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: { color: COLORS.textMuted, fontSize: 12, textAlign: 'center', marginTop: 2 },
  headerEmoji: { fontSize: 28 },
  content: { padding: 20, paddingBottom: 40, gap: 14 },
  sectionLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 4 },
  holdHint: { color: COLORS.textMuted, fontSize: 12, marginTop: -6 },
  shameStats: { gap: 10 },
  statsRow: { gap: 10, paddingRight: 10 },
  statCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    minWidth: 90,
  },
  statEmoji: { fontSize: 28 },
  statName: { fontWeight: '800', fontSize: 14 },
  statCount: { color: '#fff', fontWeight: '900', fontSize: 22 },
  statBadge: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  photoCard: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 1.25,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  photoImage: { width: '100%', height: '100%' },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    gap: 2,
  },
  photoPlayerName: { fontWeight: '900', fontSize: 13 },
  photoPhrase: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  emptyEmoji: { fontSize: 60 },
  emptyTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 3,
  },
  emptyDesc: { color: COLORS.textSub, fontSize: 16, textAlign: 'center', lineHeight: 24 },
});
