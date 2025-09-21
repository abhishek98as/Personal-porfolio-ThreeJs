const SKILLS = [
  'css','docker','express','figma','firebase','framer','go','graphql','html','js','mongodb','mui','mysql','next','node','postgresql','prisma','react','reactnative','reactquery','redux','stripe','tailwind','tauri','ts'
];

const skillModules = import.meta.glob('../../space-portfolio/public/skills/*.png', { eager: true, as: 'url' }) as Record<string, string>;
const skillUrlByName: Record<string, string> = Object.fromEntries(
  Object.entries(skillModules).map(([path, url]) => {
    const name = path.split('/').pop()!.replace('.png', '');
    return [name, url];
  })
);
import skillsBg from '../../space-portfolio/public/videos/skills-bg.webm';

export default function SpaceSkills() {
  return (
    <section id="space-skills" className="relative flex flex-col items-center justify-center gap-6 py-16 overflow-hidden">
      <h3 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">Skills</h3>
      <div className="flex flex-row flex-wrap gap-5 items-center justify-center max-w-6xl px-6">
        {SKILLS.map((name) => (
          <div key={name} className="flex items-center gap-2 border border-white/10 rounded-xl px-3 py-2 bg-black/20">
            <img src={skillUrlByName[name]} alt={name} width={28} height={28} className="select-none" />
            <span className="capitalize text-sm">{name}</span>
          </div>
        ))}
      </div>
      <div className="w-full h-full absolute inset-0 -z-10 opacity-30">
        <video className="w-full h-full object-cover" preload="none" playsInline loop muted autoPlay>
          <source src={skillsBg} type="video/webm" />
        </video>
      </div>
    </section>
  );
}
