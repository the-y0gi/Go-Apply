export interface Application {
  _id: string;
  universityId: {
    name: string;
    country: string;
    city: string;
    logoUrl?: string;
  };
  programId: {
    name: string;
    degreeType: string;
    fieldOfStudy: string;
    tuitionFee: {
      amount: number;
      currency: string;
    };
    duration: string;
  };
  status: string;
  progress: {
    personalInfo: boolean;
    academicInfo: boolean;
    documents: boolean;
    submitted: boolean;
  };
  documents: string[];
  missingDocuments: string[];
  submittedAt?: string;
  deadline: string;
  applicationFee: number;
  lastUpdate?: string;
  createdAt: string;
  updatedAt: string;
}