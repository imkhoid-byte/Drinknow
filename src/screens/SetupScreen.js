import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  Alert, Dimensions, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../utils/theme';
import { PLAYER_EMOJIS, PLAYER_COLORS, DEFAULT_SETTINGS } from '../utils/gameLogic';
import GlowButton from '../components/GlowButton';
import { useGame } from '../utils/GameContext';

const { width } = Dimensions.get('window');

function PlayerRow({ player, onRemove, onEdit, index }) {
  return (
    <View style={[styles.playerRow, { borderColor: player.color }]}>
      <TouchableOpacity
        onPress={() => onEdit('emoji', index)}
        style={[styles.emojiBtn, { backgroundColor: player.color + '22' }]}
      >
        <Text style={styles.playerEmoji}>{player.emoji}</Text>
      </TouchableOpacity>

      <View style={styles.playerInfo}>
        <Text style={[styles.playerName, { color: player.color }]}>{player.name}</Text>
        <TouchableOpacity onPress={() => onEdit('color', index)}>
          <View style={styles.colorDots}>
            {PLAYER_COLORS.slice(0, 6).map(c => (
              <View key={c} style={[styles.colorDot, { backgroundColor: c, opacity: c === player.color ? 1 : 0.3 }]} />
            ))}
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => onRemove(index)} style={styles.removeBtn}>
        <Text style={styles.removeBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SetupScreen({ navigation }) {
  const { startGame } = useGame();
  const [players, setPlayers] = useState([
    { name: 'Player 1', emoji: '🔥', color: PLAYER_COLORS[0] },
    { name: 'Player 2', emoji: '💀', color: PLAYER_COLORS[1] },
  ]);
  const [newName, setNewName] = useState('');
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [editingColor, setEditingColor] = useState(null);
  const [editingEmoji, setEditingEmoji] = useState(null);

  const addPlayer = () => {
    if (players.length >= 10) {
      Alert.alert('Max Players', 'Maximum 10 players supported.');
      return;
    }
    const name = newName.trim() || `Player ${players.length + 1}`;
    const colorIndex = players.length % PLAYER_COLORS.length;
    const emojiIndex = players.length % PLAYER_EMOJIS.length;
    setPlayers([...players, {
      name,
      emoji: PLAYER_EMOJIS[emojiIndex],
      color: PLAYER_COLORS[colorIndex],
    }]);
    setNewName('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removePlayer = (index) => {
    if (players.length <= 2) {
      Alert.alert('Min Players', 'You need at least 2 players.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleEdit = (type, index) => {
    if (type === 'color') setEditingColor(index);
    if (type === 'emoji') setEditingEmoji(index);
  };

  const setColor = (index, color) => {
    const p = [...players];
    p[index] = { ...p[index], color };
    setPlayers(p);
    setEditingColor(null);
  };

  const setEmoji = (index, emoji) => {
    const p = [...players];
    p[index] = { ...p[index], emoji };
    setPlayers(p);
    setEditingEmoji(null);
  };

  const handleStart = () => {
    if (players.length < 2) {
      Alert.alert('Need more players!', 'Add at least 2 players to start.');
      return;
    }
    startGame(players, settings);
    navigation.navigate('Game');
  };

  const toggleSetting = (key) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettings(s => ({ ...s, [key]: !s[key] }));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <LinearGradient colors={['#070714', '#0d0d2b', '#070714']} style={StyleSheet.absoluteFill} />

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backText}>← BACK</Text>
          </TouchableOpacity>

          <Text style={styles.title}>SET UP</Text>
          <Text style={styles.subtitle}>{players.length} players ready</Text>

          {/* Players List */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>PLAYERS</Text>
            {players.map((p, i) => (
              <PlayerRow
                key={i}
                player={p}
                index={i}
                onRemove={removePlayer}
                onEdit={handleEdit}
              />
            ))}
          </View>

          {/* Add player input */}
          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              placeholder="Player name..."
              placeholderTextColor={COLORS.textMuted}
              value={newName}
              onChangeText={setNewName}
              maxLength={20}
              onSubmitEditing={addPlayer}
              returnKeyType="done"
              selectionColor={COLORS.primary}
            />
            <TouchableOpacity style={styles.addBtn} onPress={addPlayer}>
              <Text style={styles.addBtnText}>+ ADD</Text>
            </TouchableOpacity>
          </View>

          {/* Color picker */}
          {editingColor !== null && (
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>PICK COLOUR</Text>
              <View style={styles.colorGrid}>
                {PLAYER_COLORS.map(c => (
                  <TouchableOpacity key={c} onPress={() => setColor(editingColor, c)}>
                    <View style={[styles.colorSwatch, { backgroundColor: c }]} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Emoji picker */}
          {editingEmoji !== null && (
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>PICK VIBE</Text>
              <View style={styles.emojiGrid}>
                {PLAYER_EMOJIS.map(e => (
                  <TouchableOpacity key={e} onPress={() => setEmoji(editingEmoji, e)} style={styles.emojiOption}>
                    <Text style={styles.emojiOptionText}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Game Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SETTINGS</Text>

            {[
              { key: 'viralMode', label: '📱 Viral Mode', desc: 'Camera challenges for recording' },
              { key: 'wildcards', label: '🃏 Wildcards', desc: 'Random game-changing events' },
              { key: 'hardcoreMode', label: '💀 Hardcore', desc: 'Higher sip counts, no mercy' },
              { key: 'soundEnabled', label: '🔊 Sound', desc: 'Sound effects and music' },
              { key: 'hapticsEnabled', label: '📳 Vibration', desc: 'Haptic feedback' },
            ].map(s => (
              <TouchableOpacity
                key={s.key}
                style={styles.settingRow}
                onPress={() => toggleSetting(s.key)}
              >
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>{s.label}</Text>
                  <Text style={styles.settingDesc}>{s.desc}</Text>
                </View>
                <View style={[styles.toggle, settings[s.key] && styles.toggleOn]}>
                  <View style={[styles.toggleDot, settings[s.key] && styles.toggleDotOn]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Start Button */}
          <GlowButton
            label={`PLAY WITH ${players.length} PLAYERS`}
            icon="🎮"
            onPress={handleStart}
            color={COLORS.primary}
            size="lg"
            style={{ width: '100%', marginTop: 8 }}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingTop: 60, paddingBottom: 60, gap: 14 },
  back: { marginBottom: 4 },
  backText: { color: COLORS.primary, fontWeight: '800', fontSize: 15, letterSpacing: 2 },
  title: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 6,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: { color: COLORS.textSub, fontSize: 16, fontWeight: '600' },
  section: { gap: 10 },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 2,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    gap: 12,
  },
  emojiBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerEmoji: { fontSize: 26 },
  playerInfo: { flex: 1, gap: 6 },
  playerName: { fontWeight: '800', fontSize: 17 },
  colorDots: { flexDirection: 'row', gap: 5 },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,68,68,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: { color: COLORS.danger, fontWeight: '900', fontSize: 14 },
  addRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  addBtn: {
    backgroundColor: COLORS.primary + '22',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  addBtnText: { color: COLORS.primary, fontWeight: '900', fontSize: 14, letterSpacing: 1 },
  pickerSection: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pickerLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 3 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorSwatch: { width: 36, height: 36, borderRadius: 18 },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emojiOption: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
  },
  emojiOptionText: { fontSize: 24 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
  },
  settingInfo: { gap: 2 },
  settingLabel: { color: '#fff', fontWeight: '700', fontSize: 15 },
  settingDesc: { color: COLORS.textMuted, fontSize: 12 },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.bgCardLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleOn: { backgroundColor: COLORS.primary + '33', borderColor: COLORS.primary },
  toggleDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.textMuted,
    alignSelf: 'flex-start',
  },
  toggleDotOn: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
});
