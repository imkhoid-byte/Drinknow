import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/theme';
import { useGame } from '../utils/GameContext';
import { getStats } from '../utils/gameLogic';
import GlowButton from '../components/GlowButton';

const { width } = Dimensions.get('window');

const MEDALS = ['🥇', '🥈', '🥉'];
const TITLES = [
  'THE CHAMPION 👑',
  'RUNNER UP 🎖️',
  'THIRD PLACE 🏅',
];

const DRUNK_TITLES = [
  { threshold: 20, label: '💀 ABSOLUTELY OBLITERATED', color: '#FF4444' },
  { threshold: 14, label: '🌪️ SPINNING OUT', color: '#A855F7' },
  { threshold: 9, label: '🔥 ON FIRE', color: COLORS.accent },
  { threshold: 5, label: '😵 FEELING IT', color: COLORS.primary },
  { threshold: 2, label: '😊 TIPSY', color: COLORS.secondary },
  { threshold: 0, label: '🥤 STONE COLD SOBER', color: COLORS.textMuted },
];

function getDrunkTitle(sips) {
  return DRUNK_TITLES.find(t => sips >= t.threshold) || DRUNK_TITLES[DRUNK_TITLES.length - 1];
}

function PodiumCard({ player, rank }) {
  const scale = useRef(new Animated.Value(0)).current;
  const height = [120, 90, 70][rank] || 60;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 100,
      delay: rank * 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const drunkTitle = getDrunkTitle(player.sips);

  return (
    <Animated.View style={[styles.podiumCard, { transform: [{ scale }] }]}>
      <Text style={styles.podiumMedal}>{MEDALS[rank] || '🎗️'}</Text>
      <Text style={styles.podiumEmoji}>{player.emoji}</Text>
      <Text style={[styles.podiumName, { color: player.color }]}>
        {player.name.length > 10 ? player.name.slice(0, 9) + '…' : player.name}
      </Text>
      <View style={[styles.podiumBar, { height, backgroundColor: player.color + '33', borderColor: player.color }]}>
        <Text style={[styles.podiumSips, { color: player.color }]}>{player.sips}</Text>
        <Text style={styles.podiumSipsLabel}>SIPS</Text>
      </View>
      <Text style={[styles.drunkTitle, { color: drunkTitle.color }]}>{drunkTitle.label}</Text>
    </Animated.View>
  );
}

