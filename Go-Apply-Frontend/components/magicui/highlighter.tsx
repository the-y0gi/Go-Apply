"use client"

import { useEffect, useRef } from "react"
import type React from "react"
import { useInView } from "motion/react"
import { annotate } from "rough-notation"
import { type RoughAnnotation } from "rough-notation/lib/model"

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket"

interface HighlighterProps {
  children: React.ReactNode
  action?: AnnotationAction
  color?: string
  strokeWidth?: number
  animationDuration?: number
  iterations?: number
  padding?: number
  multiline?: boolean
  isView?: boolean
  isParentAnimated?: boolean // <-- 1. Add the new prop
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
  isParentAnimated = true, // <-- 2. Set default value for standalone use
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const annotationRef = useRef<RoughAnnotation | null>(null)

  const isInView = useInView(elementRef, {
    once: false,
    margin: "-10%",
  })

  // 3. Modify the condition to also check if the parent animation is complete
  const shouldShow = (!isView || isInView) && isParentAnimated

  useEffect(() => {
    let resizeObserver: ResizeObserver
    if (shouldShow) {
      const element = elementRef.current
      if (element) {
        // Remove any existing annotation before creating a new one
        annotationRef.current?.remove()
        const annotationConfig = {
          type: action,
          color,
          strokeWidth,
          animationDuration,
          iterations,
          padding,
          multiline,
        }
        const annotation = annotate(element, annotationConfig)
        annotationRef.current = annotation
        annotation.show()
        // Re-annotate on resize
        resizeObserver = new ResizeObserver(() => {
          annotation.hide()
          annotation.show()
        })
        resizeObserver.observe(element)
      }
    }
    return () => {
      // Clean up annotation and observer on every effect run
      annotationRef.current?.remove()
      if (resizeObserver) resizeObserver.disconnect()
    }
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
    isParentAnimated,
  ])

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent">
      {children}
    </span>
  )
}