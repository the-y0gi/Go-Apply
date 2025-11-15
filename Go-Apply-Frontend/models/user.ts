export interface User {
  id: string;
  email: string;
  password?: string; // Optional for social logins
  firstName?: string;
  lastName?: string;
  profilePicture?:string;
  profileCompleted: boolean;
  registrationStep: number; // Track which step they're on (0-8)
  updatedAt?: Date;
  createdAt?: Date;
}
// for naming purposes
export interface SignUpRequest {
authToken: string;
user: User

}
//Come back for naming
export interface SignInRequest {
  authToken: string;
  user: User
}
export interface RegistrationQuestionnaire{

}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
  startYear?: string; // Add this line to include startYear
  endYear?: string;   
}

// Education type
export interface Education {
  degree: string;
  institution: string;
  graduationYear: string;
  gpa?: string;
  honors?: string;
}

// Language type
export interface Language {
  language: string;
  proficiency: string;
}
export interface UserProfile {
  userId: string;
  // Basic profile info
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  bio?: string;
  // Academic info
  fieldOfStudy?: string;
  studyLevel?: 'masters' | 'bachelors' | 'diploma';
  nationality?: string;
  englishProficiency?: {
    hasTestResults: boolean;
    examType?: 'IELTS' | 'TOEFL' | 'PTE' | 'Duolingo' | 'Other';
    examScore?: string;
    proficiencyLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
  };
  availableFunds?: number; // in USD
  visaRefusalHistory?: {
    hasBeenRefused: boolean;
    details?: string;
  };
  intendedStartDate?: Date;
  education?: {
    highestLevel: 'graduated' | 'studying';
    country?: string;
    level?: 'primary' | 'secondary' | 'undergraduate' | 'postgraduate';
    grade?: string; // For primary/secondary
    details?: string; // For undergraduate/postgraduate
  };
  educationHistory?: Education[];
  experience: Experience[];
  technicalSkills: string[];
  languages: Language[];
  achievements: string[];
  token?:string;
  
  standardizedTests?: Array<'GMAT' | 'GRE' | 'None'>;
  createdAt: Date;
  updatedAt: Date;
}

export const FIELD_OF_STUDY_OPTIONS = [
  'Business & Management',
  'Engineering & Technology',
  'Computer Science & IT',
  'Medicine & Health Sciences',
  'Arts & Humanities',
  'Social Sciences',
  'Natural Sciences',
  'Law',
  'Education',
  'Architecture & Design',
  'Agriculture & Environmental Sciences',
  'Other'
];

export const NATIONALITY_OPTIONS = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia',
  'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Ghana', 'Greece',
  'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
  'Japan', 'Jordan', 'Kenya', 'South Korea', 'Lebanon', 'Malaysia',
  'Mexico', 'Morocco', 'Nepal', 'Netherlands', 'New Zealand', 'Nigeria',
  'Norway', 'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Russia',
  'Saudi Arabia', 'Singapore', 'South Africa', 'Spain', 'Sri Lanka',
  'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'Ukraine', 'United Kingdom',
  'United States', 'Vietnam', 'Other'
];