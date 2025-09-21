import { useState } from 'react';
import { Testimonial } from '../data/testimonialsData';

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive?: boolean;
  className?: string;
}

export function TestimonialCard({ testimonial, isActive = false, className = '' }: TestimonialCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const shouldTruncate = testimonial.testimonial.length > 150;
  const displayText = !isExpanded && shouldTruncate 
    ? testimonial.testimonial.slice(0, 150) + '...' 
    : testimonial.testimonial;

  return (
    <div 
      className={`group relative transition-all duration-500 ${
        isActive ? 'scale-[1.02] z-10' : 'hover:scale-[1.01]'
      } ${className}`}
    >
      <div className={`rounded-2xl card-gradient p-[1px] ${
        isActive ? 'ring-2 ring-cyan-400/50' : ''
      }`}>
        <div className="rounded-[15px] bg-white/5 dark:bg-black/40 backdrop-blur-md p-6 h-full relative overflow-hidden">
          {/* Decorative quote mark */}
          <div className="absolute top-4 right-4 text-4xl text-cyan-400/20 font-serif">
            "
          </div>

          {/* Header with avatar and info */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10">
                {!imageError ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gradient-2 text-sm truncate">
                {testimonial.name}
              </h3>
              <p className="text-xs text-white/70 truncate">
                {testimonial.role} at {testimonial.company}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {renderStars(testimonial.rating)}
              </div>
            </div>
          </div>

          {/* Project info badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {testimonial.projectType}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
              {testimonial.duration}
            </span>
          </div>

          {/* Testimonial text */}
          <blockquote className="text-white/90 text-sm leading-relaxed mb-4 relative">
            <p className="italic">
              {displayText}
            </p>
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-cyan-300 hover:text-cyan-200 text-xs mt-2 underline"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </blockquote>

          {/* Technologies */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {testimonial.technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/80 border border-white/10"
                >
                  {tech}
                </span>
              ))}
              {testimonial.technologies.length > 3 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-white/60">
                  +{testimonial.technologies.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Footer with links */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              {testimonial.linkedin && (
                <a
                  href={testimonial.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md bg-white/10 hover:bg-blue-500/20 text-white/70 hover:text-blue-300 transition-colors"
                  title="LinkedIn Profile"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
                  </svg>
                </a>
              )}
              {testimonial.website && (
                <a
                  href={testimonial.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md bg-white/10 hover:bg-cyan-500/20 text-white/70 hover:text-cyan-300 transition-colors"
                  title="Company Website"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
            <div className="text-xs text-white/50">
              Verified Client
            </div>
          </div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-transparent to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[15px] pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}

// Testimonial summary card for overview stats
export function TestimonialSummary({ testimonials }: { testimonials: Testimonial[] }) {
  const averageRating = testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length;
  const totalProjects = testimonials.length;
  const uniqueCompanies = new Set(testimonials.map(t => t.company)).size;
  const allTechnologies = testimonials.flatMap(t => t.technologies);
  const uniqueTechnologies = new Set(allTechnologies).size;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="text-center p-4 rounded-xl bg-white/5 dark:bg-black/20 border border-white/10">
        <div className="flex items-center justify-center gap-1 mb-1">
          <span className="text-2xl font-bold text-gradient">{averageRating.toFixed(1)}</span>
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div className="text-xs text-white/70">Average Rating</div>
      </div>
      <div className="text-center p-4 rounded-xl bg-white/5 dark:bg-black/20 border border-white/10">
        <div className="text-2xl font-bold text-gradient-2">{totalProjects}</div>
        <div className="text-xs text-white/70">Happy Clients</div>
      </div>
      <div className="text-center p-4 rounded-xl bg-white/5 dark:bg-black/20 border border-white/10">
        <div className="text-2xl font-bold text-gradient">{uniqueCompanies}</div>
        <div className="text-xs text-white/70">Companies</div>
      </div>
      <div className="text-center p-4 rounded-xl bg-white/5 dark:bg-black/20 border border-white/10">
        <div className="text-2xl font-bold text-gradient-2">{uniqueTechnologies}</div>
        <div className="text-xs text-white/70">Technologies</div>
      </div>
    </div>
  );
}