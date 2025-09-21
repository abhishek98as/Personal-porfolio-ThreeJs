import ProjectCard3D from '../components/ProjectCard3D';
import { ProjectCardSkeleton, ProjectsErrorState } from '../components/ProjectSkeletons';
import { useGitHubProjects } from '../hooks/useGitHubProjects';

export default function Projects() {
  const { projects, loading, error, refetch } = useGitHubProjects(3);

  return (
    <div className="container mx-auto px-6">
      <div className="rounded-3xl panel-gradient p-8 ring-1 ring-[color:var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-gradient">My Projects</h2>
            <p className="mt-2 text-[color:var(--fg-secondary)]">
              Latest projects from my GitHub repositories. Click a project to expand.
            </p>
          </div>
          {!loading && !error && (
            <button
              onClick={refetch}
              className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-sm transition-colors"
              title="Refresh projects"
            >
              ↻ Refresh
            </button>
          )}
        </div>
        
        {error && (
          <ProjectsErrorState error={error} onRetry={refetch} />
        )}
        
        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="rounded-2xl card-gradient p-0">
                    <ProjectCardSkeleton />
                  </div>
                ))
              : projects.map((project) => (
                  <div key={project.title} className="rounded-2xl card-gradient p-0">
                    <ProjectCard3D {...project} />
                  </div>
                ))
            }
          </div>
        )}
        
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[color:var(--fg-secondary)]">No projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
