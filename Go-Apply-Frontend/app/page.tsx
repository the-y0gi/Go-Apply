import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import HowItWorks from "@/components/how-it-works"
import OverlapInfo from "@/components/overlap-info"
import TestimonialsSection from "@/components/testimonials"
import { MacbookScrollDemo } from "@/components/macbook-demo"
import Footer from "@/components/footer"

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      
      {/* Container for sticky How It Works and overlapping third section */}
      <div className="relative">
        {/* Sticky How It Works section */}
        <div className="sticky top-0 z-10 bg-[url('/BgHowItWorks.png')] bg-center bg-no-repeat">
          <HowItWorks />
        </div>
        
        {/* Overlapping section with glassmorphism */}
        <div 
          className="relative z-20"
          style={{
            backgroundImage: "url('/Earth_fixed.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            transform: "scaleX(1)"
          }}
        >
          <div style={{ transform: "scaleX(1)" }}>
            <OverlapInfo />
          </div>
        </div>
      </div>

      {/* Testimonials Section - this will push the sticky section up */}
      <div className="-mb-16">
        <TestimonialsSection />
      </div>
      
      {/* MacBook Scroll Section */}
      <MacbookScrollDemo />
      
      {/* Footer */}
      <Footer />
    </main>
  )
}
