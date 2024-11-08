import Elysia, { t } from 'elysia';
import puppeteer from 'puppeteer';
import { iconsListSmall } from '../../icons';
import {
  bgIsLight,
  blendColors,
  minimal_args,
  PROD,
  refiner,
  setSmallCardTitleSize,
} from '../common';
import { RefinerUser } from '../libs/refiner/models';
import { smallcardSvgContent } from '../svgContent';

const root = import.meta.env.FRONTEND_URL || 'http://localhost:5173';

export const smallCard = new Elysia()
  .get(
    '/smallcard/:id',
    async function* ({ query, params: { id }, error, set }) {
      let user: RefinerUser | undefined;

      try {
        user = await refiner.getUserData(id);
      } catch (e) {
        return error(500, {
          message: PROD ? 'Internal Server Error' : String(e),
        });
      }

      if (!user) return error(404, { message: 'User not found' });

      const url = new URL(`${root}/smallcard`);

      if (query.bg) url.searchParams.set('bg', query.bg);
      if (query.bg1 || query.bg2 || query.angle) {
        if (!query.bg || !query.bg1 || !query.bg2 || !query.angle) {
          return error(400, { message: 'bg, bg1, bg2, and angle must be provided together' });
        }

        url.searchParams.set('bg1', query.bg1);
        url.searchParams.set('bg2', query.bg2);
        url.searchParams.set('angle', query.angle);
      }

      if (query.withCreatedDate) url.searchParams.set('createdDate', user.created_at);
      if (query.withDiscordLabel) url.searchParams.set('discordLabel', 'true');
      if (query.withAccentColor && user.accent_color)
        url.searchParams.set('bg', user.accent_color.replace('#', ''));
      if (query.withActivity) url.searchParams.set('withActivity', JSON.stringify(user.activity));
      if (query.withMood) url.searchParams.set('withMood', JSON.stringify(user.mood));

      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        args: minimal_args,
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 1350, height: 450 });
      await page.goto(url.toString(), { waitUntil: 'networkidle0' });

      const buffer = await page.screenshot({
        clip: { x: 0, y: 0, width: 1350, height: 450 },
      });

      set.headers['content-type'] = 'image/png';
      buffer && (set.headers['content-length'] = String(buffer.length));

      yield buffer;

      await browser.close();

      return;
    },
    {
      query: t.Object({
        bg: t.Optional(t.String()),

        bg1: t.Optional(t.String()),
        bg2: t.Optional(t.String()),
        angle: t.Optional(t.String()),

        withCreatedDate: t.Optional(t.Boolean()),
        withDiscordLabel: t.Optional(t.Boolean()),
        withAccentColor: t.Optional(t.Boolean()),
        withActivity: t.Optional(t.Boolean()),
        withMood: t.Optional(t.Boolean()),
      }),
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .get(
    '/smallcard_svg/:id',
    async ({ query, params: { id }, error, set }) => {
      let user: RefinerUser | undefined;

      try {
        user = await refiner.getUserData(id);
      } catch (e) {
        return error(500, {
          message: PROD ? 'Internal Server Error' : String(e),
        });
      }

      if (!user) return error(404, { message: 'User not found' });

      const avatar = await fetch(user.avatar);
      const avatarBuffer = await avatar.arrayBuffer();
      const avatarBase64 = `data:${avatar.headers.get('Content-Type') || 'image/png'};base64,${Buffer.from(avatarBuffer).toString('base64')}`;

      const background = query.bg
        ? `#${query.bg}`
        : query.withAccentColor
          ? (user.accent_color ?? '#2b2d31')
          : undefined;

      let textColor = 'white';

      if (query.bg1) {
        const blendColor = blendColors(`#${query.bg1}`, `#${query.bg2}`);
        if (!blendColor) return error(400, { message: 'Invalid bg1 and bg2' });
        textColor = bgIsLight(blendColor) ? '#202225' : 'white';
      }

      if (background) textColor = bgIsLight(background) ? '#202225' : 'white';

      if (user.status === 'offline' && textColor === '#202225') textColor = '#5d5f6b';

      const svg = smallcardSvgContent({
        width: 360,
        height: 120,
        bg1: query.bg1,
        bg2: query.bg2,
        background,
        angle: query.angle ?? '0',
        avatar: avatarBase64,
        displayName: user.display_name,
        statusImage: iconsListSmall[user.status],
        createdDate: query.withCreatedDate ? user.created_at : undefined,
        activity: query.withActivity ? user.activity : undefined,
        mood: query.withMood ? user.mood : undefined,
        discordLabel: query.withDiscordLabel,
        textColor,
        titleSize: setSmallCardTitleSize(user.display_name),
      });

      set.headers['content-type'] = 'image/svg+xml';

      return svg;
    },
    {
      query: t.Object({
        bg: t.Optional(t.String()),

        bg1: t.Optional(t.String()),
        bg2: t.Optional(t.String()),
        angle: t.Optional(t.String()),

        withCreatedDate: t.Optional(t.Boolean()),
        withDiscordLabel: t.Optional(t.Boolean()),
        withAccentColor: t.Optional(t.Boolean()),
        withActivity: t.Optional(t.Boolean()),
        withMood: t.Optional(t.Boolean()),
      }),
      params: t.Object({
        id: t.String(),
      }),
    }
  );
