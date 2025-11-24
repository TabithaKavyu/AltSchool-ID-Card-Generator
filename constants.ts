import { SchoolOption, StudentData } from './types';

const currentYear = new Date().getFullYear();

export const INITIAL_STUDENT_DATA: StudentData = {
  fullName: '',
  studentId: '',
  school: SchoolOption.Engineering,
  track: 'Frontend Engineering',
  profileImage: null,
  cohort: `${currentYear}`,
  expiryDate: `Dec ${currentYear + 1}`
};

export const SCHOOLS = Object.values(SchoolOption);