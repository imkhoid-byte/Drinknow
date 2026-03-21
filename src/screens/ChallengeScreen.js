import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity,
  Alert, ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { COLORS } from '../utils/theme';
import { CATEGORIES } from '../data/challenges';
import { useGame } from '../utils/GameContext';
import GlowButton from '../components/GlowButton';
import ContentModeFrame from '../components/ContentModeFrame';

const { width, height } = Dimensions.get('window');

const COUNTDOWN_VALUES = [3, 2, 1, 'GO!'];

function CountdownOverlay({ visible, onDone }) {
  const [idx, setIdx] = useState(0);
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    setIdx(0);
    let current = 0;

    const step = () => {
      scale.setValue(2);
      opacity.setValue(1);
      setIdx(current);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 700, delay: 400, useNativeDriver: true }),
      ]).start(() => {
        current++;
        if (current < COUNTDOWN_VALUES.length) {
          setTimeout(step, 100);
        } else {
          onDone && onDone();
        }
      });
    };

    setTimeout(step, 200);
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.countdownOverlay} pointerEvents="none">
      <Animated.Text
        style={[
          styles.countdownText,
          { transform: [{ scale }], opacity },
          COUNTDOWN_VALUES[idx] === 'GO!' && { color: COLORS.success },
        ]}
      >
        {COUNTDOWN_VALUES[idx]}
      </Animated.Text>
    </View>
  );
}

function Timer({ duration, onComplete }) {
  const [remaining, setRemaining] = useState(duration);
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(interval);
          onComplete && onComplete();
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    Animated.timing(progress, {
      toValue: 0,
      duration: duration * 1000,
      useNativeDriver: false,
    }).start();

    return () => clearInterval(interval);
  }, []);

  const widthInterp = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const color = remaining > duration * 0.5 ? COLORS.success : remaining > duration * 0.25 ? COLORS.accent : COLORS.danger;

  return (
    <View style={styles.timerWrap}>
      <View style={styles.timerTrack}>
        <Animated.View style={[styles.timerBar, { width: widthInterp, backgroundColor: color }]} />
      </View>
      <Text style={[styles.timerText, { color }]}>{remaining}s</Text>
    </View>
  );
}

