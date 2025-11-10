"use client"

import { useState } from "react" // <-- 1. Import useState
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Highlighter } from "@/components/magicui/highlighter"

export default function Hero() {
  // 2. Add state to track animation completion
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  return (
    <section className="relative mt-16 overflow-hidden min-h-[600px]">
      {/* Background Image - MainBG.png with subtle animation */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-[url('/MainBg.png')] bg-center bg-no-repeat z-0"
        style={{ 
          top: '50px', 
          left: '8px', 
          backgroundSize: '85%',
        }}
      />
      
      {/* Book.png Image - Higher z-index with floating animation */}
      <motion.div 
        initial={{ opacity: 0, y: 0 }}
        animate={{ 
          opacity: 1, 
          y: [-8, 8, -8],
        }}
        transition={{ 
          opacity: { duration: 0.8, delay: 0.3 },
          y: { 
            duration: 2.5, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut",
            times: [0, 0.2, 1, 0.8]
          }
        }}
        className="absolute inset-0 bg-[url('/Book.png')] bg-center bg-no-repeat z-100"
        style={{ bottom: '60px'}} 
      />
      
      <div className="relative z-20 mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            // 3. Set state to true when animation finishes
            onAnimationComplete={() => setIsAnimationComplete(true)}
            className="space-y-6"
          >
            <h1 className="text-balance text-4xl md:text-6xl font-semibold leading-tight">
              Find programs and{" "}
              <Highlighter 
                action="highlight" 
                color="rgb(147, 196, 165)"
                isView={true}
                animationDuration={800}
                iterations={2}
                padding={4}
                strokeWidth={2}
                // 4. Pass the state as a prop
                isParentAnimated={isAnimationComplete}
              >
                <span className="text-white">apply</span>
              </Highlighter>{" "}
              to universities worldwide
            </h1>

            <p className="text-muted-foreground max-w-prose">
              Search programs across countries, compare requirements, check eligibility, and apply with guided support.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-border bg-card/70 backdrop-blur px-4 py-2 text-sm">
                1,600+ schools
              </div>
              <div className="rounded-full border border-border bg-card/70 backdrop-blur px-4 py-2 text-sm">
                100k+ programs
              </div>
              <div className="rounded-full border border-border bg-card/70 backdrop-blur px-4 py-2 text-sm">
                24/7 tracking
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="relative z-30"
          >
            <div className="w-full rounded-xl border border-border bg-card/80 backdrop-blur p-5 shadow-lg">
              <img
                src="/images/hero.jpg"
                alt="International students on campus"
                className="mb-4 h-40 w-full rounded-lg object-cover"
              />
              <h2 className="mb-4 text-lg font-medium">Quick program search</h2>
              <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <Select>
                    <SelectTrigger id="country" aria-label="Country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="degree">Degree level</Label>
                  <Select>
                    <SelectTrigger id="degree" aria-label="Degree level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ug">Undergraduate</SelectItem>
                      <SelectItem value="pg">Postgraduate</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="intake">Intake</Label>
                  <Select>
                    <SelectTrigger id="intake" aria-label="Intake">
                      <SelectValue placeholder="Select intake" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jan">January</SelectItem>
                      <SelectItem value="may">May</SelectItem>
                      <SelectItem value="sep">September</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="budget">Max tuition (USD)</Label>
                  <Input id="budget" type="number" placeholder="e.g. 25000" />
                </div>

                <div className="md:col-span-2">
                  <Button className="w-full bg-primary text-primary-foreground">Search programs</Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
