"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { FIELD_OF_STUDY_OPTIONS, NATIONALITY_OPTIONS, UserProfile } from "@/models/user"

interface RegistrationQuestionnaireProps {
  isOpen: boolean
  userEmail: string
  onComplete: (profileData: Partial<UserProfile>) => void
  onClose: () => void
  initialStep?: number
  token?:string
}

const totalSteps = 8

export default function RegistrationQuestionnaire({ 
  isOpen, 
  userEmail, 
  onComplete, 
  onClose,
  initialStep = 1 
}: RegistrationQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({})
  // console.log("Options:", FIELD_OF_STUDY_OPTIONS)


  const backgroundImage = currentStep >= 4 ? '/australia.jpg' : '/Landscape.jpg'
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(profileData)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' && currentStep < totalSteps) {
      handleNext()
    } else if (e.key === 'ArrowLeft' && currentStep > 1) {
      handleBack()
    }
  }

  const updateProfileData = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Load saved progress if resuming
  
  useEffect(() => {
    if (isOpen && initialStep > 1) {
      const savedProfile = localStorage.getItem("tempProfile");
      // console.log(" Saved profile from localStorage:", savedProfile);
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          // console.log("✅ Parsed profile:", parsed);
            (parsed);
        } catch (err) {
           console.error(" Failed to parse tempProfile:", err);
        }
      } else {
        // console.warn(" No tempProfile found in localStorage");
      }
    }
  }, [isOpen, initialStep])

  // Save progress as user fills out the form
  useEffect(() => {
    if (Object.keys(profileData).length > 0) {
      localStorage.setItem('tempProfile', JSON.stringify(profileData))
    }
  }, [profileData])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentStep, isOpen])

  if (!isOpen) return null

  const renderQuestion = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto rounded-lg bg-primary/20 backdrop-blur flex items-center justify-center mb-6">
              <img src="/img1.png" alt="Field of Study" className="w-16 h-16 object-cover rounded" />
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">What's your field of study?</h2>
              <Select 
                value={profileData.fieldOfStudy} 
                onValueChange={(value) => {
                  // console.log("onValueChange triggered with:", value)
                    updateProfileData('fieldOfStudy', value)}}
              >
                <SelectTrigger className="w-full bg-background/50 backdrop-blur border-border/50">
                  <SelectValue placeholder="Select field of study" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OF_STUDY_OPTIONS.map((field) => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto rounded-lg bg-primary/20 backdrop-blur flex items-center justify-center mb-6">
              <img src="/img2.png" alt="Study Level" className="w-16 h-16 object-cover rounded" />
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">What is your intended level of study?</h2>
              <RadioGroup 
                value={profileData.studyLevel} 
                onValueChange={(value) => updateProfileData('studyLevel', value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-background/50 backdrop-blur border border-border/50">
                  <RadioGroupItem value="masters" id="masters" />
                  <Label htmlFor="masters" className="flex-1 cursor-pointer">Master's/Post Graduate</Label>
                </div>
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-background/50 backdrop-blur border border-border/50">
                  <RadioGroupItem value="bachelors" id="bachelors" />
                  <Label htmlFor="bachelors" className="flex-1 cursor-pointer">Bachelor's Degree</Label>
                </div>
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-background/50 backdrop-blur border border-border/50">
                  <RadioGroupItem value="diploma" id="diploma" />
                  <Label htmlFor="diploma" className="flex-1 cursor-pointer">College Diploma/Certificate</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto rounded-lg bg-primary/20 backdrop-blur flex items-center justify-center mb-6">
              <img src="/img3.png" alt="Nationality" className="w-16 h-16 object-cover rounded" />
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">What's your nationality?</h2>
              <Select 
                value={profileData.nationality} 
                onValueChange={(value) => updateProfileData('nationality', value)}
              >
                <SelectTrigger className="w-full bg-background/50 backdrop-blur border-border/50">
                  <SelectValue placeholder="Select your nationality" />
                </SelectTrigger>
                <SelectContent>
                  {NATIONALITY_OPTIONS.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto rounded-lg bg-primary/20 backdrop-blur flex items-center justify-center mb-6">
              <img src="/img4.png" alt="English Proficiency" className="w-16 h-16 object-cover rounded" />
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">English Proficiency</h2>
              <p className="text-muted-foreground">Do you have any English test results?</p>
              <RadioGroup 
                value={profileData.englishProficiency?.hasTestResults ? 'yes' : 'no'} 
                onValueChange={(value) => {
                  const hasTestResults = value === 'yes'
                  updateProfileData('englishProficiency', {
                    ...profileData.englishProficiency,
                    hasTestResults
                  })
                }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-background/50 backdrop-blur border border-border/50">
                  <RadioGroupItem value="yes" id="has-test" />
                  <Label htmlFor="has-test" className="flex-1 cursor-pointer">Yes, I have test results</Label>
                </div>
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-background/50 backdrop-blur border border-border/50">
                  <RadioGroupItem value="no" id="no-test" />
                  <Label htmlFor="no-test" className="flex-1 cursor-pointer">No, I don't have test results</Label>
                </div>
              </RadioGroup>

              {profileData.englishProficiency?.hasTestResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mt-6"
                >
                  <Select 
                    value={profileData.englishProficiency?.examType} 
                    onValueChange={(value) => updateProfileData('englishProficiency', {
                      ...profileData.englishProficiency,
                      examType: value
                    })}
                  >
                    <SelectTrigger className="w-full bg-background/50 backdrop-blur border-border/50">
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IELTS">IELTS</SelectItem>
                      <SelectItem value="TOEFL">TOEFL</SelectItem>
                      <SelectItem value="PTE">PTE</SelectItem>
                      <SelectItem value="Duolingo">Duolingo</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Enter your exam score"
                    value={profileData.englishProficiency?.examScore || ''}
                    onChange={(e) => updateProfileData('englishProficiency', {
                      ...profileData.englishProficiency,
                      examScore: e.target.value
                    })}
                    className="bg-background/50 backdrop-blur border-border/50"
                  />
                </motion.div>
              )}

              {profileData.englishProficiency?.hasTestResults === false && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Select 
                    value={profileData.englishProficiency?.proficiencyLevel} 
                    onValueChange={(value) => updateProfileData('englishProficiency', {
                      ...profileData.englishProficiency,
                      proficiencyLevel: value
                    })}
                  >
                    <SelectTrigger className="w-full bg-background/50 backdrop-blur border-border/50">
                      <SelectValue placeholder="Select proficiency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Native">Native</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto rounded-lg bg-primary/20 backdrop-blur flex items-center justify-center mb-6">
              <img src="/img5.jpg" alt="Available Funds" className="w-16 h-16 object-cover rounded" />
            </div>
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">Available funds for tuition and living expenses abroad?</h2>
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-3xl font-bold text-primary">
                    ${profileData.availableFunds?.toLocaleString() || '10,000'}
                  </span>
                  <span className="text-muted-foreground ml-2">USD</span>
                </div>
                <Slider
                  value={[profileData.availableFunds || 10000]}
                  onValueChange={(value) => updateProfileData('availableFunds', value[0])}
                  max={50000}
                  min={10000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$10,000</span>
                  <span>$50,000</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className={`w-24 h-24 mx-auto rounded-lg bg-primary/20 backdrop-blur flex items-center justify-center mb-6 relative ${
              profileData.visaRefusalHistory?.hasBeenRefused === false ? 'opacity-50' : ''
            }`}>
              <img src="/img6.jpg" alt="Visa History" className="w-16 h-16 object-cover rounded" />
              {profileData.visaRefusalHistory?.hasBeenRefused === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <span className="text-white text-xs font-semibold px-2 py-1 bg-primary rounded">Great!</span>
                </div>
              )}
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Have you ever been refused a visa?</h2>
              <RadioGroup 
                value={profileData.visaRefusalHistory?.hasBeenRefused ? 'yes' : 'no'} 
                onValueChange={(value) => {
                  const hasBeenRefused = value === 'yes'
                  updateProfileData('visaRefusalHistory', {
                    hasBeenRefused
                  })
                }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-background/50 backdrop-blur border border-border/50">
                  <RadioGroupItem value="no" id="no-refusal" />
                  <Label htmlFor="no-refusal" className="flex-1 cursor-pointer">No, I have never been refused a visa</Label>
                </div>
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-background/50 backdrop-blur border border-border/50">
                  <RadioGroupItem value="yes" id="yes-refusal" />
                  <Label htmlFor="yes-refusal" className="flex-1 cursor-pointer">Yes, I have been refused before</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto rounded-lg bg-primary/20 backdrop-blur flex items-center justify-center mb-6">
              <img src="/img7.png" alt="Start Date" className="w-16 h-16 object-cover rounded" />
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">When do you want to start your studies?</h2>
              <Input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={profileData.intendedStartDate ? new Date(profileData.intendedStartDate).toISOString().split('T')[0] : ''}
                onChange={(e) => updateProfileData('intendedStartDate', new Date(e.target.value))}
                className="bg-background/50 backdrop-blur border-border/50"
              />
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto rounded-lg bg-primary/20 backdrop-blur flex items-center justify-center mb-6">
              <img src="/img8.png" alt="Education Level" className="w-16 h-16 object-cover rounded" />
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Highest Level of Education</h2>
              <RadioGroup 
                value={profileData.education?.highestLevel} 
                onValueChange={(value) => updateProfileData('education', {
                  ...profileData.education,
                  highestLevel: value
                })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-background/50 backdrop-blur border border-border/50">
                  <RadioGroupItem value="graduated" id="graduated" />
                  <Label htmlFor="graduated" className="flex-1 cursor-pointer">I have graduated</Label>
                </div>
                <div className="flex items-center space-x-2 p-4 rounded-lg bg-background/50 backdrop-blur border border-border/50">
                  <RadioGroupItem value="studying" id="studying" />
                  <Label htmlFor="studying" className="flex-1 cursor-pointer">I am still studying</Label>
                </div>
              </RadioGroup>

              {profileData.education?.highestLevel === 'studying' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mt-6"
                >
                  <Select 
                    value={profileData.education?.country} 
                    onValueChange={(value) => updateProfileData('education', {
                      ...profileData.education,
                      country: value
                    })}
                  >
                    <SelectTrigger className="w-full bg-background/50 backdrop-blur border-border/50">
                      <SelectValue placeholder="Country of education" />
                    </SelectTrigger>
                    <SelectContent>
                      {NATIONALITY_OPTIONS.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={profileData.education?.level} 
                    onValueChange={(value) => updateProfileData('education', {
                      ...profileData.education,
                      level: value
                    })}
                  >
                    <SelectTrigger className="w-full bg-background/50 backdrop-blur border-border/50">
                      <SelectValue placeholder="Education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>

                  {profileData.education?.level === 'primary' && (
                    <Select 
                      value={profileData.education?.grade} 
                      onValueChange={(value) => updateProfileData('education', {
                        ...profileData.education,
                        grade: value
                      })}
                    >
                      <SelectTrigger className="w-full bg-background/50 backdrop-blur border-border/50">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 8}, (_, i) => (
                          <SelectItem key={i+1} value={`Grade ${i+1}`}>Grade {i+1}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {profileData.education?.level === 'secondary' && (
                    <Select 
                      value={profileData.education?.grade} 
                      onValueChange={(value) => updateProfileData('education', {
                        ...profileData.education,
                        grade: value
                      })}
                    >
                      <SelectTrigger className="w-full bg-background/50 backdrop-blur border-border/50">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grade 9">Grade 9</SelectItem>
                        <SelectItem value="Grade 10">Grade 10</SelectItem>
                        <SelectItem value="Grade 11">Grade 11</SelectItem>
                        <SelectItem value="Grade 12">Grade 12</SelectItem>
                        <SelectItem value="High School">High School</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </motion.div>
              )}

              <div className="mt-6 space-y-4">
                <Label className="text-base font-semibold">What standardized tests have you taken within the last 5 years?</Label>
                <div className="space-y-2">
                  {['GMAT', 'GRE', 'None'].map((test) => (
                    <div key={test} className="flex items-center space-x-2 p-3 rounded-lg bg-background/50 backdrop-blur border border-border/50">
                      <input
                        type="checkbox"
                        id={test}
                        checked={profileData.standardizedTests?.includes(test as any) || false}
                        onChange={(e) => {
                          const currentTests = profileData.standardizedTests || []
                          if (e.target.checked) {
                            updateProfileData('standardizedTests', [...currentTests, test])
                          } else {
                            updateProfileData('standardizedTests', currentTests.filter(t => t !== test))
                          }
                        }}
                        className="rounded border-border"
                      />
                      <Label htmlFor={test} className="flex-1 cursor-pointer">{test}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-[150]">
      {/* Background */}
      <motion.div
        key={backgroundImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="h-2 bg-background/20">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8"
        >
          <AnimatePresence mode="wait">
            {renderQuestion()}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="bg-background/50 backdrop-blur border-border/50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <span className="text-sm text-muted-foreground">
              {currentStep} of {totalSteps}
            </span>

            <Button
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {currentStep === totalSteps ? 'Complete' : 'Next'}
              {currentStep !== totalSteps && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}