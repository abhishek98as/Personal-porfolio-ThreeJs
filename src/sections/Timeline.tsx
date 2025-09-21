import { useState } from 'react';
import ExperienceTimeline from '../components/ExperienceTimeline';
import ResumeModal from '../components/ResumeModal';
import { experienceData } from '../data/resumeData';

export default function Timeline() {
  const [showResume, setShowResume] = useState(false);

  return (
    <div className="container mx-auto px-6">
      <div className="rounded-3xl panel-gradient p-8 ring-1 ring-[color:var(--border)]">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-gradient">Experience Journey</h2>
          <p className="mt-4 text-[color:var(--fg-secondary)] max-w-2xl mx-auto">
            From education to professional growth - explore my career path, achievements, and the technologies I've mastered along the way.
          </p>
        </div>
        <ExperienceTimeline 
          experiences={experienceData} 
          onDownloadResume={() => setShowResume(true)}
        />
      </div>
      
      {showResume && (
        <ResumeModal 
          open={showResume} 
          onClose={() => setShowResume(false)}
          src="/Abhishek_Singh_Python_Backend_Resume_2025 (1).pdf"
        />
      )}
    </div>
  );
}
