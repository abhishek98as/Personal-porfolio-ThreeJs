import SkillsGlobe from '../components/SkillsGlobe';

export default function Skills() {
  return (
    <div className="container mx-auto px-6">
      <div className="rounded-3xl panel-gradient p-8 ring-1 ring-[color:var(--border)]">
        <h2 className="text-3xl md:text-5xl font-display font-semibold text-gradient-2">Skills</h2>
        <p className="mt-4 text-[color:var(--fg-secondary)]">Click a skill on the globe to view details.</p>
        <div className="mt-6 rounded-2xl card-gradient p-4">
          <SkillsGlobe />
        </div>
      </div>
    </div>
  );
}
