"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function SmoothCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const xSpring = useSpring(x, { stiffness: 300, damping: 25, mass: 0.5 })
  const ySpring = useSpring(y, { stiffness: 300, damping: 25, mass: 0.5 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener("mousemove", handler, { passive: true })
    return () => window.removeEventListener("mousemove", handler)
  }, [x, y])

  return (
    <motion.div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
      style={{ translateX: xSpring, translateY: ySpring }}
    >
      {/* outer glow */}
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <div className="h-10 w-10 rounded-full bg-primary/30 blur-xl" />
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/70 border-2 border-black" />
      </div>
    </motion.div>
  )
}
