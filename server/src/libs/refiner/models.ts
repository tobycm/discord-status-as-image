type GeneralActivityType = {
  type: string;
  name: string;
};

type SpotifyActivityType = {
  platform: string;
  timestamps: {
    start: string;
    end: string;
    duration: string;
  };
  artists: string[];
  album: {
    name: string;
    cover: string;
  };
};

type ListeningActivityType = {
  type: string;
  name: string; // platform
  details: string; // song name
  state: string; // artist
  timestamps: {
    start: number;
    end: number;
  };
  assets: {
    large_image: string;
    small_image: string;
  };
};

type StreamingActivityType = {
  platform: string;
  twitch_name: string;
  url: string;
  game: string;
};

type OtherActivityType = {
  application_id: string;
  timestamps: {
    start: number;
  };
  details: string;
  state: string;
  assets: {
    large_image: string;
    small_image: string;
  };
};

export type ActivityType = GeneralActivityType &
  SpotifyActivityType &
  ListeningActivityType &
  StreamingActivityType &
  OtherActivityType;

export type RefinerUser = {
  id: string;
  username: string;
  display_name: string;
  avatar: string;
  status: 'online' | 'offline' | 'idle' | 'dnd';
  banner: string | null;
  accent_color: string | null;
  created_at: string;
  activity: ActivityType;
  mood: MoodType;
};

export type EmojiType = {
  id: number;
  name: string;
  animated?: boolean;
};

export type MoodType = {
  type: number;
  state: string; // message
  name: string;
  emoji: EmojiType;
};
