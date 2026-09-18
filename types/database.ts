export interface SubjectRecord {
  id: string;
  name: string;
  units: number;
  grade: number;
}

export interface SavedCalculationRow {
  id: string;
  user_id: string;
  name: string | null;
  grading_system_id: string;
  gwa: number;
  total_units: number;
  subjects: SubjectRecord[];
  semester: string | null;
  academic_year: string | null;
  school_or_program: string | null;
  created_at: string;
}
