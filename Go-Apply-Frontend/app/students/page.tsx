"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1 mt-24">

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-5xl font-bold leading-tight">
              Find Your <span className="text-primary">Perfect Program</span>
            </h2>

            <p className="text-muted-foreground mt-4 text-lg">
              Explore top universities and start your study abroad journey.
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
              className="w-80 h-auto rounded-xl shadow-lg object-cover"
              alt="Student"
            />
          </div>
        </section>

        {/* 6 STEPS SECTION */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-center mb-12">
              6 Steps to Study Abroad
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Register", desc: "Create your GoApply account in minutes." },
                { step: "2", title: "Find a Program", desc: "Explore 1000+ universities worldwide." },
                { step: "3", title: "Prepare Documents", desc: "Upload your academic & personal documents." },
                { step: "4", title: "Submit Application", desc: "Apply to programs easily." },
                { step: "5", title: "Pay Application Fee", desc: "Make secure payments with Razorpay." },
                { step: "6", title: "Enroll", desc: "Get accepted and begin your global journey!" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-xl shadow hover:shadow-md transition"
                >
                  <div className="text-primary text-4xl font-bold">{item.step}</div>
                  <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
                  <p className="text-muted-foreground mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}