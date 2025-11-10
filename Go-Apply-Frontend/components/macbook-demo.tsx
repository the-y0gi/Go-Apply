import React from "react";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import ContactSection from "@/components/contact-section";

export function MacbookScrollDemo() {
  return (
    <div className="w-full overflow-hidden">
      {/* Main section with dual background - 200vh total */}
      <div 
        className="relative w-full bg-white dark:bg-[#0B0B0F]"
        style={{
          height: '200vh',
          backgroundImage: `
            url('/Background.png'),
            url('/Background.png')
          `,
          backgroundSize: '100% 50%, 100% 50%',
          backgroundPosition: '0 0, 0 100vh',
          backgroundRepeat: 'no-repeat, no-repeat',
          transform: 'scaleX(-1) scaleY(1)',
        }}
      >
        {/* First 100vh with horizontal flip only */}
        <div 
          className="absolute inset-0 w-full"
          style={{
            height: '100vh',
            backgroundImage: `url('/Background.png')`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: 'scaleX(1)',
          }}
        />
        
        {/* Second 100vh with both horizontal and vertical flip */}
        <div 
          className="absolute w-full"
          style={{
            top: '100vh',
            height: '100vh',
            backgroundImage: `url('/Background.png')`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: 'scale(1, -1)',
          }}
        />

        {/* Content container - counter-transform to keep content readable */}
        <div 
          className="relative z-10"
          style={{ transform: "scaleX(-1)" }}
        >
          <MacbookScroll
            title={
              <span>
                Transform Your Future with GoApply. <br /> Your Dream University Awaits.
              </span>
            }
            badge={
              <a href="#contact">
                <Badge className="h-10 w-10 -rotate-12 transform" />
              </a>
            }
            showGradient={false}
          >
            <ContactSection />
          </MacbookScroll>
        </div>
      </div>
    </div>
  );
}

// GoApply logo badge
const Badge = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z"
        fill="#10B981"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28 54C42.3594 54 54 42.3594 54 28C54 13.6406 42.3594 2 28 2C13.6406 2 2 13.6406 2 28C2 42.3594 13.6406 54 28 54ZM28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
        fill="#059669"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 12H30C36.6274 12 42 17.3726 42 24C42 30.6274 36.6274 36 30 36H24V44H18V12ZM24 18V30H30C33.3137 30 36 27.3137 36 24C36 20.6863 33.3137 18 30 18H24Z"
        fill="white"
      ></path>
      <path
        d="M14 20H20V22H18V26H20V28H14V20Z"
        fill="white"
      ></path>
      <path
        d="M38 20H44V28H42V22H40V28H38V20Z"
        fill="white"
      ></path>
    </svg>
  );
};