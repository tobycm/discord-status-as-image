import Refiner from './libs/refiner';
import { EmojiType } from './libs/refiner/models';

const refinerEndpoint = import.meta.env.REFINER_API_URL || 'http://localhost:7000';

export const refiner = new Refiner(refinerEndpoint);

export const minimal_args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
  '--headless',
];

export const PROD = import.meta.env.PROD === 'true';

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function bgIsLight(color: string | { r: number; g: number; b: number }) {
  if (typeof color === 'string') {
    color = hexToRgb(color) ?? { r: 255, g: 255, b: 255 };
  }

  const { r, g, b } = color;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 186;
}

export function blendColors(colorA: string, colorB: string) {
  const colorAMatch = colorA.match(/\w\w/g);
  const colorBMatch = colorB.match(/\w\w/g);
  if (!colorAMatch || !colorBMatch) return;
  const [rA, gA, bA] = colorAMatch.map((c) => parseInt(c, 16));
  const [rB, gB, bB] = colorBMatch.map((c) => parseInt(c, 16));
  const r = Math.round(rA + (rB - rA) * 0.5)
    .toString(16)
    .padStart(2, '0');
  const g = Math.round(gA + (gB - gA) * 0.5)
    .toString(16)
    .padStart(2, '0');
  const b = Math.round(bA + (bB - bA) * 0.5)
    .toString(16)
    .padStart(2, '0');
  // eslint-disable-next-line consistent-return
  return `#${r}${g}${b}`;
}

export const monthsKey = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  10: 'October',
  11: 'November',
  12: 'December',
} as const;

export function formatDate(date: string) {
  return `${monthsKey[date.slice(0, 2) as keyof typeof monthsKey].slice(0, 3)}${' '}
  ${date.slice(3, 5)}, ${date.slice(6, 10)}`;
}

export const getEmojiURLfromCDN = (emoji: EmojiType) =>
  `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`;

export function setSmallCardTitleSize(displayName: string | undefined) {
  const length = displayName?.length;

  if (!length) return 45;

  if (length > 30) return 45;
  if (length > 25) return 50;
  if (length > 20) return 60;
  if (length > 15) return 80;
  return 100;
}
