"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { SignInRequest } from "@/models/user";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


export default function SocialLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = params.get("token");
    if (!token) {
      setError("No authentication token received");
      return;
    }

    const handleSocialLogin = async () => {
      try {
        // Get user profile from backend
        const { data } = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!data.success) {
          throw new Error("Failed to fetch user profile");
        }

        const actualUser = data.data.user;
        
        const signInRequest: SignInRequest = {
          authToken: token,
          user: actualUser,
        };

        await signIn(signInRequest);
        await new Promise((resolve) => setTimeout(resolve, 200));

        if (actualUser.profileCompleted) {
          router.push("/dashboard");
        } else {
          router.push(`/?resume=${actualUser.registrationStep || 1}`);
        }
      } catch (err) {
        console.error("Social login error:", err);
        setError(err instanceof Error ? err.message : "Failed to authenticate");
      }
    };

    handleSocialLogin();
  }, [params, signIn, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="text-red-500 text-lg">{error}</div>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <div className="text-lg">Authenticating...</div>
      <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}