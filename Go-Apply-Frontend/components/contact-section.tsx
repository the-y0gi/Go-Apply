"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export default function ContactSection() {
  const [contactOpacity, setContactOpacity] = useState(1);
  const [earthOpacity, setEarthOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Get footer element
      const footer = document.querySelector('footer');
      if (!footer) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of footer is visible
      // When footer starts appearing (footerRect.top < windowHeight), start fading
      const fadeStart = windowHeight; // Footer starts to appear
      const fadeEnd = windowHeight * 0.8; // Fully faded when footer is 20% visible
      
      if (footerRect.top <= fadeStart) {
        // Calculate opacity based on footer visibility
        const fadeProgress = Math.max(0, Math.min(1, (fadeStart - footerRect.top) / (fadeStart - fadeEnd)));
        setContactOpacity(1 - fadeProgress);
        setEarthOpacity(fadeProgress);
      } else {
        setContactOpacity(1);
        setEarthOpacity(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Contact Form Section */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 p-2 transition-opacity duration-300"
        style={{ opacity: contactOpacity }}
      >
        <div className="w-full h-full flex flex-col">
          <div className="text-center mb-2">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xs text-gray-800 leading-tight">
              Hear from students who've successfully navigated their study abroad journey with GoApply.
            </p>
          </div>

          <div className="grid grid-cols-5 gap-3 flex-1">
            {/* Left side - Contact Form (4/5 width) */}
            <div className="col-span-4 bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/50 flex flex-col">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Get Started Today</h3>
              <form className="grid grid-cols-2 gap-2 flex-1">
                <div>
                  <Input 
                    placeholder="Full Name" 
                    className="w-full px-2 py-1.5 rounded-md border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-xs h-8"
                  />
                </div>
                <div>
                  <Input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full px-2 py-1.5 rounded-md border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-xs h-8"
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Phone Number" 
                    className="w-full px-2 py-1.5 rounded-md border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-xs h-8"
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Preferred Country" 
                    className="w-full px-2 py-1.5 rounded-md border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-xs h-8"
                  />
                </div>
                <div className="col-span-2">
                  <Textarea 
                    placeholder="Tell us about your study abroad goals..." 
                    rows={2}
                    className="w-full px-2 py-1.5 rounded-md border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none text-xs h-16"
                  />
                </div>
                <div className="col-span-2">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white py-1.5 rounded-md font-semibold transition-all text-xs h-8">
                    Start My Application Journey
                  </Button>
                </div>
              </form>
            </div>

            {/* Right side - Benefits (1/5 width) */}
            <div className="space-y-2 flex flex-col justify-center">
              <div className="text-center">
                <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center mx-auto mb-1">
                  <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xs font-semibold text-gray-900 mb-0.5">Free Consultation</h4>
                <p className="text-xs text-gray-600">Expert guidance</p>
              </div>

              <div className="text-center">
                <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center mx-auto mb-1">
                  <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xs font-semibold text-gray-900 mb-0.5">Quick Response</h4>
                <p className="text-xs text-gray-600">24hr guarantee</p>
              </div>

              <div className="text-center">
                <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center mx-auto mb-1">
                  <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xs font-semibold text-gray-900 mb-0.5">95% Success</h4>
                <p className="text-xs text-gray-600">Proven results</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Earth Section - Fades in as contact form fades out */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{ 
          opacity: earthOpacity,
          backgroundImage: 'url(/earth.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="w-full h-full flex justify-center bg-black/40">
          <div className="text-center px-8">
            <h2 className="text-4xl md:text-6xl font-bold text-black mb-4">
              GoApply
            </h2>
            <p className="text-lg md:text-xl text-black font-medium max-w-2xl mx-auto leading-relaxed">
              Let's make your dreams come true. Your journey to study abroad starts here with endless possibilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}