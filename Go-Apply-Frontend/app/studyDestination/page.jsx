"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import React from "react";

export default function StudyDestinationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER */}
      <Navbar />

      {/* MAIN */}
      <main className="flex-1 mt-24">

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-5xl font-bold leading-tight">
              Study in <span className="text-primary">Australia</span>
            </h2>

            <p className="text-muted-foreground mt-4 text-lg">
              Explore top universities, world-class education, and a vibrant international student
              experience in Australia.
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="https://images.pexels.com/photos/3182764/pexels-photo-3182764.jpeg"
              className="w-80 h-auto rounded-xl shadow-lg object-cover"
              alt="Australia campus"
            />
          </div>
        </section>

        {/* WHY AUSTRALIA SECTION */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-center mb-12">
              Why Study in Australia?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "World-Class Education",
                  desc: "Australian universities consistently rank in the global top 100.",
                },
                {
                  title: "Work Opportunities",
                  desc: "Part-time work allowed for students along with post-study work permits.",
                },
                {
                  title: "Safe & Multicultural",
                  desc: "Australia is known for its welcoming and diverse communities.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 bg-white rounded-xl shadow hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POPULAR CITIES */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Popular Study Cities
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Melbourne",
                img: "https://images.pexels.com/photos/3082431/pexels-photo-3082431.jpeg",
              },
              {
                name: "Sydney",
                img: "https://images.pexels.com/photos/2193300/pexels-photo-2193300.jpeg",
              },
              {
                name: "Brisbane",
                img: "https://images.pexels.com/photos/2525903/pexels-photo-2525903.jpeg",
              },
            ].map((city, i) => (
              <div key={i} className="bg-white rounded-xl shadow hover:shadow-md transition">
                <img
                  src={city.img}
                  className="w-full h-48 object-cover rounded-t-xl"
                  alt={city.name}
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{city.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}