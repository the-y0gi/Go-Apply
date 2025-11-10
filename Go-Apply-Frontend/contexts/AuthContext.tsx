// "use client";

// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { SignInRequest, SignUpRequest, User, UserProfile } from "@/models/user";


// interface AuthContextType {
//   user: User | null;
//   profile: UserProfile | null;
//   authToken: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   signIn: (signInRequest: SignInRequest) => Promise<void>;
//   signUp: (signUpRequest: SignUpRequest) => Promise<void>;
//   signOut: () => void;
//   updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
//   resumeRegistration: () => number;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [authToken, setAuthToken] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);



//   useEffect(() => {
//     try {
//       const savedUser = localStorage.getItem("user");
//       const savedProfile = localStorage.getItem("profile");
//       const savedToken = localStorage.getItem("authToken");



//       if (savedUser) setUser(JSON.parse(savedUser));
//       if (savedProfile) setProfile(JSON.parse(savedProfile));
//       if (savedToken) setAuthToken(savedToken);
//     } catch (error) {
//       console.error("Error loading session:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const signIn = async (signInRequest: SignInRequest) => {
//     setIsLoading(true);

//     return new Promise<void>((resolve) => {
//       try {
//         setUser(signInRequest.user);
//         setAuthToken(signInRequest.authToken);
//         localStorage.setItem("user", JSON.stringify(signInRequest.user));
//         localStorage.setItem("authToken", signInRequest.authToken);
//       } catch (error) {
//         console.error("Sign in error:", error);
//       } finally {
//         setIsLoading(false);
//         setTimeout(() => resolve(), 50);
//       }
//     });
//   };

//   const signUp = async (signUpRequest: SignUpRequest) => {
//     setIsLoading(true);

//     return new Promise<void>((resolve) => {
//       try {
//         const newUser: User = {
//           id: signUpRequest.user.id,
//           email: signUpRequest.user.email,
//           firstName: signUpRequest.user.firstName,
//           lastName: signUpRequest.user.lastName,
//           profileCompleted: false,
//           registrationStep: 0,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         };

//         setUser(newUser);
//         setAuthToken(signUpRequest.authToken);
//         localStorage.setItem("user", JSON.stringify(newUser));
//         localStorage.setItem("authToken", signUpRequest.authToken);

//         const existingUsers = localStorage.getItem("registeredUsers");
//         const users = existingUsers ? JSON.parse(existingUsers) : [];
//         users.push(newUser);
//         localStorage.setItem("registeredUsers", JSON.stringify(users));
//       } catch (error) {
//         console.error("Sign up error:", error);
//       } finally {
//         setIsLoading(false);
//         setTimeout(() => resolve(), 50);
//       }
//     });
//   };

//   const signOut = () => {
//     setUser(null);
//     setProfile(null);
//     setAuthToken(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("profile");
//     localStorage.removeItem("authToken");
//   };

//   const updateProfile = async (profileData: Partial<UserProfile>) => {
//     if (!user) return;
//     try {
//       const updatedProfile: UserProfile = {
//         userId: user.id,
//         ...profile,
//         ...profileData,
//         updatedAt: new Date(),
//         createdAt: profile?.createdAt || new Date(),
//       };

//       const updatedUser: User = {
//         ...user,
//         firstName: (profileData as any).firstName || user.firstName,
//         lastName: (profileData as any).lastName || user.lastName,
//         profileCompleted: true,
//         registrationStep: 8,
//         updatedAt: new Date(),
//       };

//       setProfile(updatedProfile);
//       setUser(updatedUser);

//       localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile));
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//     } catch (error) {
//       console.error("Profile update error:", error);
//     }
//   };

//   const resumeRegistration = (): number => user?.registrationStep || 1;

//   const value = {
//     user,
//     profile,
//     authToken,
//     isAuthenticated: !!user,
//     isLoading,
//     signIn,
//     signUp,
//     signOut,
//     updateProfile,
//     resumeRegistration,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }


"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  SignInRequest,
  SignUpRequest,
  User,
  UserProfile,
} from "@/models/user";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  authToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (signInRequest: SignInRequest) => Promise<void>;
  signUp: (signUpRequest: SignUpRequest) => Promise<void>;
  signOut: () => void;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  resumeRegistration: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Load session from localStorage on mount (skip for forgot/reset routes)
  useEffect(() => {
    if (
      pathname?.includes("forgot") ||
      pathname?.includes("reset") ||
      pathname?.includes("otp")
    ) {
      setIsLoading(false);
      return;
    }

    try {
      const savedUser = localStorage.getItem("user");
      const savedProfile = localStorage.getItem("profile");
      const savedToken = localStorage.getItem("authToken");

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedToken) setAuthToken(savedToken);
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pathname]);

  // ✅ Safe signIn
  const signIn = async (signInRequest: SignInRequest) => {
    setIsLoading(true);

    return new Promise<void>((resolve) => {
      try {
        const { user, authToken } = signInRequest;

        // Avoid unnecessary re-renders
        if (JSON.stringify(user) !== localStorage.getItem("user")) {
          localStorage.setItem("user", JSON.stringify(user));
        }
        if (localStorage.getItem("authToken") !== authToken) {
          localStorage.setItem("authToken", authToken);
        }

        setUser(user);
        setAuthToken(authToken);
      } catch (error) {
        console.error("Sign in error:", error);
      } finally {
        setIsLoading(false);
        setTimeout(() => resolve(), 50);
      }
    });
  };

  // ✅ Safe signUp
  const signUp = async (signUpRequest: SignUpRequest) => {
    setIsLoading(true);

    return new Promise<void>((resolve) => {
      try {
        const newUser: User = {
          id: signUpRequest.user.id,
          email: signUpRequest.user.email,
          firstName: signUpRequest.user.firstName,
          lastName: signUpRequest.user.lastName,
          profileCompleted: false,
          registrationStep: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        if (JSON.stringify(newUser) !== localStorage.getItem("user")) {
          localStorage.setItem("user", JSON.stringify(newUser));
        }
        if (localStorage.getItem("authToken") !== signUpRequest.authToken) {
          localStorage.setItem("authToken", signUpRequest.authToken);
        }

        const existingUsers = localStorage.getItem("registeredUsers");
        const users = existingUsers ? JSON.parse(existingUsers) : [];
        users.push(newUser);
        localStorage.setItem("registeredUsers", JSON.stringify(users));

        setUser(newUser);
        setAuthToken(signUpRequest.authToken);
      } catch (error) {
        console.error("Sign up error:", error);
      } finally {
        setIsLoading(false);
        setTimeout(() => resolve(), 50);
      }
    });
  };

  // ✅ Sign out
  const signOut = () => {
    setUser(null);
    setProfile(null);
    setAuthToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    localStorage.removeItem("authToken");
  };

  // ✅ Update profile safely
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const updatedProfile: UserProfile = {
        userId: user.id,
        ...profile,
        ...profileData,
        updatedAt: new Date(),
        createdAt: profile?.createdAt || new Date(),
      };

      const updatedUser: User = {
        ...user,
        firstName: (profileData as any).firstName || user.firstName,
        lastName: (profileData as any).lastName || user.lastName,
        profileCompleted: true,
        registrationStep: 8,
        updatedAt: new Date(),
      };

      setProfile(updatedProfile);
      setUser(updatedUser);

      localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile));
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  const resumeRegistration = (): number => user?.registrationStep || 1;

  const value = {
    user,
    profile,
    authToken,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resumeRegistration,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
