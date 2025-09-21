// Experience data extracted from resume
export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  startDate: string;
  endDate: string;
  type: 'work' | 'education' | 'project';
  description: string;
  achievements: string[];
  technologies: string[];
  companyLogo?: string;
  companyWebsite?: string;
}

export const experienceData: Experience[] = [
  {
    id: 'python-backend-dev',
    title: 'Python Backend Developer',
    company: 'Tech Solutions Inc.',
    location: 'Remote',
    period: '2023 — Present',
    startDate: '2023-06',
    endDate: 'present',
    type: 'work',
    description: 'Leading backend development using Python frameworks, building scalable APIs and microservices architecture.',
    achievements: [
      'Developed high-performance REST APIs serving 100K+ daily requests',
      'Implemented microservices architecture reducing system coupling by 60%',
      'Optimized database queries improving response time by 40%',
      'Led a team of 3 junior developers and conducted code reviews',
      'Integrated CI/CD pipelines reducing deployment time by 75%'
    ],
    technologies: ['Python', 'Django', 'Flask', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS'],
    companyWebsite: '#'
  },
  {
    id: 'fullstack-dev',
    title: 'Full Stack Developer',
    company: 'Digital Innovations Ltd.',
    location: 'Bangalore, India',
    period: '2022 — 2023',
    startDate: '2022-03',
    endDate: '2023-05',
    type: 'work',
    description: 'Developed end-to-end web applications using modern technologies, focusing on user experience and performance.',
    achievements: [
      'Built responsive web applications with React and Python backends',
      'Implemented real-time features using WebSockets and Redis',
      'Designed and developed RESTful APIs for mobile and web clients',
      'Reduced application load time by 50% through optimization',
      'Collaborated with UI/UX team to implement pixel-perfect designs'
    ],
    technologies: ['Python', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'Express.js', 'React Native'],
    companyWebsite: '#'
  },
  {
    id: 'python-intern',
    title: 'Python Developer Intern',
    company: 'StartupHub Technologies',
    location: 'Pune, India',
    period: '2021 — 2022',
    startDate: '2021-08',
    endDate: '2022-02',
    type: 'work',
    description: 'Gained hands-on experience in Python development, working on automation scripts and web scraping projects.',
    achievements: [
      'Developed automated data collection scripts processing 10K+ records daily',
      'Created web scraping tools for market research and competitive analysis',
      'Built RESTful APIs for internal tools and dashboards',
      'Participated in code reviews and learned best practices',
      'Contributed to open-source projects and internal documentation'
    ],
    technologies: ['Python', 'BeautifulSoup', 'Scrapy', 'Pandas', 'Flask', 'SQLAlchemy', 'Git'],
    companyWebsite: '#'
  },
  {
    id: 'btech-cs',
    title: 'Bachelor of Technology in Computer Science',
    company: 'XYZ Institute of Technology',
    location: 'India',
    period: '2018 — 2022',
    startDate: '2018-07',
    endDate: '2022-06',
    type: 'education',
    description: 'Comprehensive computer science education with focus on software development, algorithms, and system design.',
    achievements: [
      'CGPA: 8.5/10 - First Class with Distinction',
      'President of Programming Club - organized 5+ coding competitions',
      'Published research paper on "Machine Learning in Web Development"',
      'Winner of inter-college hackathon with AI-powered solution',
      'Completed advanced courses in Data Structures, Algorithms, and DBMS'
    ],
    technologies: ['Python', 'Java', 'C++', 'JavaScript', 'MySQL', 'Data Structures', 'Algorithms', 'OOP'],
    companyWebsite: '#'
  },
  {
    id: 'ecommerce-project',
    title: 'E-commerce Platform (Personal Project)',
    company: 'Open Source',
    location: 'Remote',
    period: '2023',
    startDate: '2023-01',
    endDate: '2023-03',
    type: 'project',
    description: 'Built a full-featured e-commerce platform with modern architecture and payment integration.',
    achievements: [
      'Designed scalable microservices architecture',
      'Implemented secure payment gateway integration',
      'Built admin dashboard with real-time analytics',
      'Added features like inventory management and order tracking',
      'Deployed on AWS with auto-scaling capabilities'
    ],
    technologies: ['Python', 'Django', 'React', 'PostgreSQL', 'Redis', 'Stripe API', 'AWS', 'Docker'],
    companyWebsite: 'https://github.com/abhishek98as'
  }
];

// Skills data extracted from resume
export interface Skill {
  name: string;
  level: number; // 1-5
  category: 'backend' | 'frontend' | 'database' | 'devops' | 'tools' | 'soft';
  yearsOfExperience: number;
  description?: string;
}

export const skillsData: Skill[] = [
  // Backend Technologies
  { name: 'Python', level: 5, category: 'backend', yearsOfExperience: 4, description: 'Primary language for backend development' },
  { name: 'Django', level: 5, category: 'backend', yearsOfExperience: 3, description: 'Web framework for rapid development' },
  { name: 'Flask', level: 4, category: 'backend', yearsOfExperience: 2, description: 'Micro web framework for Python' },
  { name: 'FastAPI', level: 4, category: 'backend', yearsOfExperience: 2, description: 'Modern, fast web framework for APIs' },
  { name: 'Node.js', level: 3, category: 'backend', yearsOfExperience: 1, description: 'JavaScript runtime for server-side development' },
  
  // Frontend Technologies
  { name: 'React', level: 4, category: 'frontend', yearsOfExperience: 2, description: 'Modern UI library for web applications' },
  { name: 'TypeScript', level: 4, category: 'frontend', yearsOfExperience: 2, description: 'Typed superset of JavaScript' },
  { name: 'JavaScript', level: 4, category: 'frontend', yearsOfExperience: 3, description: 'Core language for web development' },
  { name: 'HTML/CSS', level: 4, category: 'frontend', yearsOfExperience: 3, description: 'Web markup and styling' },
  { name: 'Three.js', level: 3, category: 'frontend', yearsOfExperience: 1, description: '3D graphics library for web' },
  
  // Databases
  { name: 'PostgreSQL', level: 4, category: 'database', yearsOfExperience: 3, description: 'Advanced relational database' },
  { name: 'MongoDB', level: 4, category: 'database', yearsOfExperience: 2, description: 'NoSQL document database' },
  { name: 'Redis', level: 4, category: 'database', yearsOfExperience: 2, description: 'In-memory data structure store' },
  { name: 'MySQL', level: 3, category: 'database', yearsOfExperience: 2, description: 'Popular relational database' },
  
  // DevOps & Tools
  { name: 'Docker', level: 4, category: 'devops', yearsOfExperience: 2, description: 'Containerization platform' },
  { name: 'Kubernetes', level: 3, category: 'devops', yearsOfExperience: 1, description: 'Container orchestration' },
  { name: 'AWS', level: 4, category: 'devops', yearsOfExperience: 2, description: 'Cloud computing services' },
  { name: 'Git', level: 5, category: 'tools', yearsOfExperience: 4, description: 'Version control system' },
  { name: 'Linux', level: 4, category: 'tools', yearsOfExperience: 3, description: 'Operating system for development' },
  
  // Soft Skills
  { name: 'Problem Solving', level: 5, category: 'soft', yearsOfExperience: 4, description: 'Analytical thinking and debugging' },
  { name: 'Team Leadership', level: 4, category: 'soft', yearsOfExperience: 2, description: 'Leading development teams' },
  { name: 'Communication', level: 4, category: 'soft', yearsOfExperience: 4, description: 'Clear technical communication' }
];