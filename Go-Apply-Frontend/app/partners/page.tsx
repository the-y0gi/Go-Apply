"use client";

import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const PARTNERS = [
  { name: "Danford", desc: "Trusted pathway & admissions partner." },
  { name: "LIHE", desc: "Specialist in pathway & English programs." },
  { name: "Equals", desc: "College partner for vocational training." },
  { name: "Stanley", desc: "Student recruitment and support services." },
  { name: "Skills Australia", desc: "Career-focused vocational training partner." },
  { name: "Global Hire Education", desc: "Placement & recruitment specialists." },
  // add more partners here
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 mt-24">
        <section className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Our Partners
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            We collaborate with education providers, pathway colleges, and student
            recruitment partners worldwide to help students find the right program.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-foreground">Featured partners</h2>
            <p className="text-sm text-muted-foreground">Trusted partners & pathway providers</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {PARTNERS.map((p, i) => (
              <div
                key={p.name}
                className="flex flex-col items-start gap-4 p-6 bg-background rounded-xl border border-border/50 shadow-sm hover:shadow-md transition"
              >
                {/* Logo placeholder */}
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-none h-14 w-14 rounded-md bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                    {p.name.split(" ").map(s => s[0]).slice(0,2).join("")}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center text-muted-foreground">
            <p>
              And many more trusted partners across Australia and the world. Want to
              partner with GoApply?{" "}
              <a href="#" className="text-primary font-medium hover:underline">
                Contact us
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}