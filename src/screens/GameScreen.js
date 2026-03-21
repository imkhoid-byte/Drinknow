import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity,
  Dimensions, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/theme';
import { useGame } from '../utils/GameContext';
import {
  CATEGORIES, getRandomChallenge, shouldTriggerWildcard, getRandomWildcard,
} from '../data/challenges';
import SpinWheel from '../components/SpinWheel';
import PlayerCard from '../components/PlayerCard';
import WildcardModal from '../components/WildcardModal';
import GlowButton from '../components/GlowButton';

const { width, height } = Dimensions.get('window');

const REVEAL_MESSAGES = {
  TRUTH: ["TRUTH TIME! 🔥", "NO LYING!", "SPILL IT!"],
  DARE: ["YOU'VE BEEN DARED! 💀", "DO IT OR DRINK!", "DARE ACCEPTED?"],
  DRINK: ["BOTTOMS UP! 🍺", "DRINK!", "SIPS TIME!"],
  VIRAL: ["CAMERA ON! 📱", "THIS ONE'S GOING VIRAL!", "TIME TO POST!"],
  CHAOS: ["CHAOS ACTIVATED! ⚡", "EVERYONE SUFFER!", "PANDEMONIUM!"],
  VOTE: ["GROUP DECIDES! 👆", "DEMOCRATIC SUFFERING!", "VOTE TIME!"],
};

