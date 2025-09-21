type Item = { image: string; title: string; description: string; link: string };

const PROJECTS: Item[] = [
  { 
    image: '/project-1-BpwuCuTC.png', 
    title: 'E-Commerce Platform', 
    description: 'Full-stack e-commerce solution with Python backend, payment integration, and admin dashboard.', 
    link: 'https://github.com/abhishek98as' 
  },
  { 
    image: '/project-2-Gj5Kyzup.png', 
    title: 'Data Analytics API', 
    description: 'RESTful API for data processing and analytics with FastAPI, PostgreSQL, and real-time dashboards.', 
    link: 'https://github.com/abhishek98as' 
  },
  { 
    image: '/project-3-oqlSpsY1.png', 
    title: 'Task Management System', 
    description: 'Collaborative task management platform with real-time updates, notifications, and team features.', 
    link: 'https://github.com/abhishek98as' 
  },
];

function Card({ item }: { item: Item }) {
  return (
    <a 
      href={item.link} 
      className="group flex-1 min-w-[260px] rounded-2xl border border-border bg-bg-card backdrop-blur-md p-6 hover:border-border-hover hover:bg-bg-glass transition-all duration-300 shadow-theme-sm hover:shadow-theme-md hover:scale-105"
    >
      <div className="relative overflow-hidden rounded-xl">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-overlay/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <h4 className="mt-4 text-lg font-semibold text-fg group-hover:text-accent-primary transition-colors duration-300">{item.title}</h4>
      <p className="text-fg-secondary text-sm mt-2 line-clamp-2">{item.description}</p>
      <div className="mt-4 flex items-center text-accent-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
        <span className="text-sm font-medium">View Project</span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </a>
  );
}

export default function SpaceProjects() {
  return (
    <section id="space-projects" className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-bg to-bg-secondary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent-primary rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent-secondary rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <h3 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-primary py-8 text-center">My Projects</h3>
        
        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {PROJECTS.map((p) => (
            <Card key={p.title} item={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
