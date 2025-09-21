export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
}

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

class GitHubService {
  private readonly baseURL = 'https://api.github.com';
  private readonly username: string;
  private readonly token?: string;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.username = import.meta.env.VITE_GITHUB_USERNAME || 'abhishek98as';
    this.token = import.meta.env.VITE_GITHUB_TOKEN;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App'
    };

    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }

    return headers;
  }

  private isValidCache(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  private async fetchWithCache<T>(url: string, key: string): Promise<T> {
    if (this.isValidCache(key)) {
      return this.cache.get(key)!.data;
    }

    try {
      const response = await fetch(url, { 
        headers: this.getHeaders(),
        // Add timeout
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new GitHubApiError(
          `GitHub API error: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      this.cache.set(key, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      if (error instanceof GitHubApiError) {
        throw error;
      }
      throw new GitHubApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        0
      );
    }
  }

  async getRepositories(options: {
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    per_page?: number;
    type?: 'owner' | 'public' | 'member';
  } = {}): Promise<GitHubRepository[]> {
    const params = new URLSearchParams({
      sort: options.sort || 'updated',
      direction: options.direction || 'desc',
      per_page: String(options.per_page || 100),
      type: options.type || 'owner'
    });

    const url = `${this.baseURL}/users/${this.username}/repos?${params}`;
    const cacheKey = `repos_${this.username}_${params.toString()}`;

    return this.fetchWithCache<GitHubRepository[]>(url, cacheKey);
  }

  async getLatestProjects(count: number = 3): Promise<GitHubRepository[]> {
    try {
      const repos = await this.getRepositories({
        sort: 'updated',
        direction: 'desc',
        per_page: 50 // Get more to filter from
      });

      // Filter out forks and repos without descriptions, then take the latest
      const filteredRepos = repos
        .filter(repo => 
          !repo.full_name.includes('fork') && // Basic fork detection
          repo.description && 
          repo.description.trim().length > 0 &&
          !repo.name.toLowerCase().includes('config') && // Skip config repos
          !repo.name.toLowerCase().includes('dotfiles') // Skip dotfiles
        )
        .slice(0, count);

      return filteredRepos;
    } catch (error) {
      console.error('Error fetching latest projects:', error);
      throw error;
    }
  }

  async getRepository(repoName: string): Promise<GitHubRepository> {
    const url = `${this.baseURL}/repos/${this.username}/${repoName}`;
    const cacheKey = `repo_${this.username}_${repoName}`;

    return this.fetchWithCache<GitHubRepository>(url, cacheKey);
  }

  // Clear cache manually if needed
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache status for debugging
  getCacheInfo(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Create singleton instance
export const githubService = new GitHubService();

// Helper function to format repository data for ProjectCard3D
export function formatRepoForProject(repo: GitHubRepository): {
  title: string;
  description: string;
  url: string;
  language?: string;
  stars?: number;
  lastUpdated?: string;
} {
  return {
    title: repo.name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    description: repo.description || 'No description available',
    url: repo.homepage || repo.html_url,
    language: repo.language || undefined,
    stars: repo.stargazers_count,
    lastUpdated: new Date(repo.updated_at).toLocaleDateString()
  };
}