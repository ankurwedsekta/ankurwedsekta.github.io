export const couple = {
  groom: 'Ankur',
  bride: 'Ekta',
} as const;

export const families = {
  groomParents: 'श्रीमती इंदु एवं श्री रोहित धीर',
  groomParentsEn: 'Mrs. Indu & Mr. Rohit Dhir',
  brideParents: 'श्रीमती सीमा एवं श्री रवि वाही',
  brideGrandparents: 'स्व. श्रीमती स्नेहलता एवं स्व. श्री रमेश कुमार वाही',
  compliments: 'धीर एवं मदान परिवार',
  complimentsEn: 'The Dhir & Madan Families',
} as const;

export const venue = {
  name: 'Orriva',
  subtitle: 'Awadh Palace',
  lines: ['Rajnagar Extension', 'Ghaziabad, Uttar Pradesh'],
  query: 'Orriva (Awadh Palace), Rajnagar Extension, Ghaziabad',
} as const;

export const venueAddress = `${venue.name} (${venue.subtitle}), ${venue.lines.join(', ')}`;
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.query)}`;
export const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(venue.query)}&z=15&output=embed`;

export type SceneKey = 'sagaai' | 'sehra' | 'baraat' | 'dawat';

export type Ceremony = {
  id: SceneKey;
  name: string;
  devanagari: string;
  subtitle: string;
  day: 'day-one' | 'day-two';
  weekday: string;
  date: string;
  time: string;
  meridiem: string;
  start: string;
  end: string;
  line: string;
  /** On-page copy (Hindi); English fields above feed calendar entries. */
  subtitleHi: string;
  lineHi: string;
  weekdayHi: string;
  palette: {bg: string; glow: string; ink: string; muted: string; accent: string};
};

export const ceremonies: Ceremony[] = [
  {
    id: 'sagaai',
    name: 'Sagaai',
    devanagari: 'सगाई',
    subtitle: 'The Engagement',
    day: 'day-one',
    weekday: 'Friday',
    date: '20 November 2026',
    time: '6:00',
    meridiem: 'PM',
    start: '2026-11-20T18:00:00+05:30',
    end: '2026-11-20T22:30:00+05:30',
    line: 'Two families, one promise. Rings are exchanged beneath a canopy of mango leaves and marigold, and the celebrations begin.',
    subtitleHi: 'रिश्तों का पहला वचन',
    lineHi: 'दो परिवार, एक वचन। आम्र-पल्लव और गेंदे की छाँव में अंगूठियों का आदान-प्रदान — और उत्सव का शुभारंभ।',
    weekdayHi: 'शुक्रवार',
    palette: {bg: '#0f3a2c', glow: '#2f7a5a', ink: '#f3ead8', muted: 'rgb(243 234 216 / 0.66)', accent: '#ec9bbb'},
  },
  {
    id: 'sehra',
    name: 'Sehra Bandi',
    devanagari: 'सेहरा बंदी',
    subtitle: 'Veiling the Groom',
    day: 'day-two',
    weekday: 'Saturday',
    date: '21 November 2026',
    time: '5:00',
    meridiem: 'PM',
    start: '2026-11-21T17:00:00+05:30',
    end: '2026-11-21T18:00:00+05:30',
    line: 'Strings of jasmine and pearl are tied across the groom’s brow by the hands that raised him — a veil of blessings for the road ahead.',
    subtitleHi: 'आशीषों से सजा सेहरा',
    lineHi: 'जिन हाथों ने पाला-पोसा, वही हाथ मोतियों और मोगरे का सेहरा बाँधते हैं — आगे की राह के लिए आशीषों की छाँव।',
    weekdayHi: 'शनिवार',
    palette: {bg: '#e29a33', glow: '#f7d37a', ink: '#3a0d09', muted: 'rgb(58 13 9 / 0.7)', accent: '#9b1d16'},
  },
  {
    id: 'baraat',
    name: 'Baraat',
    devanagari: 'बारात',
    subtitle: 'The Procession',
    day: 'day-two',
    weekday: 'Saturday',
    date: '21 November 2026',
    time: '6:00',
    meridiem: 'PM',
    start: '2026-11-21T18:00:00+05:30',
    end: '2026-11-21T20:00:00+05:30',
    line: 'Dhol, shehnai and dancing feet. The procession sets out beneath a sky of fireworks to bring the groom to his bride.',
    subtitleHi: 'दूल्हे राजा की सवारी',
    lineHi: 'ढोल की थाप, शहनाई की तान और थिरकते क़दम — आतिशबाज़ी से जगमगाते आसमान तले दूल्हा चला अपनी दुल्हन लाने।',
    weekdayHi: 'शनिवार',
    palette: {bg: '#06262d', glow: '#14606b', ink: '#f3ead8', muted: 'rgb(243 234 216 / 0.66)', accent: '#f0a943'},
  },
  {
    id: 'dawat',
    name: 'Dawat',
    devanagari: 'दावत',
    subtitle: 'The Royal Feast',
    day: 'day-two',
    weekday: 'Saturday',
    date: '21 November 2026',
    time: '8:00',
    meridiem: 'PM',
    start: '2026-11-21T20:00:00+05:30',
    end: '2026-11-21T23:30:00+05:30',
    line: 'Lantern light, laughter and a table laid for everyone we love. Stay late — the night belongs to all of us.',
    subtitleHi: 'शाही भोज',
    lineHi: 'दीपों की रोशनी, ठहाकों की गूँज और अपनों से सजी महफ़िल। जी भर के रुकिए — आज की रात हम सबकी है।',
    weekdayHi: 'शनिवार',
    palette: {bg: '#8a1a13', glow: '#c7462c', ink: '#f8e9c9', muted: 'rgb(248 233 201 / 0.7)', accent: '#f2c45a'},
  },
];

export const weddingMoment = new Date('2026-11-21T17:00:00+05:30');
