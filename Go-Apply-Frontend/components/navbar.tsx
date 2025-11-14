// "use client"

// import { useEffect, useRef, useState } from "react"
// import { gsap } from "gsap"
// import { ScrollTrigger } from "gsap/ScrollTrigger"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"
// import SignInModal from "@/components/auth/SignInModal"
// import RegisterModal from "@/components/auth/RegisterModal"
// import RegistrationQuestionnaire from "@/components/auth/RegistrationQuestionnaire"
// import axios from "axios"
// import { de } from "date-fns/locale"

// if (typeof window !== "undefined") {
//   gsap.registerPlugin(ScrollTrigger)
// }

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// export default function Navbar() {
//   const navRef = useRef<HTMLElement>(null)
//   const [scrolled, setScrolled] = useState(false)
//   const [searchOpen, setSearchOpen] = useState(false)
//   const [signInOpen, setSignInOpen] = useState(false)
//   const [registerOpen, setRegisterOpen] = useState(false)
//   const [questionnaireOpen, setQuestionnaireOpen] = useState(false)
//   const [userEmail, setUserEmail] = useState("")

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         ".nav-item",
//         { opacity: 0, y: -20 },
//         { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.2 },
//       )

//       ScrollTrigger.create({
//         trigger: "body",
//         start: "top -50px",
//         end: "bottom bottom",
//         onUpdate: (self) => {
//           const isScrolledNow = self.progress > 0
//           setScrolled(isScrolledNow)

//           if (isScrolledNow) {
//             gsap.to(navRef.current, {
//               scale: 0.9,
//               y: 16,
//               borderRadius: "24px",
//               duration: 0.6,
//               ease: "power2.out",
//               transformOrigin: "center top",
//             })
//           } else {
//             gsap.to(navRef.current, {
//               scale: 1,
//               y: 0,
//               borderRadius: "0px",
//               duration: 0.6,
//               ease: "power2.out",
//               transformOrigin: "center top",
//             })
//           }
//         },
//       })
//     }, navRef)

//     return () => ctx.revert()
//   }, [])

//   //find program
//   useEffect(() => {
//   const handleOpenSignIn = () => setSignInOpen(true)
//   const handleOpenRegister = () => setRegisterOpen(true)

//   window.addEventListener("openSignIn", handleOpenSignIn)
//   window.addEventListener("openRegister", handleOpenRegister)

//   return () => {
//     window.removeEventListener("openSignIn", handleOpenSignIn)
//     window.removeEventListener("openRegister", handleOpenRegister)
//   }
// }, [])

//   const handleRegisterComplete = (userData: { email: string; password: string; firstName: string; lastName: string }) => {
//     setUserEmail(userData.email)
//     setRegisterOpen(false)
//     setQuestionnaireOpen(true)
//   }

//   const handleQuestionnaireComplete = async (profileData: any) => {
    