export default function ChallengeScreen({ navigation }) {
  const { gameState, currentChallenge, drinkTaken, challengeRefused, addShame, advanceTurn } = useGame();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('front');
  const [isRecording, setIsRecording] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(null);
  const [completed, setCompleted] = useState(false);

  const cameraRef = useRef(null);
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(40)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  if (!gameState || !currentChallenge) {
    navigation.goBack();
    return null;
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const catInfo = CATEGORIES[currentChallenge.category];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(cardY, { toValue: 0, friction: 7, tension: 100, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1200, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const handleOpenCamera = async () => {
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert('Camera Required', 'Enable camera access for Viral Mode!');
        return;
      }
    }
    setShowCamera(true);
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    setPhotoTaken(photo.uri);
    setShowCamera(false);

    // Auto-save to camera roll
    if (!mediaPermission?.granted) await requestMediaPermission();
    if (mediaPermission?.granted) {
      await MediaLibrary.saveToLibraryAsync(photo.uri);
    }

    addShame(photo.uri, currentPlayer.id);
  };

  const handleStartRecord = async () => {
    if (!cameraRef.current || isRecording) return;
    setIsRecording(true);
    setShowCountdown(true);
  };

  const handleCountdownDone = () => {
    setShowCountdown(false);
    if (currentChallenge.duration) {
      setTimerActive(true);
    }
  };

  const handleTimerComplete = async () => {
    setTimerActive(false);
    if (isRecording && cameraRef.current) {
      await cameraRef.current.stopRecording();
    }
    setIsRecording(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('TIME\'S UP! ⏰', 'Did they nail it?', [
      { text: '✅ KILLED IT', onPress: () => handleCompleted() },
      { text: '❌ FAILED — DRINK', onPress: () => handleFailed() },
    ]);
  };

  const handleCompleted = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCompleted(true);
    if (catInfo.sips > 0) {
      drinkTaken(currentPlayer.id, catInfo.sips);
    }
  }, [catInfo, currentPlayer, drinkTaken]);

  const handleFailed = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    const sips = catInfo.refuseSips || 3;
    challengeRefused(currentPlayer.id, sips);
    Alert.alert(
      `${currentPlayer.name} FAILED! 💀`,
      `That's ${sips} sips as penalty!`,
      [{ text: 'SHAME THEM 📸', onPress: () => setShowCamera(true) }, { text: 'Move On', style: 'cancel' }]
    );
  }, [catInfo, currentPlayer, challengeRefused]);

  const handleDrinkAndRefuse = useCallback(() => {
    const sips = catInfo.refuseSips || 3;
    Alert.alert(
      `Refusing costs ${sips} sips! 🍺`,
      `${currentPlayer.name} must drink ${sips} sips to skip this.`,
      [
        {
          text: `DRINK ${sips} AND SKIP`,
          onPress: () => {
            drinkTaken(currentPlayer.id, sips);
            handleNextTurn();
          },
        },
        { text: 'I\'LL DO IT!', style: 'cancel' },
      ]
    );
  }, [catInfo, currentPlayer, drinkTaken]);

  const handleNextTurn = useCallback(() => {
    advanceTurn();
    navigation.goBack();
  }, [advanceTurn, navigation]);

  const glowRadius = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 24] });

  // Camera view
  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={cameraFacing}
          mode={currentChallenge.cameraMode === 'video' ? 'video' : 'picture'}
        >
          <CountdownOverlay visible={showCountdown} onDone={handleCountdownDone} />

          {timerActive && currentChallenge.duration && (
            <View style={styles.cameraTimerWrap}>
              <Timer duration={currentChallenge.duration} onComplete={handleTimerComplete} />
            </View>
          )}

          <View style={styles.cameraHeader}>
            <TouchableOpacity
              style={styles.cameraFlipBtn}
              onPress={() => setCameraFacing(f => f === 'front' ? 'back' : 'front')}
            >
              <Text style={styles.cameraFlipText}>🔄</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraCloseBtn}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.cameraCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cameraControls}>
            {currentChallenge.cameraMode === 'video' ? (
              <TouchableOpacity
                style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
                onPress={isRecording ? handleTimerComplete : handleStartRecord}
              >
                <View style={[styles.recordBtnInner, isRecording && styles.recordBtnInnerActive]} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.snapBtn} onPress={handleTakePhoto}>
                <View style={styles.snapBtnInner} />
              </TouchableOpacity>
            )}

            <Text style={styles.cameraHint}>
              {currentChallenge.cameraMode === 'video'
                ? isRecording ? 'TAP TO STOP' : 'TAP TO START'
                : 'TAP TO SNAP'}
            </Text>
          </View>

          {/* Challenge reminder at top */}
          <View style={styles.cameraChallengeReminder}>
            <Text style={styles.cameraChallengeText} numberOfLines={2}>
              {currentChallenge.text}
            </Text>
          </View>
        </CameraView>
      </View>
    );
  }

  const isViralChallenge = currentChallenge.camera && gameState.settings.viralMode;

  // Main challenge view
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#070714', '#0d0d2b', '#070714']}
        style={StyleSheet.absoluteFill}
      />

      {/* Content-mode recording frame for Viral challenges */}
      <ContentModeFrame
        active={isViralChallenge && !completed}
        playerName={currentPlayer.name}
        category={currentChallenge.category}
      />

      {/* Neon accent based on category */}
      <View style={[styles.topAccent, { backgroundColor: catInfo.color }]} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Category badge */}
        <Animated.View
          style={[
            styles.categoryBadge,
            {
              borderColor: catInfo.color,
              shadowColor: catInfo.color,
              shadowRadius: glowRadius,
              transform: [{ translateY: cardY }],
              opacity: cardOpacity,
            },
          ]}
        >
          <Text style={[styles.categoryLabel, { color: catInfo.color }]}>
            {catInfo.label}
          </Text>
        </Animated.View>

        {/* Player indicator */}
        <Animated.View style={{ opacity: cardOpacity, transform: [{ translateY: cardY }], alignItems: 'center' }}>
          <View style={[styles.playerIndicator, { borderColor: currentPlayer.color }]}>
            <Text style={styles.playerIndicatorEmoji}>{currentPlayer.emoji}</Text>
            <Text style={[styles.playerIndicatorName, { color: currentPlayer.color }]}>
              {currentPlayer.name.toUpperCase()}
            </Text>
          </View>
        </Animated.View>

        {/* The Challenge Card */}
        <Animated.View
          style={[
            styles.challengeCard,
            {
              borderColor: catInfo.color,
              shadowColor: catInfo.color,
              shadowRadius: glowRadius,
              opacity: cardOpacity,
              transform: [{ translateY: cardY }],
            },
          ]}
        >
          <Text style={styles.challengeText}>{currentChallenge.text}</Text>

          {currentChallenge.duration && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>⏱️ {currentChallenge.duration} SECONDS</Text>
            </View>
          )}

          {currentChallenge.camera && gameState.settings.viralMode && (
            <View style={styles.viralBadge}>
              <Text style={styles.viralBadgeText}>📱 CAMERA CHALLENGE</Text>
            </View>
          )}
        </Animated.View>

        {/* Action buttons */}
        <View style={styles.actions}>
          {/* Camera button for viral challenges */}
          {currentChallenge.camera && gameState.settings.viralMode && !completed && (
            <GlowButton
              label={currentChallenge.cameraMode === 'video' ? 'OPEN CAMERA 🎬' : 'SNAP THE MOMENT 📸'}
              onPress={handleOpenCamera}
              color={COLORS.VIRAL}
              size="lg"
              style={{ width: '100%' }}
            />
          )}

          {!completed ? (
            <>
              <GlowButton
                label="✅ CHALLENGE COMPLETE!"
                onPress={handleCompleted}
                color={COLORS.success}
                size="lg"
                style={{ width: '100%' }}
              />

              <GlowButton
                label={`❌ REFUSE (DRINK ${catInfo.refuseSips || 3} SIPS)`}
                onPress={handleDrinkAndRefuse}
                color={COLORS.danger}
                size="md"
                style={{ width: '100%' }}
              />
            </>
          ) : (
            <View style={styles.completedSection}>
              <Text style={styles.completedText}>LEGEND! 🏆</Text>
              {catInfo.sips > 0 && (
                <Text style={styles.completedSub}>Take {catInfo.sips} sips anyway!</Text>
              )}
              <GlowButton
                label="NEXT PLAYER →"
                onPress={handleNextTurn}
                color={COLORS.secondary}
                size="lg"
                style={{ width: '100%' }}
              />
            </View>
          )}

          {/* Photo taken confirmation */}
          {photoTaken && (
            <View style={styles.photoConfirm}>
              <Text style={styles.photoConfirmText}>📸 Added to Shame Wall!</Text>
            </View>
          )}
        </View>

        {/* Mini scoreboard */}
        <View style={styles.miniScore}>
          <Text style={styles.miniScoreLabel}>SIPS SO FAR</Text>
          <View style={styles.miniScoreRow}>
            {[...gameState.players]
              .sort((a, b) => b.sips - a.sips)
              .slice(0, 4)
              .map(p => (
                <View key={p.id} style={styles.miniScoreItem}>
                  <Text style={styles.miniScoreEmoji}>{p.emoji}</Text>
                  <Text style={[styles.miniScoreSips, { color: p.color }]}>{p.sips}</Text>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  topAccent: { height: 3, width: '100%' },
  content: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 60,
    gap: 18,
    alignItems: 'center',
  },
  categoryBadge: {
    borderWidth: 2.5,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: COLORS.bgCard,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    elevation: 10,
  },
  categoryLabel: {
    fontWeight: '900',
    fontSize: 20,
    letterSpacing: 2,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  playerIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.bgCard,
  },
  playerIndicatorEmoji: { fontSize: 22 },
  playerIndicatorName: { fontWeight: '900', fontSize: 17, letterSpacing: 1 },
  challengeCard: {
    width: '100%',
    backgroundColor: COLORS.bgCard,
    borderRadius: 24,
    borderWidth: 2.5,
    padding: 28,
    gap: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    elevation: 15,
  },
  challengeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 30,
    textAlign: 'center',
  },
  durationBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
  },
  durationText: {
    color: COLORS.accent,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 2,
  },
  viralBadge: {
    backgroundColor: 'rgba(255,60,172,0.15)',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.VIRAL,
  },
  viralBadgeText: {
    color: COLORS.VIRAL,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 2,
  },
  actions: { width: '100%', gap: 12 },
  completedSection: {
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  completedText: {
    color: COLORS.success,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: COLORS.success,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  completedSub: { color: COLORS.textSub, fontSize: 16, fontWeight: '600' },
  photoConfirm: {
    backgroundColor: 'rgba(255,60,172,0.1)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  photoConfirmText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  miniScore: { width: '100%', gap: 8 },
  miniScoreLabel: { color: COLORS.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 4 },
  miniScoreRow: { flexDirection: 'row', gap: 12 },
  miniScoreItem: { alignItems: 'center', gap: 2 },
  miniScoreEmoji: { fontSize: 22 },
  miniScoreSips: { fontWeight: '900', fontSize: 16 },

  // Camera styles
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  cameraChallengeReminder: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: COLORS.VIRAL,
  },
  cameraChallengeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  cameraHeader: {
    position: 'absolute',
    top: 12,
    right: 16,
    flexDirection: 'row',
    gap: 10,
  },
  cameraFlipBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraFlipText: { fontSize: 22 },
  cameraCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(200,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraCloseText: { color: '#fff', fontWeight: '900', fontSize: 20 },
  cameraControls: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  snapBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  snapBtnInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  recordBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  recordBtnActive: {
    borderColor: COLORS.danger,
    backgroundColor: 'rgba(255,68,68,0.3)',
  },
  recordBtnInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.danger,
  },
  recordBtnInnerActive: {
    width: 28,
    height: 28,
    borderRadius: 4,
  },
  cameraHint: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 2,
  },
  cameraTimerWrap: {
    position: 'absolute',
    top: 130,
    left: 20,
    right: 20,
  },
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 100,
  },
  countdownText: {
    color: '#fff',
    fontSize: 120,
    fontWeight: '900',
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  timerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timerTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  timerBar: {
    height: '100%',
    borderRadius: 4,
  },
  timerText: {
    fontWeight: '900',
    fontSize: 18,
    width: 36,
    textAlign: 'right',
  },
});
