import { codingPassion } from '../data/workExperienceData';

export default function CodingPassion() {
  return (
    <div className="container mx-auto px-6">
      <div className="rounded-3xl panel-gradient p-8 ring-1 ring-[color:var(--border)]">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-gradient mb-4">
            {codingPassion.title}
          </h2>
          <h3 className="text-xl text-gradient-2 mb-6">{codingPassion.subtitle}</h3>
          <p className="text-[color:var(--fg-secondary)] max-w-3xl mx-auto leading-relaxed">
            {codingPassion.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {codingPassion.stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-white/70">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Values/Principles */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {codingPassion.values.map((value, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white/90 mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                    {value.title}
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Code Philosophy */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-400/20">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gradient-2">My Coding Philosophy</h3>
            </div>
            <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
              "Code is poetry written in logic. Every function should tell a story, every variable should have meaning, 
              and every solution should be elegant in its simplicity. I believe that great software is not just about 
              making things work—it's about making them work beautifully."
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm">
                💡 Innovation
              </span>
              <span className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm">
                🎯 Precision
              </span>
              <span className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm">
                🚀 Performance
              </span>
              <span className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm">
                🌟 Excellence
              </span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <p className="text-white/80">
              Ready to bring your ideas to life with passionate, quality code?
            </p>
            <button 
              onClick={() => document.getElementById('lets-talk')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 hover:scale-105"
            >
              Let's Create Something Amazing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}