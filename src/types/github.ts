export interface GitHubRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  topics: string[];
  default_branch: string;
}

export interface GitHubSyncState {
  username: string;
  lastSyncedAt: string | null;
  totalReposCount: number;
  rateLimitRemaining: number | null;
  rateLimitReset: number | null;
}