export default function ScoreScreen({ navigation }) {
  const { gameState, endGame } = useGame();
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.parallel([
      Animated.spring(headerAnim, { toValue: 0, friction: 7, tension: 80, useNativeDriver: true }),
      Animated.timing(contentAnim, { toValue: 1, duration: 600, delay: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!gameState) {
    navigation.replace('Home');
    return null;
  }

  const stats = getStats(gameState);
  const sorted = [...gameState.players].sort((a, b) => b.sips - a.sips);
  const mvp = stats.mvp;
  const topThree = sorted.slice(0, 3);

  const handlePlayAgain = () => {
    endGame();
    navigation.replace('Setup');
  };

  const handleHome = () => {
    endGame();
    navigation.replace('Home');
  };

  const handleShameWall = () => {
    navigation.navigate('ShameWall');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#070714', '#0d0d2b', '#070714']}
        style={StyleSheet.absoluteFill}
      />

      {/* Confetti-like header */}
      <Animated.View style={[styles.header, { transform: [{ translateY: headerAnim }] }]}>
        <LinearGradient
          colors={[COLORS.primary + '33', 'transparent']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerEmoji}>🎉</Text>
          <Text style={styles.headerTitle}>GAME OVER</Text>
          <Text style={styles.headerSubtitle}>
            {stats.rounds} rounds • {stats.duration} min • {stats.total} total sips
          </Text>
        </LinearGradient>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Podium */}
        <Animated.View style={{ opacity: contentAnim }}>
          <Text style={styles.sectionLabel}>FINAL STANDINGS</Text>
          <View style={styles.podium}>
            {topThree.map((p, i) => (
              <PodiumCard key={p.id} player={p} rank={i} />
            ))}
          </View>
        </Animated.View>

        {/* Special awards */}
        <Animated.View style={[styles.awards, { opacity: contentAnim }]}>
          <Text style={styles.sectionLabel}>SPECIAL AWARDS</Text>

          <View style={[styles.awardCard, { borderColor: COLORS.accent }]}>
            <Text style={styles.awardEmoji}>👑</Text>
            <View style={styles.awardInfo}>
              <Text style={styles.awardTitle}>MOST SIPS CHAMP</Text>
              <Text style={[styles.awardWinner, { color: mvp.color }]}>
                {mvp.emoji} {mvp.name} — {mvp.sips} sips
              </Text>
            </View>
          </View>

          {stats.lightweight && stats.lightweight.refusals > 0 && (
            <View style={[styles.awardCard, { borderColor: COLORS.danger }]}>
              <Text style={styles.awardEmoji}>🐔</Text>
              <View style={styles.awardInfo}>
                <Text style={styles.awardTitle}>BIGGEST CHICKEN</Text>
                <Text style={[styles.awardWinner, { color: stats.lightweight.color }]}>
                  {stats.lightweight.emoji} {stats.lightweight.name} — {stats.lightweight.refusals} refusals
                </Text>
              </View>
            </View>
          )}

          {gameState.players.find(p => p.streak > 3) && (
            <View style={[styles.awardCard, { borderColor: COLORS.orange }]}>
              <Text style={styles.awardEmoji}>🔥</Text>
              <View style={styles.awardInfo}>
                <Text style={styles.awardTitle}>HOTTEST STREAK</Text>
                {(() => {
                  const streakKing = [...gameState.players].sort((a, b) => b.streak - a.streak)[0];
                  return (
                    <Text style={[styles.awardWinner, { color: streakKing.color }]}>
                      {streakKing.emoji} {streakKing.name} — max {streakKing.streak} in a row
                    </Text>
                  );
                })()}
              </View>
            </View>
          )}

          {gameState.shameWallPhotos.length > 0 && (
            <View style={[styles.awardCard, { borderColor: COLORS.VIRAL }]}>
              <Text style={styles.awardEmoji}>📸</Text>
              <View style={styles.awardInfo}>
                <Text style={styles.awardTitle}>SHAME WALL STAR</Text>
                {(() => {
                  const shameKing = [...gameState.players].sort((a, b) => b.shameCount - a.shameCount)[0];
                  return (
                    <Text style={[styles.awardWinner, { color: shameKing.color }]}>
                      {shameKing.emoji} {shameKing.name} — {shameKing.shameCount} photos
                    </Text>
                  );
                })()}
              </View>
            </View>
          )}
        </Animated.View>

        {/* Full leaderboard */}
        <Animated.View style={{ opacity: contentAnim, gap: 8 }}>
          <Text style={styles.sectionLabel}>FULL RESULTS</Text>
          {sorted.map((p, i) => {
            const drunkTitle = getDrunkTitle(p.sips);
            return (
              <View key={p.id} style={[styles.resultRow, i === 0 && styles.resultRowFirst]}>
                <Text style={styles.resultRank}>{MEDALS[i] || `#${i + 1}`}</Text>
                <Text style={styles.resultEmoji}>{p.emoji}</Text>
                <View style={styles.resultInfo}>
                  <Text style={[styles.resultName, { color: p.color }]}>{p.name}</Text>
                  <Text style={[styles.resultDrunkTitle, { color: drunkTitle.color }]}>{drunkTitle.label}</Text>
                </View>
                <View style={styles.resultStats}>
                  <Text style={styles.resultSips}>{p.sips}</Text>
                  <Text style={styles.resultSipsLabel}>SIPS</Text>
                </View>
              </View>
            );
          })}
        </Animated.View>

        {/* CTAs */}
        <Animated.View style={[styles.ctaBtns, { opacity: contentAnim }]}>
          {gameState.shameWallPhotos.length > 0 && (
            <GlowButton
              label={`SHAME WALL (${gameState.shameWallPhotos.length} photos)`}
              icon="📸"
              onPress={handleShameWall}
              color={COLORS.VIRAL}
              size="lg"
              style={{ width: '100%' }}
            />
          )}
          <GlowButton
            label="PLAY AGAIN 🔄"
            onPress={handlePlayAgain}
            color={COLORS.primary}
            size="lg"
            style={{ width: '100%' }}
          />
          <GlowButton
            label="HOME"
            onPress={handleHome}
            color={COLORS.textSub}
            size="md"
            style={{ width: '100%' }}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingTop: 56 },
  headerGradient: {
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  headerEmoji: { fontSize: 48 },
  headerTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  headerSubtitle: { color: COLORS.textSub, fontSize: 14, fontWeight: '600' },
  content: { padding: 20, paddingBottom: 50, gap: 20 },
  sectionLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 4, marginBottom: 4 },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 12,
    paddingTop: 20,
  },
  podiumCard: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  podiumMedal: { fontSize: 28 },
  podiumEmoji: { fontSize: 28 },
  podiumName: { fontWeight: '800', fontSize: 13, textAlign: 'center' },
  podiumBar: {
    width: '80%',
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  podiumSips: { fontWeight: '900', fontSize: 22 },
  podiumSipsLabel: { color: COLORS.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  drunkTitle: { fontSize: 10, fontWeight: '800', textAlign: 'center', letterSpacing: 0.5 },
  awards: { gap: 10 },
  awardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    gap: 14,
  },
  awardEmoji: { fontSize: 32 },
  awardInfo: { flex: 1, gap: 4 },
  awardTitle: { color: COLORS.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 3 },
  awardWinner: { fontWeight: '800', fontSize: 16 },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 10,
  },
  resultRowFirst: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(255,230,109,0.06)',
  },
  resultRank: { fontSize: 20, width: 32, textAlign: 'center' },
  resultEmoji: { fontSize: 24 },
  resultInfo: { flex: 1, gap: 2 },
  resultName: { fontWeight: '800', fontSize: 16 },
  resultDrunkTitle: { fontSize: 12, fontWeight: '700' },
  resultStats: { alignItems: 'center' },
  resultSips: { color: '#fff', fontWeight: '900', fontSize: 22 },
  resultSipsLabel: { color: COLORS.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  ctaBtns: { gap: 12 },
});
