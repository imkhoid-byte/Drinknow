export const COLORS = {
  bg: '#070714',
  bgCard: '#0E0E24',
  bgCardLight: '#161632',
  border: '#2A2A5A',
  primary: '#FF3CAC',
  primaryGlow: 'rgba(255,60,172,0.3)',
  secondary: '#4ECDC4',
  secondaryGlow: 'rgba(78,205,196,0.3)',
  accent: '#FFE66D',
  accentGlow: 'rgba(255,230,109,0.3)',
  purple: '#A855F7',
  purpleGlow: 'rgba(168,85,247,0.3)',
  orange: '#F97316',
  orangeGlow: 'rgba(249,115,22,0.3)',
  text: '#FFFFFF',
  textSub: '#9999CC',
  textMuted: '#555580',
  danger: '#FF4444',
  success: '#44FF88',

  // Category colors
  TRUTH: '#FF6B6B',
  DARE: '#FFE66D',
  DRINK: '#4ECDC4',
  VIRAL: '#FF3CAC',
  CHAOS: '#A855F7',
  VOTE: '#F97316',
};

export const SHADOWS = {
  neon: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  }),
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const FONTS = {
  title: {
    fontWeight: '900',
    letterSpacing: 2,
  },
  heading: {
    fontWeight: '800',
    letterSpacing: 1,
  },
  body: {
    fontWeight: '400',
  },
  mono: {
    fontFamily: 'monospace',
  },
};
