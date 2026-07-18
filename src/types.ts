export interface Memory {
  id: string;
  imageUrl: string;
  title: string;
  date: string;
  description: string;
}

export interface RelationshipConfig {
  boyName: string;
  girlName: string;
  startDate: string; // ISO string or YYYY-MM-DD
  passcode: string;
  letterTitle: string;
  letterText: string;
  memories: Memory[];
  musicEnabled: boolean;
  musicType?: 'musicbox' | 'lullaby' | 'starlit';
  floatingTheme?: 'hearts' | 'roses' | 'stars' | 'none';
  customWishes?: string[];
  pandaMessages?: string[];
  customTheme?: 'rose_midnight' | 'pastel_pink' | 'midnight_red' | 'sweet_lavender';
  adminPasscode?: string;
}
