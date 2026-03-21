// ============================================================
//  DRINKNOW - Challenge Database
//  Categories with sips cost, viral potential, and type flags
// ============================================================

export const CATEGORIES = {
  TRUTH: {
    id: 'TRUTH',
    label: 'TRUTH 🔥',
    color: '#FF6B6B',
    glow: '#FF6B6B44',
    sips: 0, // player drinks if they refuse
    refuseSips: 3,
  },
  DARE: {
    id: 'DARE',
    label: 'DARE 💀',
    color: '#FFE66D',
    glow: '#FFE66D44',
    sips: 0,
    refuseSips: 4,
  },
  DRINK: {
    id: 'DRINK',
    label: 'DRINK 🍺',
    color: '#4ECDC4',
    glow: '#4ECDC444',
    sips: 2,
    refuseSips: 0,
  },
  VIRAL: {
    id: 'VIRAL',
    label: 'VIRAL 📱',
    color: '#FF3CAC',
    glow: '#FF3CAC44',
    sips: 0,
    refuseSips: 5,
    camera: true,
  },
  CHAOS: {
    id: 'CHAOS',
    label: 'CHAOS ⚡',
    color: '#A855F7',
    glow: '#A855F744',
    sips: 0,
    everyone: true,
  },
  VOTE: {
    id: 'VOTE',
    label: 'VOTE 👆',
    color: '#F97316',
    glow: '#F9731644',
    sips: 0,
    voting: true,
  },
};

