import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/theme';

const RULES = [
  {
    icon: '👥',
    title: 'Add Players',
    desc: 'Add 2-10 players with custom names, emojis, and colours. More players = more chaos.',
  },
  {
    icon: '🎡',
    title: 'Spin the Wheel',
    desc: 'Tap the wheel to spin. It lands on a category: Truth, Dare, Drink, Viral, Chaos, or Vote.',
  },
  {
    icon: '🔥',
    title: 'Complete Challenges',
    desc: 'The current player must complete their challenge. Refuse and drink the penalty instead.',
  },
  {
    icon: '📱',
    title: 'VIRAL Mode',
    desc: 'Some challenges use the camera. These are MADE for recording. Turn on content mode to frame them perfectly.',
  },
  {
    icon: '⚡',
    title: 'CHAOS Cards',
    desc: "Chaos affects EVERYONE. No one is safe when the chaos wheel hits.",
  },
  {
    icon: '🃏',
    title: 'Wildcards',
    desc: 'Every 6 turns a WILDCARD drops — surprise mechanics that flip the game.',
  },
  {
    icon: '📸',
    title: 'Shame Wall',
    desc: "After epic fails, snap a photo for the Shame Wall. It's the highlight reel of the night.",
  },
  {
    icon: '🏆',
    title: 'End Game',
    desc: 'Tap End Game anytime to see final stats: most sips, streak king, and who chickened out most.',
  },
];

const CATEGORIES = [
  { label: 'TRUTH 🔥', color: COLORS.TRUTH, desc: 'Spill your darkest secrets. Or drink.' },
  { label: 'DARE 💀', color: COLORS.DARE, desc: 'Physical challenges and social chaos.' },
  { label: 'DRINK 🍺', color: COLORS.DRINK, desc: 'No questions. Just sips.' },
  { label: 'VIRAL 📱', color: COLORS.VIRAL, desc: 'Camera-on challenges built to be recorded.' },
  { label: 'CHAOS ⚡', color: COLORS.CHAOS, desc: 'Everyone plays. Nobody is safe.' },
  { label: 'VOTE 👆', color: COLORS.VOTE, desc: 'Group decides who suffers.' },
];

export default function HowToPlayScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#070714', '#0d0d2b', '#070714']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>

        <Text style={styles.title}>HOW TO PLAY</Text>

        <Text style={styles.sectionLabel}>THE RULES</Text>
        {RULES.map((r, i) => (
          <View key={i} style={styles.ruleCard}>
            <Text style={styles.ruleIcon}>{r.icon}</Text>
            <View style={styles.ruleText}>
              <Text style={styles.ruleTitle}>{r.title}</Text>
              <Text style={styles.ruleDesc}>{r.desc}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionLabel}>CATEGORIES</Text>
        {CATEGORIES.map(c => (
          <View key={c.label} style={[styles.catCard, { borderColor: c.color }]}>
            <Text style={[styles.catLabel, { color: c.color }]}>{c.label}</Text>
            <Text style={styles.catDesc}>{c.desc}</Text>
          </View>
        ))}

        <Text style={styles.disclaimer}>
          🔞 Drink responsibly. Know your limits. DrinkNow is for entertainment only.
          Never drink and drive. If you don't drink, use a soft drink instead!
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40, gap: 14 },
  back: { marginBottom: 8 },
  backText: { color: COLORS.primary, fontWeight: '800', fontSize: 15, letterSpacing: 2 },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 16,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 4,
    marginTop: 8,
  },
  ruleCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ruleIcon: { fontSize: 28, width: 36 },
  ruleText: { flex: 1, gap: 4 },
  ruleTitle: { color: '#fff', fontWeight: '800', fontSize: 16 },
  ruleDesc: { color: COLORS.textSub, fontSize: 14, lineHeight: 20 },
  catCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    gap: 4,
  },
  catLabel: { fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  catDesc: { color: COLORS.textSub, fontSize: 14 },
  disclaimer: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 16,
  },
});
