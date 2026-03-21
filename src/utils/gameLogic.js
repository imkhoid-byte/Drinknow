import AsyncStorage from '@react-native-async-storage/async-storage';

const GAME_STATE_KEY = 'drinknow_game_state';
const SETTINGS_KEY = 'drinknow_settings';

export const DEFAULT_SETTINGS = {
  spicyMode: false,      // Enables adult-only challenges
  hardcoreMode: false,   // Higher drink counts
  viralMode: true,       // Camera challenges enabled
  wildcards: true,       // Random wildcard events
  soundEnabled: true,
  hapticsEnabled: true,
};

export function createGameState(players, settings = DEFAULT_SETTINGS) {
  return {
    players: players.map((p, i) => ({
      id: i,
      name: p.name,
      emoji: p.emoji || '🎯',
      color: p.color,
      sips: 0,
      streak: 0,        // consecutive drinks
      refusals: 0,
      shameCount: 0,
      wildcardActive: null,
      isImmune: false,
      immuneTurns: 0,
      mirrorCursed: false,
      mirrorTurns: 0,
      debtOwed: null,
    })),
    currentPlayerIndex: 0,
    round: 1,
    turnCount: 0,
    history: [],
    settings,
    wildcardQueue: [],
    lastWildcardTurn: 0,
    gameStartTime: Date.now(),
    shameWallPhotos: [],
  };
}

export function nextPlayer(state) {
  const next = (state.currentPlayerIndex + 1) % state.players.length;
  const newTurn = state.turnCount + 1;
  const newRound = Math.floor(newTurn / state.players.length) + 1;

  return {
    ...state,
    currentPlayerIndex: next,
    turnCount: newTurn,
    round: newRound,
  };
}

export function recordDrink(state, playerId, sips) {
  const players = state.players.map(p => {
    if (p.id !== playerId) {
      // Check mirror curse
      if (p.mirrorCursed && p.mirrorTurns > 0) {
        return { ...p, sips: p.sips + sips, mirrorTurns: p.mirrorTurns - 1, mirrorCursed: p.mirrorTurns > 1 };
      }
      return p;
    }
    const newSips = p.sips + sips;
    const newStreak = p.streak + 1;
    return { ...p, sips: newSips, streak: newStreak };
  });
  return { ...state, players };
}

export function recordRefusal(state, playerId, sipsPenalty) {
  const players = state.players.map(p => {
    if (p.id !== playerId) return p;
    return { ...p, sips: p.sips + sipsPenalty, refusals: p.refusals + 1, streak: 0 };
  });
  return { ...state, players };
}

export function resetStreak(state, playerId) {
  const players = state.players.map(p => {
    if (p.id !== playerId) return p;
    return { ...p, streak: 0 };
  });
  return { ...state, players };
}

export function addShamePhoto(state, photoUri, playerId) {
  return {
    ...state,
    shameWallPhotos: [...state.shameWallPhotos, { uri: photoUri, playerId, timestamp: Date.now() }],
    players: state.players.map(p => p.id === playerId ? { ...p, shameCount: p.shameCount + 1 } : p),
  };
}

export function shouldTriggerWildcard(state) {
  return (
    state.settings.wildcards &&
    state.turnCount > 0 &&
    state.turnCount % 6 === 0 &&
    state.turnCount !== state.lastWildcardTurn
  );
}

export function getMVP(players) {
  // Most sips = drunkest legend
  return players.reduce((a, b) => a.sips > b.sips ? a : b);
}

export function getLightweight(players) {
  return players.reduce((a, b) => a.refusals > b.refusals ? a : b);
}

export function getStats(state) {
  const total = state.players.reduce((sum, p) => sum + p.sips, 0);
  const duration = Math.floor((Date.now() - state.gameStartTime) / 60000);
  const mvp = getMVP(state.players);
  const lightweight = getLightweight(state.players);
  return { total, duration, mvp, lightweight, rounds: state.round };
}

export async function saveGameState(state) {
  try {
    await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state', e);
  }
}

export async function loadGameState() {
  try {
    const data = await AsyncStorage.getItem(GAME_STATE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {}
}

export async function loadSettings() {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export const PLAYER_EMOJIS = ['🔥', '💀', '👑', '🌪️', '⚡', '🎯', '🦋', '🐉', '🌙', '✨', '🎪', '💎'];
export const PLAYER_COLORS = [
  '#FF3CAC', '#4ECDC4', '#FFE66D', '#A855F7', '#F97316', '#FF6B6B',
  '#06D6A0', '#FB8B24', '#3B82F6', '#EC4899', '#84CC16', '#F43F5E',
];
