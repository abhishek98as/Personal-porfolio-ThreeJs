export interface StaticProject {
  title: string;
  description: string;
  url: string;
  language?: string;
  stars?: number;
  lastUpdated?: string;
  technologies: string[];
  category: 'web' | 'api' | 'automation' | 'data' | 'mobile';
  featured: boolean;
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export const staticProjects: StaticProject[] = [
  {
    title: 'E-Commerce Backend API',
    description: 'Scalable REST API for e-commerce platform with payment integration, inventory management, and order processing. Built with FastAPI and PostgreSQL.',
    url: 'https://github.com/abhishek98as',
    language: 'Python',
    stars: 24,
    lastUpdated: '2024-09-15',
    technologies: ['FastAPI', 'PostgreSQL', 'Redis', 'Stripe API', 'Docker', 'JWT'],
    category: 'api',
    featured: true,
    image: '/project-1-BpwuCuTC.png',
    githubUrl: 'https://github.com/abhishek98as',
    liveUrl: 'https://api-demo.yoursite.com'
  },
  {
    title: 'Real-Time Chat Application',
    description: 'WebSocket-based chat application with rooms, file sharing, and message encryption. Supports real-time messaging for teams and communities.',
    url: 'https://github.com/abhishek98as',
    language: 'Python',
    stars: 18,
    lastUpdated: '2024-09-10',
    technologies: ['Django', 'WebSockets', 'React', 'PostgreSQL', 'Redis', 'Celery'],
    category: 'web',
    featured: true,
    image: '/project-2-Gj5Kyzup.png',
    githubUrl: 'https://github.com/abhishek98as',
    liveUrl: 'https://chat-demo.yoursite.com'
  },
  {
    title: 'Data Analytics Dashboard',
    description: 'Interactive dashboard for data visualization and analytics. Processes large datasets and provides real-time insights with beautiful charts.',
    url: 'https://github.com/abhishek98as',
    language: 'Python',
    stars: 31,
    lastUpdated: '2024-09-08',
    technologies: ['Flask', 'Pandas', 'Plotly', 'MongoDB', 'D3.js', 'Docker'],
    category: 'data',
    featured: true,
    image: '/project-3-oqlSpsY1.png',
    githubUrl: 'https://github.com/abhishek98as',
    liveUrl: 'https://analytics-demo.yoursite.com'
  },
  {
    title: 'Automated Task Manager',
    description: 'Python-based automation tool for scheduling and managing recurring tasks. Features web interface, email notifications, and robust error handling.',
    url: 'https://github.com/abhishek98as',
    language: 'Python',
    stars: 15,
    lastUpdated: '2024-09-05',
    technologies: ['Python', 'Flask', 'SQLAlchemy', 'Celery', 'Bootstrap', 'SQLite'],
    category: 'automation',
    featured: false,
    githubUrl: 'https://github.com/abhishek98as'
  },
  {
    title: 'API Gateway Service',
    description: 'Microservices API gateway with rate limiting, authentication, and request routing. Built for scalable distributed systems.',
    url: 'https://github.com/abhishek98as',
    language: 'Python',
    stars: 22,
    lastUpdated: '2024-08-28',
    technologies: ['FastAPI', 'Redis', 'Docker', 'Kubernetes', 'JWT', 'OpenAPI'],
    category: 'api',
    featured: false,
    githubUrl: 'https://github.com/abhishek98as'
  },
  {
    title: 'Machine Learning Pipeline',
    description: 'End-to-end ML pipeline for data preprocessing, model training, and prediction serving. Includes model versioning and monitoring.',
    url: 'https://github.com/abhishek98as',
    language: 'Python',
    stars: 28,
    lastUpdated: '2024-08-20',
    technologies: ['Python', 'Scikit-learn', 'MLflow', 'Docker', 'FastAPI', 'Pandas'],
    category: 'data',
    featured: false,
    githubUrl: 'https://github.com/abhishek98as'
  },
  {
    title: 'Restaurant Management System',
    description: 'Complete restaurant management solution with order tracking, inventory management, and POS integration. Multi-location support.',
    url: 'https://github.com/abhishek98as',
    language: 'Python',
    stars: 19,
    lastUpdated: '2024-08-15',
    technologies: ['Django', 'PostgreSQL', 'React', 'Stripe', 'AWS S3', 'Docker'],
    category: 'web',
    featured: false,
    githubUrl: 'https://github.com/abhishek98as'
  },
  {
    title: 'Cryptocurrency Tracker',
    description: 'Real-time cryptocurrency price tracking with portfolio management, alerts, and historical data analysis.',
    url: 'https://github.com/abhishek98as',
    language: 'Python',
    stars: 33,
    lastUpdated: '2024-08-10',
    technologies: ['FastAPI', 'WebSockets', 'React', 'MongoDB', 'CoinGecko API', 'Charts.js'],
    category: 'web',
    featured: false,
    githubUrl: 'https://github.com/abhishek98as'
  },
  {
    title: 'File Upload Service',
    description: 'Secure file upload and storage service with virus scanning, image optimization, and CDN integration. Supports multiple cloud providers.',
    url: 'https://github.com/abhishek98as',
    language: 'Python',
    stars: 16,
    lastUpdated: '2024-07-30',
    technologies: ['FastAPI', 'AWS S3', 'Cloudinary', 'PostgreSQL', 'Redis', 'Docker'],
    category: 'api',
    featured: false,
    githubUrl: 'https://github.com/abhishek98as'
  },
  {
    title: 'Social Media Scraper',
    description: 'Ethical social media data collection tool with respect for rate limits and terms of service. Includes data analysis features.',
    url: 'https://github.com/abhishek98as',
    language: 'Python',
    stars: 25,
    lastUpdated: '2024-07-25',
    technologies: ['Python', 'Scrapy', 'BeautifulSoup', 'MongoDB', 'Pandas', 'Jupyter'],
    category: 'automation',
    featured: false,
    githubUrl: 'https://github.com/abhishek98as'
  }
];

// Helper functions
export function getFeaturedProjects(): StaticProject[] {
  return staticProjects.filter(project => project.featured);
}

export function getProjectsByCategory(category: StaticProject['category']): StaticProject[] {
  return staticProjects.filter(project => project.category === category);
}

export function getLatestProjects(count: number = 3): StaticProject[] {
  return staticProjects
    .sort((a, b) => new Date(b.lastUpdated || '').getTime() - new Date(a.lastUpdated || '').getTime())
    .slice(0, count);
}

export function getAllProjects(): StaticProject[] {
  return staticProjects;
}

// Convert static project to the format expected by ProjectCard3D
export function formatStaticProject(project: StaticProject): {
  title: string;
  description: string;
  url: string;
  language?: string;
  stars?: number;
  lastUpdated?: string;
  technologies?: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
} {
  return {
    title: project.title,
    description: project.description,
    url: project.liveUrl || project.githubUrl || project.url,
    language: project.language,
    stars: project.stars,
    lastUpdated: project.lastUpdated,
    technologies: project.technologies,
    image: project.image,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl
  };
}