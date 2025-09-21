export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  testimonial: string;
  projectType: string;
  duration: string;
  technologies: string[];
  linkedin?: string;
  website?: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 'client-1',
    name: 'Sarah Johnson',
    role: 'CTO',
    company: 'TechFlow Solutions',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    rating: 5,
    testimonial: "Abhishek's Python backend development skills are exceptional. He delivered a scalable microservices architecture that handled our traffic growth seamlessly. His attention to performance optimization and clean code practices made our entire development process smoother.",
    projectType: 'E-commerce Backend',
    duration: '3 months',
    technologies: ['Python', 'Django', 'PostgreSQL', 'Redis', 'AWS'],
    linkedin: 'https://linkedin.com',
    website: 'https://techflow.com'
  },
  {
    id: 'client-2',
    name: 'Michael Chen',
    role: 'Product Manager',
    company: 'DataSync Analytics',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    rating: 5,
    testimonial: "Working with Abhishek was a game-changer for our data processing pipeline. His FastAPI implementation reduced our response times by 60% and his documentation was so thorough that our team could easily maintain the code. Highly recommended!",
    projectType: 'Data Analytics Platform',
    duration: '4 months',
    technologies: ['Python', 'FastAPI', 'MongoDB', 'Docker', 'Kubernetes'],
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'client-3',
    name: 'Emily Rodriguez',
    role: 'Lead Developer',
    company: 'InnovateLab',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    rating: 5,
    testimonial: "Abhishek delivered exactly what we needed - a robust REST API with comprehensive authentication and real-time features. His communication was excellent throughout the project, and he always met deadlines. The code quality exceeded our expectations.",
    projectType: 'SaaS Platform Backend',
    duration: '5 months',
    technologies: ['Python', 'Flask', 'PostgreSQL', 'WebSockets', 'JWT'],
    website: 'https://innovatelab.com'
  },
  {
    id: 'client-4',
    name: 'David Kim',
    role: 'Startup Founder',
    company: 'HealthTech Pro',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    rating: 4,
    testimonial: "As a non-technical founder, I appreciated Abhishek's ability to explain complex backend concepts in simple terms. He built our healthcare platform's backend with security and scalability in mind. The system has been running flawlessly for months.",
    projectType: 'Healthcare Platform',
    duration: '6 months',
    technologies: ['Python', 'Django', 'PostgreSQL', 'Celery', 'Redis'],
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'client-5',
    name: 'Lisa Thompson',
    role: 'Technical Lead',
    company: 'FinanceFlow',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    rating: 5,
    testimonial: "Abhishek's expertise in financial data processing is remarkable. He implemented complex algorithms for our trading platform while maintaining high security standards. His proactive approach to testing and monitoring gave us confidence in production deployment.",
    projectType: 'Financial Trading API',
    duration: '4 months',
    technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker']
  },
  {
    id: 'client-6',
    name: 'James Wilson',
    role: 'Engineering Manager',
    company: 'CloudTech Systems',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    rating: 5,
    testimonial: "The machine learning pipeline Abhishek built for us processes millions of records daily without any issues. His understanding of both Python development and DevOps practices helped us achieve seamless CI/CD integration. Outstanding work!",
    projectType: 'ML Data Pipeline',
    duration: '3 months',
    technologies: ['Python', 'Flask', 'MongoDB', 'AWS', 'Docker'],
    website: 'https://cloudtech.com'
  }
];

// Helper function to get random testimonials
export function getRandomTestimonials(count: number = 3): Testimonial[] {
  const shuffled = [...testimonialsData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Helper function to get testimonials by rating
export function getTestimonialsByRating(minRating: number = 4): Testimonial[] {
  return testimonialsData.filter(testimonial => testimonial.rating >= minRating);
}