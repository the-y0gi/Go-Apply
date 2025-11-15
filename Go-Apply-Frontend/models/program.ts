export interface Program {
  _id: string;
  name: string;
  degreeType?: string;
  fieldOfStudy?: string;
  duration?: string;
  applicationDeadline?: string;
  tuitionFee?: {
    amount?: number;
    currency?: string;
  };
  requirements?: string[];
  tags?: string[];
  rating?: number;
  ranking?: string | number;
  universityId?: {
    _id?: string;
    name?: string;
    country?: string;
    city?: string;
    logoUrl?: string;
    ranking?: {
      global?: number;
    };
  };
  intake?: {
    season: string;
    year: number;
  }[];
}
export interface University {
  id: string;
  universityId: string;
  university: string;
  program: string;
  city: string;
  state: string;
  duration: string;
  tuition: string;
  ranking: string;
  rating: string;
  deadline: string;
  requirements: string[];
  tags: string[];
  intake?: {
    season: string;
    year: number;
  }[];
}