// Job-related type definitions
export interface Job {
  id: string;
  employer_id: string;
  employer_name?: string;
  title: string;
  description: string;
  requirements: string[];
  location?: string | null;
  job_type: 'full_time' | 'part_time' | 'contract' | 'remote';
  salary_range?: string | null;
  status: 'open' | 'closed';
  ats_threshold: number;
  created_at: string;
}

export interface JobCreate {
  title: string;
  description: string;
  requirements: string[];
  location?: string | null;
  job_type: 'full_time' | 'part_time' | 'contract' | 'remote';
  salary_range?: string | null;
  ats_threshold: number;
}
