"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef } from "react"
import { Zap, FileText, Clock, BarChart3 } from "lucide-react"
import Image from "next/image"

export default function OverlapInfo() {
  const { scrollYProgress } = useScroll()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const blur = useTransform(scrollYProgress, [0, 1], ["0px", "8px"])
  const opacity = useTransform(scrollYProgress, [0, 1], [0.85, 1])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <section 
      ref={ref}
      className="relative z-10 min-h-screen py-16 md:py-24"
    >
      <div className="max-w-7xl px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left"
        >
          <motion.h3 
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-left text-black leading-tight max-w-4xl"
          >
            Your path to a successful application
          </motion.h3>
          
          <motion.p 
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-black mb-16 max-w-3xl leading-relaxed text-left"
          >
            Stay organized and confident at every step. We guide you through research, preparation, and submission
            with clear checklists and personalized support.
          </motion.p>
          
          <motion.ul 
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid gap-8 md:grid-cols-2 max-w-5xl"
          >
              <motion.li 
                variants={itemVariants}
                className="group rounded-xl border border-gray-200 bg-white/90 backdrop-blur-lg p-8 shadow-2xl hover:shadow-3xl hover:bg-white/95 transition-all duration-500 hover:scale-105 hover:border-gray-300"
                whileHover={{ y: -8 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-black group-hover:text-gray-600 transition-colors duration-300" />
                  <span className="font-bold text-2xl text-black group-hover:text-black/50 transition-colors duration-300">Personalized shortlists</span>
                </div>
                <p className="text-black mt-2 text-lg leading-relaxed transition-colors duration-300">
                  Find the right fit based on academics, budget, and goals with AI-powered matching.
                </p>
              </motion.li>
              <motion.li 
                variants={itemVariants}
                className="group rounded-xl border border-gray-200 bg-white/90 backdrop-blur-lg p-8 shadow-2xl hover:shadow-3xl hover:bg-white/95 transition-all duration-500 hover:scale-105 hover:border-gray-300"
                whileHover={{ y: -8 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Image 
                    src="/icons/documents.svg" 
                    alt="Documents icon" 
                    width={32} 
                    height={32} 
                    className="group-hover:opacity-70 transition-opacity duration-300" 
                  />
                  <span className="font-bold text-2xl text-black group-hover:text-black/50 transition-colors duration-300">Document guidance</span>
                </div>
                <p className="text-black mt-4 text-lg leading-relaxed transition-colors duration-300">
                  Know exactly what to prepare and how to present it with expert templates and reviews.
                </p>
              </motion.li>
              <motion.li 
                variants={itemVariants}
                className="group rounded-xl border border-gray-200 bg-white/90 backdrop-blur-lg p-8 shadow-2xl hover:shadow-3xl hover:bg-white/95 transition-all duration-500 hover:scale-105 hover:border-gray-300"
                whileHover={{ y: -8 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Image 
                    src="/icons/clock.svg" 
                    alt="Documents icon" 
                    width={32} 
                    height={32} 
                    className="group-hover:opacity-70 transition-opacity duration-300" 
                  />
                  <span className="font-bold text-2xl text-black group-hover:text-black/50 transition-colors duration-300">Deadline Tracking</span>
                </div>
                <p className="text-black mt-4 text-lg leading-relaxed transition-colors duration-300">
                  Never miss an intake or scholarship opportunity with smart notifications and reminders.
                </p>
              </motion.li>
              <motion.li 
                variants={itemVariants}
                className="group rounded-xl border border-gray-200 bg-white/90 backdrop-blur-lg p-8 shadow-2xl hover:shadow-3xl hover:bg-white/95 transition-all duration-500 hover:scale-105 hover:border-gray-300"
                whileHover={{ y: -8 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Image 
                    src="/icons/progress.svg" 
                    alt="Documents icon" 
                    width={32} 
                    height={32} 
                    className="group-hover:opacity-70 transition-opacity duration-300" 
                  />
                  <span className="font-bold text-2xl text-black group-hover:text-black/50 transition-colors duration-300">Transparent Progress</span>
                </div>
                <p className="text-black mt-4 text-lg leading-relaxed transition-colors duration-300">
                  See your application status and next steps in real time with detailed progress tracking.
                </p>
              </motion.li>
            </motion.ul>
        </motion.div>
      </div>
    </section>
  )
}
