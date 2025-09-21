import { useState } from 'react';
import { workExperiences } from '../data/workExperienceData';

export default function WorkExperience() {
  const [selectedExperience, setSelectedExperience] = useState(0);
  const currentExp = workExperiences[selectedExperience];

  return (
    <div className="container mx-auto px-6">
      <div className="rounded-3xl panel-gradient p-8 ring-1 ring-[color:var(--border)]">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-gradient mb-4">
            My Work Experience
          </h2>
          <p className="text-[color:var(--fg-secondary)] max-w-2xl mx-auto">
            A journey through my professional growth in Python backend development, 
            working remotely with teams across different timezones and cultures.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Timeline Navigation */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gradient-2 mb-6">Career Timeline</h3>
            {workExperiences.map((exp, index) => (
              <div
                key={exp.id}
                onClick={() => setSelectedExperience(index)}
                className={`cursor-pointer p-4 rounded-xl transition-all duration-300 ${
                  selectedExperience === index
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 shadow-lg shadow-cyan-500/10'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
                    selectedExperience === index
                      ? 'bg-cyan-500/20 ring-2 ring-cyan-400/50'
                      : 'bg-white/10'
                  }`}>
                    {exp.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold transition-colors duration-300 ${
                        selectedExperience === index ? 'text-cyan-300' : 'text-white/90'
                      }`}>
                        {exp.name}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        exp.type === 'remote' 
                          ? 'bg-green-500/20 text-green-300'
                          : exp.type === 'hybrid'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {exp.type}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mb-1">{exp.position}</p>
                    <p className="text-xs text-white/50">{exp.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Experience Details */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-cyan-500/20 flex items-center justify-center text-3xl ring-2 ring-cyan-400/50">
                {currentExp.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-cyan-300">{currentExp.name}</h3>
                <p className="text-white/70">{currentExp.position}</p>
                <p className="text-sm text-white/50">{currentExp.duration} • {currentExp.location}</p>
              </div>
            </div>

            <p className="text-white/80 mb-6 leading-relaxed">
              {currentExp.description}
            </p>

            {/* Skills */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white/90 mb-3">Technologies & Skills</h4>
              <div className="flex flex-wrap gap-2">
                {currentExp.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h4 className="text-sm font-semibold text-white/90 mb-3">Key Achievements</h4>
              <ul className="space-y-2">
                {currentExp.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Experience Summary */}
        <div className="grid md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/10">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-3 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{workExperiences.length}+</span>
            </div>
            <h4 className="font-semibold text-white/90 mb-1">Years Experience</h4>
            <p className="text-sm text-white/70">Professional development journey</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-3 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
            </div>
            <h4 className="font-semibold text-white/90 mb-1">Remote Work</h4>
            <p className="text-sm text-white/70">Across multiple timezones</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-teal-500 mx-auto mb-3 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-white/90 mb-1">Success Rate</h4>
            <p className="text-sm text-white/70">Projects delivered on time</p>
          </div>
        </div>
      </div>
    </div>
  );
}