//     setQuestionnaireOpen(false)
//     // Here you would typically save the data via API
//     console.log('Registration complete:', { email: userEmail, profileData })
//     var token = localStorage.getItem('authToken');
//     profileData.token=token;
//     const {data} = await axios.post(
//         `${API_URL}/users/questionnaire`,
//         profileData,
//         {
//           headers: { 
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${profileData.token}` },
//         }
//     );
//     // Save to localStorage as a fallback for demo purposes
//     const userData = {
//       id: data.data.profile._id,
//       email: userEmail,
//       profileCompleted: true,
//       registrationStep: 8,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     }
//     localStorage.setItem('user', JSON.stringify(userData))
//     localStorage.setItem('profile', JSON.stringify(profileData))
    
//     // Redirect to dashboard
//     window.location.href = '/dashboard'
//   }

//   // Check if user needs to resume registration
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search)
//     const resumeStep = urlParams.get('resume')
//     if (resumeStep) {
//       const step = parseInt(resumeStep)
//       if (step > 0 && step < 8) {
//         setQuestionnaireOpen(true)
//       }
//     }
//   }, [])

//   return (
//     <>
//       <header
//         ref={navRef}
//         className={cn(
//           "fixed top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-card/70 bg-card/80 border border-border transition-all duration-300",
//           scrolled 
//             ? "shadow-xl border-l-0 border-r-0 border-t-0" 
//             : "border-l-0 border-r-0 border-t-0"
//         )}
//         style={{ transformOrigin: "center top" }}
//         aria-label="Primary"
//       >
//         <div className="mx-auto max-w-6xl px-4">
//           <div className={cn(
//             "flex items-center justify-between transition-all duration-300",
//             scrolled ? "h-14" : "h-20",
//           )}>
//             <Link href="/" className="nav-item font-semibold">
//               <span className="sr-only">GoApply</span>
//               <div className="flex items-center gap-2">
//                 <div className="h-6 w-6 rounded-md bg-primary" aria-hidden />
//                 <span className="text-foreground">GoApply</span>
//               </div>
//             </Link>

//             <nav className="hidden md:flex items-center gap-6">
//               <Link href="#" className="nav-item text-sm text-muted-foreground hover:text-foreground transition-colors">
//                 Students
//               </Link>
//               <Link href="#" className="nav-item text-sm text-muted-foreground hover:text-foreground transition-colors">
//                 Study Destinations
//               </Link>
//               <Link href="#" className="nav-item text-sm text-muted-foreground hover:text-foreground transition-colors">
//                 Partners
//               </Link>
              
//               {/* Search with icon and animation */}
//               <div className="nav-item relative">
//                 <button
//                   onClick={() => setSearchOpen(!searchOpen)}
//                   className={cn(
//                     "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300",
//                     searchOpen && "text-foreground"
//                   )}
//                 >
//                   <svg 
//                     className={cn("w-4 h-4 transition-transform duration-300", searchOpen && "rotate-12")} 
//                     fill="none" 
//                     stroke="currentColor" 
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                   Search
//                 </button>
                
//                 {/* Search input with animation */}
//                 <div className={cn(
//                   "absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg transition-all duration-300 origin-top",
//                   searchOpen 
//                     ? "opacity-100 scale-100 pointer-events-auto" 
//                     : "opacity-0 scale-95 pointer-events-none"
//                 )}>
//                   <input 
//                     type="text" 
//                     placeholder="Search programs, countries..." 
//                     className="w-full px-3 py-2 bg-transparent border-none outline-none text-sm"
//                     autoFocus={searchOpen}
//                   />
//                 </div>
//               </div>
//             </nav>

//             <div className="flex items-center gap-2">
//               <Button 
//                 variant="secondary" 
//                 className="nav-item hidden sm:inline-flex"
//                 onClick={() => setSignInOpen(true)}
//               >
//                 Sign in
//               </Button>
//               <Button 
//                 className="nav-item bg-primary text-primary-foreground hover:opacity-90"
//                 onClick={() => setRegisterOpen(true)}
//               >
//                 Register
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Auth Modals */}
//       <SignInModal
//         isOpen={signInOpen}
//         onClose={() => setSignInOpen(false)}
//         onSwitchToRegister={() => {
//           setSignInOpen(false)
//           setRegisterOpen(true)
//         }}
//       />

//       <RegisterModal
//         isOpen={registerOpen}
//         onClose={() => setRegisterOpen(false)}
//         onSwitchToSignIn={() => {
//           setRegisterOpen(false)
//           setSignInOpen(true)
//         }}
//         onCompleteInitialRegister={handleRegisterComplete}
//       />

//       <RegistrationQuestionnaire
//         isOpen={questionnaireOpen}
//         userEmail={userEmail}
//         onComplete={handleQuestionnaireComplete}
//         onClose={() => setQuestionnaireOpen(false)}
//       />
//     </>
//   )
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SignInModal from "@/components/auth/SignInModal";
import RegisterModal from "@/components/auth/RegisterModal";
import RegistrationQuestionnaire from "@/components/auth/RegistrationQuestionnaire";
import axios from "axios";
import { useRouter } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [activeMenu, setActiveMenu] = useState<
    "students" | "destinations" | "partners" | null
  >("students");

  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".nav-item",
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.2,
        }
      );

      ScrollTrigger.create({
        trigger: "body",
        start: "top -50px",
        end: "bottom bottom",
        onUpdate: (self) => {
          const isScrolledNow = self.progress > 0;
          setScrolled(isScrolledNow);

          gsap.to(navRef.current, {
            scale: isScrolledNow ? 0.9 : 1,
            y: isScrolledNow ? 16 : 0,
            borderRadius: isScrolledNow ? "24px" : "0px",
            duration: 0.6,
            ease: "power2.out",
          });
        },
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  const handleRegisterComplete = (userData: any) => {
    setUserEmail(userData.email);
    setRegisterOpen(false);
    setQuestionnaireOpen(true);
  };

  const handleQuestionnaireComplete = async (profileData: any) => {
    setQuestionnaireOpen(false);

    const token = localStorage.getItem("authToken");
    profileData.token = token;

    await axios.post(`${API_URL}/users/questionnaire`, profileData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${profileData.token}`,
      },
    });

    window.location.href = "/dashboard";
  };

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          "fixed top-0 z-40 w-full backdrop-blur bg-card/80 border border-border transition-all duration-300",
          scrolled ? "shadow-xl border-t-0 border-l-0 border-r-0" : "border-t-0 border-l-0 border-r-0"
        )}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-300",
              scrolled ? "h-14" : "h-20"
            )}
          >
            <Link href="/" className="nav-item font-semibold">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-primary" aria-hidden />
                <span className="text-foreground">GoApply</span>
              </div>
            </Link>

            {/* NAV LINKS (Search Removed) */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => {
                  setActiveMenu("students");
                  router.push("/students");
                }}
                className={cn(
                  "nav-item relative pb-2 text-sm font-medium transition-colors",
                  activeMenu === "students"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Students
                {activeMenu === "students" && (
                  <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-primary rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveMenu("destinations");
                  router.push("/studyDestination");
                }}
                className={cn(
                  "nav-item relative pb-2 text-sm font-medium transition-colors",
                  activeMenu === "destinations"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Study Destinations
                {activeMenu === "destinations" && (
                  <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-primary rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveMenu("partners");
                  router.push("/partners");
                }}
                className={cn(
                  "nav-item relative pb-2 text-sm font-medium transition-colors",
                  activeMenu === "partners"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Partners
                {activeMenu === "partners" && (
                  <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-primary rounded-full"></span>
                )}
              </button>
            </nav>

            {/* AUTH BUTTONS */}
            <div className="flex items-center gap-2">
              <Button variant="secondary" className="nav-item hidden sm:inline-flex" onClick={() => setSignInOpen(true)}>
                Sign in
              </Button>
              <Button className="nav-item bg-primary text-primary-foreground hover:opacity-90" onClick={() => setRegisterOpen(true)}>
                Register
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* AUTH MODALS */}
      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} onSwitchToRegister={() => { setSignInOpen(false); setRegisterOpen(true); }} />

      <RegisterModal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} onSwitchToSignIn={() => { setRegisterOpen(false); setSignInOpen(true); }} onCompleteInitialRegister={handleRegisterComplete} />

      <RegistrationQuestionnaire isOpen={questionnaireOpen} userEmail={userEmail} onComplete={handleQuestionnaireComplete} onClose={() => setQuestionnaireOpen(false)} />
    </>
  );
}