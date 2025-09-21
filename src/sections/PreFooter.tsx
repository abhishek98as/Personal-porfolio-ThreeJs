import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../components/footer.css';

export default function PreFooter() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const scroller = document.querySelector('.scroll-container') as HTMLElement | null;
    const triggerElement = document.querySelector('#prefooter [data-parallax-layers]');
    if (!triggerElement) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement as Element,
        start: '0% 100%',
        end: '100% 0%',
        scrub: 0,
        scroller: scroller ?? undefined,
      },
    });

    const layers = [
      { layer: '1', yPercent: 70 },
      { layer: '2', yPercent: 55 },
      { layer: '3', yPercent: 40 },
      { layer: '4', yPercent: 10 },
    ];
    layers.forEach((layerObj, idx) => {
      tl.to(
        (triggerElement as Element).querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
        { yPercent: layerObj.yPercent, ease: 'none' },
        idx === 0 ? undefined : '<'
      );
    });

    return () => {
      tl.scrollTrigger?.kill(true);
    };
  }, []);

  return (
    <div className="relative min-h-[80vh] overflow-hidden">
      {/* Parallax Visuals */}
      <div className="parallax">
        <section className="parallax__header" style={{ height: '60vh' }}>
          <div className="parallax__visuals">
            <div className="parallax__black-line-overflow" />
            <div data-parallax-layers className="parallax__layers">
              <img
                src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp"
                loading="eager"
                width={800}
                data-parallax-layer="1"
                alt=""
                className="parallax__layer-img"
              />
              <img
                src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp"
                loading="eager"
                width={800}
                data-parallax-layer="2"
                alt=""
                className="parallax__layer-img"
              />
              <div data-parallax-layer="3" className="parallax__layer-title">
                <h2 className="parallax__title">Ready to launch</h2>
              </div>
              <img
                src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp"
                loading="eager"
                width={800}
                data-parallax-layer="4"
                alt=""
                className="parallax__layer-img"
              />
            </div>
            <div className="parallax__fade" />
          </div>
        </section>
        <section className="parallax__content" style={{ height: '20vh' }}>
          <div className="relative z-10 text-center p-8">
            <h3 className="text-3xl md:text-5xl font-display font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-emerald-300">
              Ready to launch something stellar?
            </h3>
            <p className="mt-3 text-white/80 max-w-xl mx-auto">
              I blend 3D, interactions, and performance to craft delightful web experiences.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <a href="#contact" className="px-5 py-3 rounded-full bg-white/10 border border-white/20 hover:border-cyan-300 hover:bg-cyan-300/10 transition">
                Contact me
              </a>
              <a href="#projects" className="px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:border-fuchsia-300 hover:bg-fuchsia-300/10 transition">
                View projects
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </div>
  );
}
