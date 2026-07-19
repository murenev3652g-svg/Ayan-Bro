import { RelationshipConfig } from '../types';

const DEFAULT_MEMORIES = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
    title: 'How It All Started 🌸',
    date: '2026-01-18',
    description: 'The beautiful day our hearts first connected. Every text, every sweet voice message, and every smile started here. Meeting you has been the best thing that ever happened to me.'
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    title: 'Our Sweet Date Nights ✨',
    date: '2026-03-14',
    description: 'Looking into your beautiful eyes, laughing at each other\'s silly jokes, and sharing food. No matter how busy life gets, my favorite place is always right next to you.'
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop',
    title: 'Holding Your Hand 🤝',
    date: '2026-04-25',
    description: 'When my hand is in yours, I feel like I can conquer anything. It\'s a promise that no matter where life takes us, we will walk the path together, always side by side.'
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop',
    title: 'The Unending Conversations 🌙',
    date: '2026-06-02',
    description: 'Those midnight chats where we share our deepest dreams, fears, and random daily thoughts. Time simply stops when I talk to you, and 6 hours feel like 6 minutes.'
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1501901609772-df0848060b33?q=80&w=800&auto=format&fit=crop',
    title: '6 Months of Pure Love ❤️',
    date: '2026-07-18',
    description: 'Happy 6 Months Anniversary, my girl! Half a year of endless smiles, beautiful memories, tiny cute arguments, and growing love. I can\'t wait for a lifetime more with you, Niru!'
  }
];

const DEFAULT_CONFIG: RelationshipConfig = {
  boyName: 'Ayan',
  girlName: 'Niru',
  startDate: '2026-01-18', // 6 months before 2026-07-18
  passcode: '2026',
  adminPasscode: '2026',
  letterTitle: 'Happy 6-Month Anniversary, My Love! ❤️',
  letterText: `My dearest Niru,

Happy 6 months of being together! 💖

Can you believe it has already been half a year since we started this beautiful journey? It feels like just yesterday when I first fell for your charm, and yet, I cannot imagine a single day of my life without you anymore. 

These 6 months have been the absolute happiest, most fulfilling days of my life. Your smile makes my darkest days bright, your sweet laughter is my favorite melody, and your loving heart is the place where I finally feel at home.

Thank you for your warmth, your cute tantrums, your beautiful care, and your endless love. I love the way you look at me, the way you say my name, and the way you hold my hand.

I promise to hold you tight through every storm, to celebrate every joy with you, to support your dreams, and to love you more with every single heartbeat.

Happy 6 Months, Niruu. You are my today, my tomorrow, and my forever.

Always yours,
Your Ayan ✨`,
  memories: DEFAULT_MEMORIES,
  musicEnabled: true,
  musicType: 'musicbox',
  floatingTheme: 'hearts',
  customTheme: 'rose_midnight',
  customWishes: [
    "Niruu, tmi amr jibon er shobcheye sundor upohar! Love you! 💖",
    "No matter how much we argue, my heart only belongs to you. Forever. 🤝",
    "Ayan says: 'Niruu is the prettiest girl in the entire world!' 😍",
    "Tmr sathe katano protiti muhurto amr jibon er shera smriti! 🌸",
    "I promise to hold your hand tight through every up and down! ⚡",
    "Happy 6 Months, my cute panda! Let's make it a lifetime! 🐼",
    "Tmr oi misti hashitai amr din ta valo korar jonno jottheshto! 😊",
    "Ayan wishes to make Niru the happiest girl ever! 👑"
  ],
  pandaMessages: [
    "Hey Niru! Ayan bollo tmi naki khub cute? Shotti? 🐼",
    "Ayan amake boleche tmake dusshtumi korte r khub valobashte! 💖",
    "Niru, did you drink water today? Ayan tmr onk care kore! 🥤",
    "Ayan is missing you right now! Send him a sweet message! 📲",
    "Panda says: Ayan and Niru are made for each other! 🌟",
    "Tmr cute mukhtir dike takale Ayan er shob koshto dure chole jay! 🥰"
  ],
  girlImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
  boyImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop'
};

const STORAGE_KEY = 'relationship_sandbox_config';

export function getRelationshipConfig(): RelationshipConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure existing properties remain or merge with defaults
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load config from localStorage', e);
  }
  return DEFAULT_CONFIG;
}

export function saveRelationshipConfig(config: RelationshipConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save config to localStorage', e);
  }
}
