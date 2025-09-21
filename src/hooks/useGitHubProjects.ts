import { useState, useEffect } from 'react';
import { githubService, GitHubRepository, formatRepoForProject, GitHubApiError } from '../services/github';

interface UseGitHubProjectsResult {
  projects: ReturnType<typeof formatRepoForProject>[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useGitHubProjects(count: number = 3): UseGitHubProjectsResult {
  const [projects, setProjects] = useState<ReturnType<typeof formatRepoForProject>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const repos = await githubService.getLatestProjects(count);
      const formattedProjects = repos.map(formatRepoForProject);
      
      setProjects(formattedProjects);
    } catch (err) {
      console.error('Failed to fetch GitHub projects:', err);
      
      if (err instanceof GitHubApiError) {
        if (err.status === 403) {
          setError('GitHub API rate limit exceeded. Please try again later.');
        } else if (err.status === 404) {
          setError('GitHub user not found. Please check the configuration.');
        } else {
          setError(`GitHub API error: ${err.message}`);
        }
      } else {
        setError('Failed to load projects. Please check your internet connection.');
      }
      
      // Fallback to demo projects on error
      setProjects([
        {
          title: 'WebXR Playground',
          description: 'Experimental XR interactions with r3f and WebXR.',
          url: '#'
        },
        {
          title: 'Shader Garden',
          description: 'GLSL experiments with post-processing and noise fields.',
          url: '#'
        },
        {
          title: 'Data Dioramas',
          description: '3D data viz dioramas powered by Drei and D3.',
          url: '#'
        }
      ]);
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
    refetch: fetchProjects
  };
}