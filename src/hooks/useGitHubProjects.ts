import { useState, useEffect } from 'react';
import { githubService, GitHubRepository, formatRepoForProject, GitHubApiError } from '../services/github';
import { getLatestProjects, formatStaticProject } from '../data/staticProjects';

interface UseGitHubProjectsResult {
  projects: ReturnType<typeof formatRepoForProject>[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  usingFallback: boolean;
}

export function useGitHubProjects(count: number = 3): UseGitHubProjectsResult {
  const [projects, setProjects] = useState<ReturnType<typeof formatRepoForProject>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const loadStaticProjects = () => {
    const staticProjects = getLatestProjects(count);
    const formattedProjects = staticProjects.map(formatStaticProject);
    setProjects(formattedProjects);
    setUsingFallback(true);
    setError(null);
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we have a GitHub token configured
      const hasToken = import.meta.env.VITE_GITHUB_TOKEN;
      
      // If no token, immediately use static data
      if (!hasToken) {
        console.log('No GitHub token configured, using static project data');
        loadStaticProjects();
        setLoading(false);
        return;
      }
      
      const repos = await githubService.getLatestProjects(count);
      const formattedProjects = repos.map(formatRepoForProject);
      
      setProjects(formattedProjects);
      setUsingFallback(false);
    } catch (err) {
      console.warn('GitHub API failed, falling back to static data:', err);
      
      // Always fallback to static data on any error
      loadStaticProjects();
      
      // Still set error message for user feedback
      if (err instanceof GitHubApiError) {
        if (err.status === 403) {
          setError('Using local project data (GitHub API rate limit)');
        } else if (err.status === 404) {
          setError('Using local project data (GitHub user not found)');
        } else {
          setError(`Using local project data (GitHub API: ${err.message})`);
        }
      } else {
        setError('Using local project data (Connection issue)');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [count]);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    usingFallback
  };
}