export const CHALLENGES = {
  TRUTH: [
    { id: 't1', text: "What's the most embarrassing thing you've done drunk?", viral: false },
    { id: 't2', text: "Name someone in this room you'd kiss right now. No lying.", viral: false },
    { id: 't3', text: "What's your body count? Round to the nearest 5.", viral: true },
    { id: 't4', text: "Read your most recent text out loud. ALL of it.", viral: true },
    { id: 't5', text: "Show your camera roll from 3 weeks ago. First 10 photos.", viral: true },
    { id: 't6', text: "What's the weirdest thing you've Googled this month?", viral: false },
    { id: 't7', text: "Admit the most childish thing you still do when alone.", viral: false },
    { id: 't8', text: "Who in this room would you date if you HAD to choose?", viral: false },
    { id: 't9', text: "What's a secret you've kept from your best friend?", viral: false },
    { id: 't10', text: "Rate everyone in this room's vibe out of 10. Brutally honest.", viral: true },
    { id: 't11', text: "What's the pettiest reason you've ghosted someone?", viral: false },
    { id: 't12', text: "DM your ex right now. They pick what you send.", viral: true },
    { id: 't13', text: "Show everyone your Spotify Wrapped. Judge away.", viral: true },
    { id: 't14', text: "What's your most embarrassing nickname someone gave you?", viral: false },
    { id: 't15', text: "Let someone read your notes app out loud.", viral: true },
    { id: 't16', text: "Who was your worst kiss? You don't have to say the name but describe them.", viral: false },
    { id: 't17', text: "What's a lie you told your parents that actually worked?", viral: false },
    { id: 't18', text: "Describe your type in one brutal honest sentence.", viral: false },
    { id: 't19', text: "What's the most unhinged thing you've done for attention?", viral: true },
    { id: 't20', text: "Post your last 5 screen time hours publicly. (Or 3 drinks)", viral: true },
  ],

  DARE: [
    { id: 'd1', text: "Do your best impression of someone in this room. They guess who.", viral: true },
    { id: 'd2', text: "Speak in an accent chosen by the group until your next turn.", viral: false },
    { id: 'd3', text: "Let the group write anything on your forehead with a marker.", viral: true },
    { id: 'd4', text: "Do 5 push-ups while making eye contact with someone. They pick who.", viral: true },
    { id: 'd5', text: "Text your most recent contact: 'You looked incredible tonight'", viral: true },
    { id: 'd6', text: "Swap shirts with the person to your left for 2 rounds.", viral: true },
    { id: 'd7', text: "Call someone in your phone and sing them Happy Birthday.", viral: true },
    { id: 'd8', text: "Do your worst TikTok dance. Group votes if it passes.", viral: true },
    { id: 'd9', text: "Lick your elbow for 10 seconds. Genuinely try.", viral: true },
    { id: 'd10', text: "Let someone post anything to your Instagram story for 1 hour.", viral: true },
    { id: 'd11', text: "Talk to an imaginary friend named Gerald for 60 seconds straight.", viral: true },
    { id: 'd12', text: "Do your best villain laugh. Group rates it. Under 7/10 = drink.", viral: true },
    { id: 'd13', text: "Eat a spoonful of the grossest condiment combo the group invents.", viral: true },
    { id: 'd14', text: "Send a voice note saying 'I miss you' to someone from high school.", viral: true },
    { id: 'd15', text: "Let the group set your phone wallpaper to whatever they want.", viral: true },
    { id: 'd16', text: "Do a 30-second infomercial for your least favourite app.", viral: true },
    { id: 'd17', text: "Carry someone piggyback across the room without stopping.", viral: true },
    { id: 'd18', text: "Post a photo of your feet to your main story. No context.", viral: true },
    { id: 'd19', text: "Do a runway walk like a supermodel. Group provides commentary.", viral: true },
    { id: 'd20', text: "Let someone draw a tattoo on your arm in marker. You can't see it until they're done.", viral: true },
  ],

  DRINK: [
    { id: 'dr1', text: "Drink! No questions asked.", sips: 2, viral: false },
    { id: 'dr2', text: "Waterfall! Everyone drinks until you stop. You start.", sips: 0, viral: false },
    { id: 'dr3', text: "Take a sip for every year you've been single.", sips: 0, viral: false },
    { id: 'dr4', text: "Drink once for every person in the room you've had a crush on.", sips: 0, viral: false },
    { id: 'dr5', text: "If you have a tattoo, everyone else drinks. If not, you drink double.", sips: 0, viral: false },
    { id: 'dr6', text: "Drink once per social media platform you checked today.", sips: 0, viral: false },
    { id: 'dr7', text: "The person with the most Instagram followers drinks.", sips: 2, viral: false },
    { id: 'dr8', text: "Drink if your battery is under 50% right now.", sips: 2, viral: false },
    { id: 'dr9', text: "Last person to stand up drinks twice.", sips: 2, viral: false },
    { id: 'dr10', text: "Drink once for each app notification you currently have. Max 5.", sips: 0, viral: false },
    { id: 'dr11', text: "Pour your drink into someone else's. They drink it all.", sips: 0, viral: false },
    { id: 'dr12', text: "Give out 3 sips to anyone you want. Split or not.", sips: 0, viral: false },
    { id: 'dr13', text: "The person to your left gives you a challenge. If you fail, drink.", sips: 2, viral: false },
    { id: 'dr14', text: "Drink if you've ever cried at a movie tonight.", sips: 2, viral: false },
    { id: 'dr15', text: "Name an actor. Everyone who doesn't know them drinks.", sips: 0, viral: false },
  ],

  VIRAL: [
    {
      id: 'v1',
      text: "FACE-OFF 📸 Two players picked by the group make the funniest face simultaneously on selfie camera. Group votes. Loser drinks 3.",
      camera: true,
      cameraMode: 'photo',
      viral: true,
    },
    {
      id: 'v2',
      text: "ROAST SESSION 🎤 Stand up and roast the person to your right for 30 seconds. Camera ON. No mercy.",
      camera: true,
      cameraMode: 'video',
      duration: 30,
      viral: true,
    },
    {
      id: 'v3',
      text: "LIPSYNC BATTLE 🎵 Group picks a song. You have 20 seconds to lipsync. Front camera ON.",
      camera: true,
      cameraMode: 'video',
      duration: 20,
      viral: true,
    },
    {
      id: 'v4',
      text: "MUGSHOT TIME 🚔 Everyone makes their 'arrested' face. Screenshots taken. Shared in group chat by you.",
      camera: true,
      cameraMode: 'photo',
      viral: true,
    },
    {
      id: 'v5',
      text: "INSTANT REPLAY 🎬 Recreate an iconic movie scene with whoever the group assigns. 45 seconds. Camera rolling.",
      camera: true,
      cameraMode: 'video',
      duration: 45,
      viral: true,
    },
    {
      id: 'v6',
      text: "REACTION CAM 😱 Without warning, the person to your left will shout something in your ear. Camera captures your face.",
      camera: true,
      cameraMode: 'photo',
      viral: true,
    },
    {
      id: 'v7',
      text: "WALK OF FAME 💃 Do your most dramatic slow-motion walk across the room while everyone stares. Camera tracks you.",
      camera: true,
      cameraMode: 'video',
      duration: 10,
      viral: true,
    },
    {
      id: 'v8',
      text: "CONFESSIONAL 🎙️ Look into the camera and confess something. Keep it PG-13 or get PG-rated revenge dares.",
      camera: true,
      cameraMode: 'video',
      duration: 20,
      viral: true,
    },
    {
      id: 'v9',
      text: "THE FREEZE 🧊 Everyone freezes on the count of 3. Screenshot taken. Anyone who moves drinks. Photo gets shared.",
      camera: true,
      cameraMode: 'photo',
      viral: true,
    },
    {
      id: 'v10',
      text: "VILLAIN ORIGIN STORY 😈 30 seconds, camera on. Explain why you turned evil. As dramatic as possible.",
      camera: true,
      cameraMode: 'video',
      duration: 30,
      viral: true,
    },
    {
      id: 'v11',
      text: "MIRROR MATCH 🪞 Two players mirror each other's movements for 20 seconds while everyone films. Whoever breaks first drinks.",
      camera: true,
      cameraMode: 'video',
      duration: 20,
      viral: true,
    },
    {
      id: 'v12',
      text: "SILENT DISCO 🎧 Everyone dances for 15 seconds to music ONLY you can hear in your head. Camera captures it all.",
      camera: true,
      cameraMode: 'video',
      duration: 15,
      viral: true,
    },
  ],

  CHAOS: [
    {
      id: 'c1',
      text: "EVERYONE DRINKS 🍺 No reason needed. Just vibes.",
      everyone: true,
      sips: 2,
      viral: false,
    },
    {
      id: 'c2',
      text: "SPEED ROUND ⚡ Go clockwise. Each person says a word in a category chosen by this player. First to hesitate drinks 3.",
      everyone: true,
      viral: false,
    },
    {
      id: 'c3',
      text: "PANIC BUTTON 🔴 EVERYONE stands up, swaps seats, and last person sitting takes 3 sips.",
      everyone: true,
      viral: true,
    },
    {
      id: 'c4',
      text: "PHONE SWAP 📱 Pass your phone left. That person can read any app for 30 seconds. They can't tell you what they saw.",
      everyone: true,
      viral: false,
    },
    {
      id: 'c5',
      text: "MOST LIKELY TO 🏆 This player says 'most likely to __'. Everyone points at someone. Most fingers = most sips.",
      everyone: true,
      viral: true,
    },
    {
      id: 'c6',
      text: "REVERSE PSYCHOLOGY 🔄 This round, the rules flip. 'No' means drink. 'Cheers' means stop. Gets weird fast.",
      everyone: true,
      viral: false,
      ruleChange: true,
    },
    {
      id: 'c7',
      text: "JUDGE JUDY ⚖️ This player picks two others. They argue about something stupid for 60 seconds. Group votes winner. Loser drinks.",
      everyone: false,
      viral: true,
    },
    {
      id: 'c8',
      text: "RHYME CRIME 🎤 Go around — each person says a rhyming word. First to break the chain drinks 3. This player starts with any word.",
      everyone: true,
      viral: false,
    },
    {
      id: 'c9',
      text: "THUNDERSTRUCK ⚡ Play Thunderstruck by AC/DC. Every time they say 'thunder' someone different drinks. This player picks the order.",
      everyone: true,
      viral: true,
    },
    {
      id: 'c10',
      text: "COMPLIMENT BOMB 💕 Everyone must sincerely compliment the player to their left. Best compliment wins — chosen by this player. Worst compliment drinks 2.",
      everyone: true,
      viral: false,
    },
  ],

  VOTE: [
    {
      id: 'vo1',
      text: "WHO'S MOST LIKELY TO text their ex tonight? Vote 3...2...1... POINT! Most votes = 3 sips.",
      voting: true,
      viral: true,
    },
    {
      id: 'vo2',
      text: "SECRET ADMIRER 💌 Everyone secretly writes who they'd date in the room. This player reads them out one by one. No names revealed.",
      voting: true,
      viral: false,
    },
    {
      id: 'vo3',
      text: "VILLAIN VOTE 😈 Who made the worst decision this week? Vote 3...2...1... Most votes tells the story. Then drinks.",
      voting: true,
      viral: true,
    },
    {
      id: 'vo4',
      text: "HOTTEST TAKE 🔥 Everyone says their most controversial opinion in 10 seconds. Group votes for the wildest one. Winner picks who drinks.",
      voting: true,
      viral: true,
    },
    {
      id: 'vo5',
      text: "SURVIVOR VOTE 🏝️ If one person had to leave the party right now, who? Vote simultaneously. Most votes = 4 sips. They stay though.",
      voting: true,
      viral: true,
    },
    {
      id: 'vo6',
      text: "POWER RANKING 📊 Rate everyone's outfit tonight 1-10. Average it out. Lowest score drinks, highest score gives out 3.",
      voting: true,
      viral: false,
    },
  ],
};

