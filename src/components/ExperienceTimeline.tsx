import { useState } from 'react';
import { Experience } from '../data/resumeData';

interface ExperienceCardProps {
  experience: Experience;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

function ExperienceCard({ experience, index, isActive, onClick }: ExperienceCardProps) {
  const typeColors = {
    work: 'from-blue-500/20 to-cyan-500/20',
    education: 'from-green-500/20 to-emerald-500/20',
    project: 'from-purple-500/20 to-pink-500/20'
  };

  const typeIcons = {
    work: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6.001" />
      </svg>
    ),
    education: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    project: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  };

  return (
    <div
      className={`relative cursor-pointer transition-all duration-500 ${
        isActive ? 'scale-[1.02] z-10' : 'hover:scale-[1.01]'
      }`}
      onClick={onClick}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`rounded-2xl card-gradient p-[1px] ${isActive ? 'ring-2 ring-cyan-400/50' : ''}`}>
        <div className={`rounded-[15px] bg-gradient-to-br ${typeColors[experience.type]} backdrop-blur-sm p-6 h-full`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white/10 text-white`}>
                {typeIcons[experience.type]}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gradient-2">{experience.title}</h3>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span className="font-medium">{experience.company}</span>
                  {experience.location && (
                    <>
                      <span className="text-white/40">•</span>
                      <span>{experience.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-cyan-300">{experience.period}</div>
              <div className="text-xs text-white/60 capitalize">{experience.type}</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/80 text-sm mb-4 leading-relaxed">
            {experience.description}
          </p>

          {/* Technologies */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {experience.technologies.slice(0, isActive ? undefined : 6).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/90 border border-white/10"
                >
                  {tech}
                </span>
              ))}
              {!isActive && experience.technologies.length > 6 && (
                <span className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/60">
                  +{experience.technologies.length - 6}
                </span>
              )}
            </div>
          </div>

          {/* Achievements - Only show when active */}
          {isActive && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <h4 className="text-sm font-semibold text-white/90 mb-2">Key Achievements:</h4>
              <ul className="space-y-1">
                {experience.achievements.slice(0, 3).map((achievement, i) => (
                  <li key={i} className="text-xs text-white/80 flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
              {experience.achievements.length > 3 && (
                <div className="text-xs text-white/60 mt-2">
                  +{experience.achievements.length - 3} more achievements
                </div>
              )}
            </div>
          )}

          {/* Expand indicator */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
            <div className="text-xs text-white/60">
              Click to {isActive ? 'collapse' : 'expand'}
            </div>
            <div className={`transform transition-transform ${isActive ? 'rotate-180' : ''}`}>
              <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TimelineConnectorProps {
  isLast: boolean;
}

function TimelineConnector({ isLast }: TimelineConnectorProps) {
  if (isLast) return null;
  
  return (
    <div className="flex justify-center py-4">
      <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-400/50 to-purple-400/50 rounded-full" />
    </div>
  );
}

interface ExperienceTimelineProps {
  experiences: Experience[];
  onDownloadResume?: () => void;
}

export default function ExperienceTimeline({ experiences, onDownloadResume }: ExperienceTimelineProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-gradient">4+</div>
          <div className="text-sm text-white/70">Years Experience</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-gradient-2">20+</div>
          <div className="text-sm text-white/70">Technologies</div>
        </div>
        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-gradient">15+</div>
          <div className="text-sm text-white/70">Projects Delivered</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {experiences.map((experience, index) => (
          <div key={experience.id}>
            <ExperienceCard
              experience={experience}
              index={index}
              isActive={activeIndex === index}
              onClick={() => handleCardClick(index)}
            />
            <TimelineConnector isLast={index === experiences.length - 1} />
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm text-white/80">
            Want to see my full resume? 
          </span>
          <button 
            className="text-cyan-300 hover:text-cyan-200 text-sm font-medium"
            onClick={onDownloadResume}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}