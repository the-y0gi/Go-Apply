"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CardContainer, CardBody, CardItem } from "@/components/ui/three-d-card"

type Tab = "programs" | "services"

const StepCard = ({
  index,
  title,
  description,
  imageUrl,
}: {
  index: number
  title: string
  description: string
  imageUrl: string
}) => {
  return (
    <CardContainer className="w-full">
      <CardBody className="group relative w-full rounded-2xl border border-border bg-card/80 p-5 backdrop-blur">
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-border/40 pointer-events-none" />
        
        {/* Image */}
        <CardItem translateZ={12} className="mb-4">
          <div className="relative h-32 w-full rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ 
                objectPosition: '60% center',
                objectFit: 'cover'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </CardItem>

        <div className="flex items-start gap-4">
          <div className="h-8 w-8 shrink-0 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm font-semibold">
            {index}
          </div>
          <div className="space-y-1">
            <CardItem translateZ={8} className="text-lg font-medium">
              {title}
            </CardItem>
            <CardItem translateZ={4} as="p" className="text-sm text-muted-foreground max-w-prose">
              {description}
            </CardItem>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  )
}

export default function HowItWorks() {
  const [tab, setTab] = useState<Tab>("programs")

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          className="text-center text-3xl md:text-4xl font-semibold mb-6"
        >
          How it works?
        </motion.h2>

        <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-border bg-card/70 p-1 backdrop-blur">
          {(["programs", "services"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "px-4 py-1 text-sm rounded-full transition-colors",
                tab === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={tab === key}
            >
              {key[0].toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StepCard
            index={1}
            title={tab === "programs" ? "Explore Programs" : "Plan Your Application"}
            description={
              tab === "programs"
                ? "Search by country, degree level, intake, tuition, and requirements."
                : "Review timelines, fees, and document checklists tailored to your target schools."
            }
            imageUrl={tab === "programs" 
              ? "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&crop=center" 
              : "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop&crop=center"
            }
          />
          <StepCard
            index={2}
            title={tab === "programs" ? "Check Eligibility" : "Build Your Services"}
            description={
              tab === "programs"
                ? "Instant checks for academic, language, and visa criteria."
                : "Add services like SOP review, document prep, and counseling with clear pricing."
            }
            imageUrl={tab === "programs" 
              ? "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center" 
              : "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop&crop=center"
            }
          />
          <StepCard
            index={3}
            title={tab === "programs" ? "Apply & Track" : "Submit & Get Updates"}
            description={
              tab === "programs"
                ? "Submit documents with guidance and track progress in real time."
                : "Submit confidently and receive milestone notifications automatically."
            }
            imageUrl={tab === "programs" 
              ? "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center" 
              : "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=300&fit=crop&crop=center"
            }
          />
        </div>
      </div>
    </section>
  )
}