// Special one-time event cards (pulled randomly throughout game)
export const WILDCARD_EVENTS = [
  {
    id: 'wc1',
    text: "🃏 WILDCARD: THE BETRAYAL\nEveryone secretly picks one person to 'betray'. Most betrayals = double drinks on next turn. Reveal all at once!",
    type: 'wildcard',
  },
  {
    id: 'wc2',
    text: "🃏 WILDCARD: IMMUNITY IDOL\nThis player is immune from drinking for their next 2 turns. They can give their immunity to someone else instead.",
    type: 'wildcard',
  },
  {
    id: 'wc3',
    text: "🃏 WILDCARD: DRINK DEBT\nThis player owes one person a debt. That person can call it in ANY time tonight — any drink, any dare.",
    type: 'wildcard',
  },
  {
    id: 'wc4',
    text: "🃏 WILDCARD: MIRROR CURSE\nWhatever this player drinks, the person to their right drinks too. Lasts 3 turns.",
    type: 'wildcard',
  },
  {
    id: 'wc5',
    text: "🃏 WILDCARD: THE GAUNTLET\nThis player challenges anyone to a thumb war. Winner picks a 5-sip punishment for the loser.",
    type: 'wildcard',
  },
];

export const SHAME_WALL_PHRASES = [
  "CERTIFIED MENACE 🏆",
  "TOO BRAVE FOR THEIR OWN GOOD 💀",
  "ABSOLUTELY UNHINGED 🌀",
  "SHOULD HAVE STAYED HOME 🏠",
  "NO SHAME WHATSOEVER 🙈",
  "MAIN CHARACTER ENERGY ⭐",
  "BOLDEST MOVE OF THE NIGHT 💪",
  "HALL OF FAME 🎖️",
  "LEGEND STATUS 👑",
  "THE CHAOS AGENT 😈",
];

export const CATEGORY_ORDER = ['TRUTH', 'DARE', 'DRINK', 'VIRAL', 'CHAOS', 'VOTE'];

export const SPIN_WEIGHTS = {
  TRUTH: 20,
  DARE: 20,
  DRINK: 15,
  VIRAL: 20,
  CHAOS: 15,
  VOTE: 10,
};

export function getWeightedCategory() {
  const total = Object.values(SPIN_WEIGHTS).reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (const [cat, weight] of Object.entries(SPIN_WEIGHTS)) {
    rand -= weight;
    if (rand <= 0) return cat;
  }
  return 'TRUTH';
}

export function getRandomChallenge(category) {
  const pool = CHALLENGES[category];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomWildcard() {
  return WILDCARD_EVENTS[Math.floor(Math.random() * WILDCARD_EVENTS.length)];
}

export function getShamePhrase() {
  return SHAME_WALL_PHRASES[Math.floor(Math.random() * SHAME_WALL_PHRASES.length)];
}
