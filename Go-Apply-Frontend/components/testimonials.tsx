"use client";

import { cn } from "@/lib/utils";
import DomeGallery from "@/components/ui/dome-gallery";

// Custom Marquee component
const Marquee = ({ 
  children, 
  className, 
  reverse = false, 
  pauseOnHover = false 
}: { 
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
}) => {
  return (
    <div className={cn(
      "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
      className
    )}>
      {Array(4).fill(0).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row",
            {
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            }
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
};

const reviews = [
  {
    name: "Sarah Chen",
    username: "@sarahc_student",
    body: "GoApply made my dream of studying at Oxford a reality. The application tracking and guidance were exceptional!",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
  },
  {
    name: "Miguel Rodriguez",
    username: "@miguel_abroad",
    body: "The document preparation service saved me months of confusion. Now I'm studying engineering in Germany!",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
  },
  {
    name: "Priya Patel",
    username: "@priya_dreams",
    body: "From finding the right programs to visa guidance - GoApply was with me every step to studying in Canada.",
    img: "https://images.unsplash.com/photo-1488508872907-592763824245?w=64&h=64&fit=crop&crop=face",
  },
  {
    name: "James Thompson",
    username: "@james_scholar",
    body: "The personalized shortlists feature helped me discover universities I never knew existed. Now at MIT!",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
  },
  {
    name: "Lisa Wang",
    username: "@lisa_global",
    body: "GoApply's deadline tracking ensured I never missed a scholarship opportunity. Studying in Australia now!",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
  },
  {
    name: "Ahmed Hassan",
    username: "@ahmed_student",
    body: "The platform's transparency gave me confidence throughout my application process. Now at Cambridge!",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-80 cursor-pointer overflow-hidden rounded-xl p-6 mx-3",
        // Completely transparent - no background, no border
        "hover:scale-105",
        "transition-all duration-300"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <img className="rounded-full" width="40" height="40" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-base font-semibold text-gray-900">
            {name}
          </figcaption>
          <p className="text-sm font-medium text-gray-700">{username}</p>
        </div>
      </div>
      <blockquote className="mt-4 text-sm leading-relaxed text-gray-800">{body}</blockquote>
    </figure>
  );
};

export default function TestimonialsSection() {
  return (
    <section 
      className="relative py-12 md:py-16 bg-[url('/Background.png')] bg-center bg-no-repeat bg-cover z-0"
      style={{
        transform: "scale(-1, -1)"
      }}
    >
      <div 
        className="mx-auto max-w-7xl px-4"
        style={{
          transform: "scale(-1, -1)"
        }}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stories from Our Students
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from students who've successfully navigated their study abroad journey with GoApply
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Testimonials Marquee */}
          <div className="relative overflow-hidden">
            <div className="relative flex w-full flex-col items-center justify-center">
              <Marquee pauseOnHover className="[--duration:25s]">
                {firstRow.map((review) => (
                  <ReviewCard key={review.username} {...review} />
                ))}
              </Marquee>
              <Marquee reverse pauseOnHover className="[--duration:25s] mt-6">
                {secondRow.map((review) => (
                  <ReviewCard key={review.username} {...review} />
                ))}
              </Marquee>
            </div>
          </div>

          {/* Right side - Dome Gallery */}
          <div className="relative">
            <div className="aspect-square w-full max-w-xl mx-auto">
              <DomeGallery 
                autoRotate={true}
                autoRotateSpeed={0.1}
                fit={0.5}
                minRadius={300}
                maxRadius={500}
                imageBorderRadius="12px"
                grayscale={false}
                overlayBlurColor="transparent"
                segments={20}
              />
            </div>
            
            {/* Decorative text */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-sm text-muted-foreground font-medium">
                Explore Global Universities
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}