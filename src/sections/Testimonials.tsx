import { useState } from 'react';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { TestimonialSummary } from '../components/TestimonialCard';
import { testimonialsData, getTestimonialsByRating } from '../data/testimonialsData';

export default function Testimonials() {
  const [showAll, setShowAll] = useState(false);
  const [filterRating, setFilterRating] = useState(0);
  
  const filteredTestimonials = filterRating > 0 
    ? getTestimonialsByRating(filterRating)
    : testimonialsData;

  const displayedTestimonials = showAll 
    ? filteredTestimonials 
    : filteredTestimonials.slice(0, 6);

  return (
    <div className="container mx-auto px-6">
      <div className="rounded-3xl panel-gradient p-8 ring-1 ring-[color:var(--border)]">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-gradient mb-4">
            Client Testimonials
          </h2>
          <p className="text-[color:var(--fg-secondary)] max-w-2xl mx-auto">
            Hear what clients say about working with me. Real feedback from real projects that showcase 
            the quality and professionalism of my Python backend development services.
          </p>
        </div>

        {/* Summary Stats */}
        <TestimonialSummary testimonials={testimonialsData} />

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">Filter by rating:</span>
            <div className="flex items-center gap-1">
              {[0, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
                    filterRating === rating
                      ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/50'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {rating === 0 ? 'All' : `${rating}+ Stars`}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">View:</span>
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-3 py-1.5 rounded-full text-xs bg-white/10 text-white/70 hover:bg-white/20 transition-all duration-200"
            >
              {showAll ? 'Show Less' : 'Show All'}
            </button>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <TestimonialCarousel 
          testimonials={displayedTestimonials}
          autoPlay={true}
          autoPlayInterval={6000}
          showControls={true}
          itemsPerView={3}
        />

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
            <div className="text-lg font-semibold text-gradient-2">
              Ready to Join These Happy Clients?
            </div>
            <p className="text-white/80 text-sm max-w-md">
              Let's discuss your project and see how I can help you achieve your goals with reliable, 
              scalable Python backend solutions.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
              >
                Start Your Project
              </button>
              <button 
                onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-2.5 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-all duration-200"
              >
                View My Work
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm font-medium text-white/90">100% Success Rate</div>
              <div className="text-xs text-white/60">All projects delivered</div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm font-medium text-white/90">On-Time Delivery</div>
              <div className="text-xs text-white/60">Always meet deadlines</div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <div className="text-sm font-medium text-white/90">24/7 Support</div>
              <div className="text-xs text-white/60">Post-delivery assistance</div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="text-sm font-medium text-white/90">Quality Assured</div>
              <div className="text-xs text-white/60">Tested & documented</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}