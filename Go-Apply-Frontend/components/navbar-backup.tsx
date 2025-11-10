"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import SignInModal from "@/components/auth/SignInModal"
import RegisterModal from "@/components/auth/RegisterModal"
import RegistrationQuestionnaire from "@/components/auth/RegistrationQuestionnaire"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".nav-item",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.2 },
      )

      ScrollTrigger.create({
        trigger: "body",
        start: "top -50px",
        end: "bottom bottom",
        onUpdate: (self) => {
          const isScrolledNow = self.progress > 0
          setScrolled(isScrolledNow)

          if (isScrolledNow) {
            gsap.to(navRef.current, {
              scale: 0.9,
              y: 16,
              borderRadius: "24px",
              duration: 0.6,
              ease: "power2.out",
              transformOrigin: "center top",
            })
          } else {
            gsap.to(navRef.current, {
              scale: 1,
              y: 0,
              borderRadius: "0px",
              duration: 0.6,
              ease: "power2.out",
              transformOrigin: "center top",
            })
          }
        },
      })
    }, navRef)

    return () => ctx.revert()
  }, [])

  const handleRegisterComplete = (userData: { email: string; password: string; firstName: string; lastName: string }) => {
    setUserEmail(userData.email)
    setRegisterOpen(false)
    setQuestionnaireOpen(true)
  }

  const handleQuestionnaireComplete = (profileData: any) => {
    setQuestionnaireOpen(false)
    // Redirect to dashboard or show success message
    console.log('Registration complete:', { email: userEmail, profileData })
    // You would typically save this data and redirect to dashboard
    window.location.href = '/dashboard'
  }

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          "fixed top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-card/70 bg-card/80 border border-border transition-all duration-300",
          scrolled 
            ? "shadow-xl border-l-0 border-r-0 border-t-0" 
            : "border-l-0 border-r-0 border-t-0"
        )}
        style={{ transformOrigin: "center top" }}
        aria-label="Primary"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className={cn(
            "flex items-center justify-between transition-all duration-300",
            scrolled ? "h-14" : "h-20",
          )}>
            <Link href="/" className="nav-item font-semibold">
              <span className="sr-only">GoApply</span>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-primary" aria-hidden />
                <span className="text-foreground">GoApply</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="#" className="nav-item text-sm text-muted-foreground hover:text-foreground transition-colors">
                Students
              </Link>
              <Link href="#" className="nav-item text-sm text-muted-foreground hover:text-foreground transition-colors">
                Study Destinations
              </Link>
              <Link href="#" className="nav-item text-sm text-muted-foreground hover:text-foreground transition-colors">
                Partners
              </Link>
              
              {/* Search with icon and animation */}
              <div className="nav-item relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={cn(
                    "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300",
                    searchOpen && "text-foreground"
                  )}
                >
                  <svg 
                    className={cn("w-4 h-4 transition-transform duration-300", searchOpen && "rotate-12")} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
                
                {/* Search input with animation */}
                <div className={cn(
                  "absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg transition-all duration-300 origin-top",
                  searchOpen 
                    ? "opacity-100 scale-100 pointer-events-auto" 
                    : "opacity-0 scale-95 pointer-events-none"
                )}>
                  <input 
                    type="text" 
                    placeholder="Search programs, countries..." 
                    className="w-full px-3 py-2 bg-transparent border-none outline-none text-sm"
                    autoFocus={searchOpen}
                  />
                </div>
              </div>
            </nav>

            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                className="nav-item hidden sm:inline-flex"
                onClick={() => setSignInOpen(true)}
              >
                Sign in
              </Button>
              <Button 
                className="nav-item bg-primary text-primary-foreground hover:opacity-90"
                onClick={() => setRegisterOpen(true)}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modals */}
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSwitchToRegister={() => {
          setSignInOpen(false)
          setRegisterOpen(true)
        }}
      />

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToSignIn={() => {
          setRegisterOpen(false)
          setSignInOpen(true)
        }}
        onCompleteInitialRegister={handleRegisterComplete}
      />

      <RegistrationQuestionnaire
        isOpen={questionnaireOpen}
        userEmail={userEmail}
        onComplete={handleQuestionnaireComplete}
        onClose={() => setQuestionnaireOpen(false)}
      />
    </>
  )
}
                className={cn(
                  "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300",
                  searchOpen && "text-foreground"
                )}
              >
                <svg 
                  className={cn("w-4 h-4 transition-transform duration-300", searchOpen && "rotate-12")} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
              
              {/* Search input with animation */}
              <div className={cn(
                "absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg transition-all duration-300 origin-top",
                searchOpen 
                  ? "opacity-100 scale-100 pointer-events-auto" 
                  : "opacity-0 scale-95 pointer-events-none"
              )}>
                <input 
                  type="text" 
                  placeholder="Search programs, countries..." 
                  className="w-full px-3 py-2 bg-transparent border-none outline-none text-sm"
                  autoFocus={searchOpen}
                />
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="secondary" className="nav-item hidden sm:inline-flex">
              Sign in
            </Button>
            <Button className="nav-item bg-primary text-primary-foreground hover:opacity-90">Register</Button>
          </div>
        </div>
      </div>
    </header>
  )
}
