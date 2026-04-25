export interface Creator {
  id: string;
  walletAddress: string;
  username: string;
  avatarUrl: string;
  bio: string;
  bagsProjectId: string;
  token: CreatorToken;
  memeCount: number;
  joinedAt: string;
}

export interface CreatorToken {
  symbol: string;
  name: string;
  price: number;        // in SOL
  priceChange24h: number; // percent
  holders: number;
  totalVolume: number;  // SOL
  marketCap: number;    // SOL
  spiking: boolean;     // true when buy volume spikes
}

export interface Meme {
  id: string;
  creatorId: string;
  imageUrl: string;
  title: string;
  description: string;
  tags: string[];
  votes: number;
  comments: Comment[];
  isNFT: boolean;
  nftPrice?: number;  // SOL
  mintAddress?: string;
  postedAt: string;
  isMemeOfDay: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  authorUsername: string;
  authorAvatar: string;
  body: string;
  postedAt: string;
  tokenRequired?: string; // creator token symbol
}

export type BagsEvent =
  | { type: "project_created"; projectId: string }
  | { type: "token_created"; symbol: string; projectId: string }
  | { type: "token_purchased"; symbol: string; tokenAmount: number; sol: number }
  | { type: "token_sold"; symbol: string; tokenAmount: number; sol: number };

export type Tab = "today" | "week" | "all";
