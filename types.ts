export interface StudentData {
  fullName: string;
  studentId: string;
  school: string;
  track: string;
  profileImage: string | null;
  cohort?: string;
  expiryDate?: string;
}

export enum SchoolOption {
  Engineering = 'School of Engineering',
  Product = 'School of Product',
  Data = 'School of Data',
  Business = 'School of Business',
  Creative = 'School of Creative Economy'
}

export const SCHOOL_TRACKS: Record<SchoolOption, string[]> = {
  [SchoolOption.Engineering]: ['Frontend Engineering', 'Backend Engineering', 'Cloud Engineering', 'Cybersecurity'],
  [SchoolOption.Product]: ['Product Design', 'Product Management', 'Product Marketing'],
  [SchoolOption.Data]: ['Data Analysis', 'Data Engineering', 'Data Science'],
  [SchoolOption.Business]: ['Business Analysis', 'Digital Marketing'],
  [SchoolOption.Creative]: ['Content Creation', 'Digital Art']
};

export type IdTemplate = 'classic' | 'modern' | 'bold';