export default function GameScreen({ navigation }) {
  const { gameState, setChallenge, advanceTurn, endGame } = useGame();
  const [spinning, setSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showWildcard, setShowWildcard] = useState(false);
  const [currentWildcard, setCurrentWildcard] = useState(null);
  const [pendingCategory, setPendingCategory] = useState(null);

  const resultScale = useRef(new Animated.Value(0)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  if (!gameState) {
    navigation.replace('Home');
    return null;
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const catInfo = selectedCategory ? CATEGORIES[selectedCategory] : null;

  const shakePlayer = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const revealCategory = useCallback((category) => {
    resultScale.setValue(0);
    resultOpacity.setValue(0);
    setSelectedCategory(category);
    Animated.parallel([
      Animated.spring(resultScale, { toValue: 1, friction: 5, tension: 100, useNativeDriver: true }),
      Animated.timing(resultOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    shakePlayer();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const handleSpinResult = useCallback((category) => {
    // Check for wildcard before revealing
    if (shouldTriggerWildcard(gameState)) {
      const wc = getRandomWildcard();
      setCurrentWildcard(wc);
      setPendingCategory(category);
      setShowWildcard(true);
    } else {
      revealCategory(category);
    }
  }, [gameState, revealCategory]);

  const dismissWildcard = useCallback(() => {
    setShowWildcard(false);
    if (pendingCategory) {
      revealCategory(pendingCategory);
      setPendingCategory(null);
    }
  }, [pendingCategory, revealCategory]);

  const handleGoChallenge = useCallback(() => {
    if (!selectedCategory) return;
    const challenge = getRandomChallenge(selectedCategory);
    setChallenge({ ...challenge, category: selectedCategory });
    navigation.navigate('Challenge');
  }, [selectedCategory, setChallenge, navigation]);

  const handleEndGame = () => {
    Alert.alert(
      'End the Party? 🎉',
      'See the final stats and shame wall?',
      [
        { text: 'Keep Playing!', style: 'cancel' },
        {
          text: 'End It!',
          style: 'destructive',
          onPress: () => navigation.navigate('Score'),
        },
      ]
    );
  };

  const revealMessages = selectedCategory ? REVEAL_MESSAGES[selectedCategory] : [];
  const revealMsg = revealMessages[gameState.turnCount % revealMessages.length] || '';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#070714', '#0d0d2b', '#070714']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.roundLabel}>ROUND {gameState.round}</Text>
          <Text style={styles.turnLabel}>TURN {gameState.turnCount + 1}</Text>
        </View>
        <TouchableOpacity onPress={handleEndGame} style={styles.endBtn}>
          <Text style={styles.endBtnText}>END 🏁</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Player */}
        <Animated.View style={{ transform: [{ translateX: shakeAnim }], alignItems: 'center' }}>
          <Text style={styles.playerTurnLabel}>IT'S YOUR TURN</Text>
          <View style={[styles.currentPlayerCard, { borderColor: currentPlayer.color, shadowColor: currentPlayer.color }]}>
            <Text style={styles.currentPlayerEmoji}>{currentPlayer.emoji}</Text>
            <Text style={[styles.currentPlayerName, { color: currentPlayer.color }]}>
              {currentPlayer.name.toUpperCase()}
            </Text>
            <View style={styles.playerSipRow}>
              <Text style={styles.playerSipText}>🍺 {currentPlayer.sips} sips</Text>
              {currentPlayer.streak > 1 && (
                <Text style={styles.streakBadge}>🔥 {currentPlayer.streak} streak</Text>
              )}
              {currentPlayer.isImmune && (
                <Text style={styles.immuneBadge}>🛡️ IMMUNE</Text>
              )}
            </View>
          </View>
        </Animated.View>

        {/* Category reveal */}
        {selectedCategory && (
          <Animated.View
            style={[
              styles.categoryReveal,
              {
                borderColor: catInfo.color,
                shadowColor: catInfo.color,
                transform: [{ scale: resultScale }],
                opacity: resultOpacity,
              },
            ]}
          >
            <Text style={[styles.categoryRevealText, { color: catInfo.color }]}>
              {catInfo.label}
            </Text>
            <Text style={styles.categoryRevealMsg}>{revealMsg}</Text>
          </Animated.View>
        )}

        {/* Spin Wheel */}
        <View style={styles.wheelWrap}>
          <SpinWheel
            onResult={handleSpinResult}
            spinning={spinning}
            setSpinning={setSpinning}
          />
        </View>

        {/* Action buttons */}
        {selectedCategory && !spinning && (
          <View style={styles.actionBtns}>
            <GlowButton
              label="SEE MY CHALLENGE"
              icon="👀"
              onPress={handleGoChallenge}
              color={catInfo?.color || COLORS.primary}
              size="lg"
              style={{ width: '100%' }}
            />
          </View>
        )}

        {!selectedCategory && !spinning && (
          <Text style={styles.spinHint}>TAP THE WHEEL TO SPIN ↑</Text>
        )}

        {/* All players strip */}
        <View style={styles.playersSection}>
          <Text style={styles.sectionLabel}>ALL PLAYERS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.playersStrip}>
            {gameState.players.map((p) => (
              <PlayerCard
                key={p.id}
                player={p}
                isActive={p.id === currentPlayer.id}
                compact
              />
            ))}
          </ScrollView>
        </View>

        {/* Leaderboard mini */}
        <View style={styles.leaderboard}>
          <Text style={styles.sectionLabel}>SCOREBOARD</Text>
          {[...gameState.players]
            .sort((a, b) => b.sips - a.sips)
            .map((p, rank) => (
              <View key={p.id} style={[styles.scoreRow, p.id === currentPlayer.id && styles.scoreRowActive]}>
                <Text style={styles.scoreRank}>#{rank + 1}</Text>
                <Text style={styles.scoreEmoji}>{p.emoji}</Text>
                <Text style={[styles.scoreName, { color: p.color }]}>{p.name}</Text>
                <Text style={styles.scoreSips}>{p.sips} sips</Text>
                {p.streak > 2 && <Text style={styles.scoreStreak}>🔥{p.streak}</Text>}
              </View>
            ))}
        </View>
      </ScrollView>

      <WildcardModal
        visible={showWildcard}
        wildcard={currentWildcard}
        onDismiss={dismissWildcard}
      />
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  roundLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 3 },
  turnLabel: { color: '#fff', fontSize: 20, fontWeight: '900' },
  endBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.textMuted,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  endBtnText: { color: COLORS.textMuted, fontWeight: '800', fontSize: 13 },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
    alignItems: 'center',
  },
  playerTurnLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 10,
  },
  currentPlayerCard: {
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    borderWidth: 2.5,
    padding: 20,
    width: width - 80,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  currentPlayerEmoji: { fontSize: 48, marginBottom: 8 },
  currentPlayerName: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  playerSipRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    alignItems: 'center',
  },
  playerSipText: { color: COLORS.textSub, fontWeight: '700', fontSize: 15 },
  streakBadge: {
    backgroundColor: 'rgba(255,150,0,0.2)',
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  immuneBadge: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  categoryReveal: {
    alignItems: 'center',
    borderWidth: 2.5,
    borderRadius: 20,
    padding: 16,
    width: '100%',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 12,
    backgroundColor: COLORS.bgCard,
  },
  categoryRevealText: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  categoryRevealMsg: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
    opacity: 0.8,
  },
  wheelWrap: { alignItems: 'center', width: '100%' },
  actionBtns: { width: '100%', gap: 12 },
  spinHint: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
  },
  playersSection: { width: '100%', gap: 10 },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 4,
  },
  playersStrip: { gap: 10, paddingRight: 10 },
  leaderboard: { width: '100%', gap: 8 },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scoreRowActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(255,60,172,0.06)',
  },
  scoreRank: { color: COLORS.textMuted, fontWeight: '900', fontSize: 14, width: 24 },
  scoreEmoji: { fontSize: 18 },
  scoreName: { flex: 1, fontWeight: '700', fontSize: 15 },
  scoreSips: { color: COLORS.textSub, fontWeight: '800', fontSize: 14 },
  scoreStreak: { color: COLORS.accent, fontSize: 13, fontWeight: '800' },
});
