import { GitHubRepository } from '../types/github';
import { Project } from '../types/portfolio';

export const GITHUB_USERNAME = 'anmolajnabee';
export const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;

const CACHE_KEY = `gh_repos_cache_v4_${GITHUB_USERNAME}`;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes cache

interface CachePayload {
  timestamp: number;
  repos: GitHubRepository[];
  rateLimitRemaining: number | null;
}

/**
 * Checks if a repository corresponds to the portfolio itself so it can be excluded.
 */
export function isPortfolioRepo(nameOrUrl?: string | null): boolean {
  if (!nameOrUrl) return false;
  const cleaned = nameOrUrl.toLowerCase().trim();
  return (
    cleaned === 'portfolio' ||
    cleaned === 'portfolio/' ||
    cleaned.endsWith('/portfolio') ||
    cleaned.endsWith('/portfolio.git') ||
    cleaned.includes('anmolajnabee/portfolio') ||
    cleaned === 'gh-1425165648'
  );
}

/**
 * Fetch public repositories from the GitHub REST API without requiring credentials.
 * Handles rate limits, network errors, and lightweight client caching.
 */
export async function fetchGitHubRepositories(forceRefresh = false): Promise<{
  repos: GitHubRepository[];
  rateLimitRemaining: number | null;
  fromCache: boolean;
}> {
  // Check client sessionStorage cache if not forcing refresh
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const payload: CachePayload = JSON.parse(cached);
        if (Date.now() - payload.timestamp < CACHE_TTL_MS) {
          return {
            repos: payload.repos.filter((r) => !isPortfolioRepo(r.name) && !isPortfolioRepo(r.html_url)),
            rateLimitRemaining: payload.rateLimitRemaining,
            fromCache: true,
          };
        }
      }
    } catch {
      // Ignore cache retrieval errors
    }
  }

  try {
    const res = await fetch(GITHUB_API_URL, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const rateLimitRemaining = res.headers.get('x-ratelimit-remaining')
      ? parseInt(res.headers.get('x-ratelimit-remaining') || '0', 10)
      : null;

    if (res.status === 403 || res.status === 429) {
      const resetHeader = res.headers.get('x-ratelimit-reset');
      let resetMsg = 'Please try again in a few minutes.';
      if (resetHeader) {
        const resetDate = new Date(parseInt(resetHeader, 10) * 1000);
        resetMsg = `Rate limit resets at ${resetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
      }
      throw new Error(`GitHub API rate limit exceeded for unauthenticated requests. ${resetMsg}`);
    }

    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error('Unexpected format received from GitHub API.');
    }

    const rawRepos = data as GitHubRepository[];
    // Strictly exclude the portfolio repository itself as requested
    const repos = rawRepos.filter(
      (r) => !isPortfolioRepo(r.name) && !isPortfolioRepo(r.html_url)
    );

    // Save to sessionStorage
    if (typeof window !== 'undefined') {
      try {
        const payload: CachePayload = {
          timestamp: Date.now(),
          repos,
          rateLimitRemaining,
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
      } catch {
        // Ignore storage quotas
      }
    }

    return {
      repos,
      rateLimitRemaining,
      fromCache: false,
    };
  } catch (err: any) {
    // If network fails, attempt to read any cached version
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const payload: CachePayload = JSON.parse(cached);
          return {
            repos: payload.repos,
            rateLimitRemaining: payload.rateLimitRemaining,
            fromCache: true,
          };
        }
      } catch {
        // Fall through
      }
    }
    throw new Error(err.message || 'Failed to fetch repositories from GitHub.');
  }
}

/**
 * Maps a GitHub repository into our portfolio Project model,
 * preserving any custom overrides configured in the admin dashboard.
 */
export function mapRepoToProject(
  repo: GitHubRepository,
  existing?: Partial<Project>,
  orderIndex: number = 0
): Project {
  // Check known candidate specifics for clean defaults
  const isCapacityConnect = repo.name.toLowerCase().includes('capacity-connect');
  const isFancyText = repo.name.toLowerCase().includes('fancytext');
  const isComplaintPortal = repo.name.toLowerCase().includes('complaint');

  // Human-readable title
  let defaultTitle = repo.name.replace(/[-_]+/g, ' ').trim();
  if (isComplaintPortal) {
    defaultTitle = 'Complaint Management Portal';
  } else if (isCapacityConnect) {
    defaultTitle = 'Capacity Connect Training Platform';
  } else if (isFancyText) {
    defaultTitle = 'FancyText';
  }

  // Description
  let defaultDescription =
    repo.description ||
    (isComplaintPortal
      ? 'JEC KUKAS Complaint Management Portal - Full-stack campus grievance lodging and tracking system.'
      : isFancyText
      ? 'Web text styling and formatting utility built with responsive web standards.'
      : 'Public software repository on GitHub.');

  // Demo URL validation
  let defaultDemoUrl = '';
  if (isComplaintPortal) {
    defaultDemoUrl = repo.homepage || 'https://complaint-management-portal.anmolkr.workers.dev/';
  } else if (isCapacityConnect) {
    defaultDemoUrl = repo.homepage || 'https://capacity-connect-training-platform.vercel.app';
  } else if (isFancyText) {
    defaultDemoUrl = repo.homepage || 'https://fancy-text-two.vercel.app';
  } else if (repo.homepage && repo.homepage.startsWith('http')) {
    defaultDemoUrl = repo.homepage;
  }

  // Technologies
  let techTags: string[] = [];
  if (isComplaintPortal) {
    techTags.push('TypeScript', 'React', 'Express', 'SQL', 'Tailwind CSS');
  } else {
    if (repo.language) {
      techTags.push(repo.language);
    }
    if (Array.isArray(repo.topics) && repo.topics.length > 0) {
      techTags.push(...repo.topics.map((t) => t.replace(/[-_]/g, ' ')));
    }
    if (isCapacityConnect && !techTags.includes('Reflex')) {
      techTags.push('Reflex');
    }
    if (isFancyText && !techTags.includes('JavaScript')) {
      techTags.push('JavaScript', 'CSS');
    }
  }
  if (techTags.length === 0) {
    techTags = ['Software Development'];
  }

  // De-duplicate tags
  const uniqueTech = Array.from(new Set(techTags)).slice(0, 5);

  const year = repo.updated_at
    ? new Date(repo.updated_at).getFullYear().toString()
    : new Date().getFullYear().toString();

  const defaultCategory = isComplaintPortal
    ? 'Full-Stack Web App'
    : isCapacityConnect
    ? 'Web & AI Platform'
    : 'Web Development';

  const defaultCoverStyle: 'neural' | 'network' | 'analytics' | 'terminal' | 'cyber' =
    isComplaintPortal
      ? 'analytics'
      : isCapacityConnect
      ? 'network'
      : isFancyText
      ? 'terminal'
      : 'neural';

  return {
    id: existing?.id || `gh-${repo.id || repo.name.toLowerCase()}`,
    title: existing?.title || defaultTitle,
    tagline: existing?.tagline || defaultDescription,
    description: existing?.description || defaultDescription,
    fullStory: existing?.fullStory || defaultDescription,
    category: existing?.category || defaultCategory,
    technologies: existing?.technologies && existing.technologies.length > 0 ? existing.technologies : uniqueTech,
    githubUrl: repo.html_url,
    demoUrl: existing?.demoUrl !== undefined ? existing.demoUrl : defaultDemoUrl,
    imageUrl: existing?.imageUrl || '',
    featured: existing?.featured !== undefined ? existing.featured : !repo.fork,
    published: existing?.published !== undefined ? existing.published : !repo.fork,
    date: existing?.date || year,
    order: existing?.order !== undefined ? existing.order : orderIndex,
    repoName: repo.name,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    isFork: repo.fork,
    language: repo.language || undefined,
    lastUpdated: repo.updated_at,
    coverStyle: existing?.coverStyle || defaultCoverStyle,
  };
}

/**
 * Fetches curated GitHub projects, attempting the server proxy first to bypass rate limits,
 * and falling back to direct GitHub API if needed. Strictly excludes portfolio repository.
 */
export async function fetchPortfolioProjects(forceRefresh = false): Promise<Project[]> {
  try {
    const res = await fetch(`/api/github-projects${forceRefresh ? '?refresh=true' : ''}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.projects) && json.projects.length > 0) {
        return json.projects.filter(
          (p: Project) =>
            !isPortfolioRepo(p.repoName) &&
            !isPortfolioRepo(p.title) &&
            !isPortfolioRepo(p.githubUrl) &&
            !isPortfolioRepo(p.id)
        );
      }
    }
  } catch {
    // Fall back to direct GitHub API
  }

  const { repos } = await fetchGitHubRepositories(forceRefresh);
  const mapped = repos
    .filter((r) => !isPortfolioRepo(r.name) && !isPortfolioRepo(r.html_url))
    .map((repo, idx) => mapRepoToProject(repo, undefined, idx));

  // Sort confirmed Newest first: Complaint Portal -> Capacity Connect -> FancyText
  mapped.sort((a, b) => {
    const aName = (a.repoName || a.title || '').toLowerCase();
    const bName = (b.repoName || b.title || '').toLowerCase();
    if (aName.includes('complaint')) return -1;
    if (bName.includes('complaint')) return 1;
    if (aName.includes('capacity')) return -1;
    if (bName.includes('capacity')) return 1;
    return 0;
  });

  mapped.forEach((p, index) => {
    p.order = index;
  });

  return mapped;
}
