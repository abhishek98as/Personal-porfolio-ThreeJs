export interface WorkExperience {
  id: number;
  name: string;
  position: string;
  duration: string;
  description: string;
  icon: string;
  skills: string[];
  achievements: string[];
  location: string;
  type: 'remote' | 'hybrid' | 'onsite';
}

export const workExperiences: WorkExperience[] = [
  {
    id: 1,
    name: 'Senior Python Developer',
    position: 'Backend Specialist',
    duration: '2022 - Present',
    description: 'Leading backend development for scalable web applications using Python, Django, and FastAPI. Working remotely across multiple timezones with international clients.',
    icon: '🐍',
    skills: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
    achievements: [
      'Built APIs serving 1M+ requests/day',
      'Reduced server response time by 60%',
      'Led team of 5 developers remotely',
      'Implemented CI/CD pipelines'
    ],
    location: 'Remote (Global)',
    type: 'remote'
  },
  {
    id: 2,
    name: 'Full Stack Developer',
    position: 'Web Development',
    duration: '2020 - 2022',
    description: 'Developed end-to-end web applications with React frontend and Python backend. Specialized in creating responsive, user-friendly interfaces and robust API systems.',
    icon: '⚛️',
    skills: ['React', 'TypeScript', 'Python', 'Flask', 'MongoDB', 'TailwindCSS'],
    achievements: [
      'Delivered 15+ client projects',
      'Improved user engagement by 45%',
      'Established remote work protocols',
      'Mentored junior developers'
    ],
    location: 'Remote/Hybrid',
    type: 'hybrid'
  },
  {
    id: 3,
    name: 'Python Backend Developer',
    position: 'API Development',
    duration: '2018 - 2020',
    description: 'Focused on building robust REST APIs and microservices architecture. Gained expertise in database optimization and cloud deployment strategies.',
    icon: '🚀',
    skills: ['Python', 'Flask', 'SQLAlchemy', 'MySQL', 'Git', 'Linux'],
    achievements: [
      'Built 20+ REST APIs',
      'Optimized database queries by 70%',
      'Implemented automated testing',
      'Designed microservices architecture'
    ],
    location: 'On-site/Remote',
    type: 'hybrid'
  }
];

export const codingPassion = {
  title: 'My Passion for Coding',
  subtitle: 'Turning Ideas into Reality Through Code',
  description: 'Coding is more than just a profession for me—it\'s a passion that drives me to constantly learn, innovate, and create solutions that make a real impact. Every line of code is an opportunity to solve problems and build something meaningful.',
  stats: [
    { label: 'Years of Experience', value: '6+', icon: '📅' },
    { label: 'Projects Delivered', value: '50+', icon: '🚀' },
    { label: 'Lines of Code', value: '100K+', icon: '💻' },
    { label: 'Happy Clients', value: '25+', icon: '😊' }
  ],
  values: [
    {
      title: 'Clean Code',
      description: 'Writing maintainable, readable code that stands the test of time',
      icon: '✨'
    },
    {
      title: 'Continuous Learning',
      description: 'Always staying updated with the latest technologies and best practices',
      icon: '📚'
    },
    {
      title: 'Problem Solving',
      description: 'Breaking down complex challenges into simple, elegant solutions',
      icon: '🧩'
    },
    {
      title: 'Remote Collaboration',
      description: 'Building strong partnerships across timezones and cultures',
      icon: '🌍'
    }
  ]
};

export const remoteWorkInfo = {
  title: 'Working Remotely Across Timezones',
  description: 'I specialize in remote collaboration, having successfully worked with clients from different continents. My flexible schedule and strong communication skills ensure seamless project delivery regardless of geographical boundaries.',
  timezones: [
    { region: 'North America', time: 'EST/PST', availability: '9 AM - 6 PM', icon: '🇺🇸' },
    { region: 'Europe', time: 'CET/GMT', availability: '2 PM - 11 PM', icon: '🇪🇺' },
    { region: 'Asia Pacific', time: 'JST/AEST', availability: '10 PM - 7 AM', icon: '🇯🇵' },
    { region: 'Local Time', time: 'IST', availability: '24/7 Support', icon: '🇮🇳' }
  ],
  benefits: [
    'Flexible working hours to match your timezone',
    'Regular communication through video calls and messages',
    'Agile development with frequent updates and demos',
    'Cultural diversity bringing fresh perspectives to projects'
  ]
};