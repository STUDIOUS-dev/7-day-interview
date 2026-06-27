import { create } from 'zustand';
import { Job, JobCreate } from '@/types/job';
import api from '@/services/api';

interface JobFilters {
  search: string;
  type: string;
}

interface JobState {
  jobs: Job[];
  myJobs: Job[];
  selectedJob: Job | null;
  isLoading: boolean;
  isSearching: boolean;
  filters: JobFilters;
  pagination: { page: number; total: number };
  
  fetchJobs: (page?: number, filters?: JobFilters) => Promise<void>;
  fetchMyJobs: () => Promise<void>;
  fetchJobById: (id: string) => Promise<void>;
  createJob: (data: JobCreate) => Promise<void>;
  closeJob: (id: string) => Promise<void>;
  setFilters: (filters: Partial<JobFilters>) => void;
  searchJobs: (search: string, type?: string) => Promise<void>;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  myJobs: [],
  selectedJob: null,
  isLoading: false,
  isSearching: false,
  filters: { search: '', type: '' },
  pagination: { page: 1, total: 0 },

  fetchJobs: async (page = 1, filters = get().filters) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '20');
      if (filters.search?.trim()) params.set('search', filters.search.trim());
      if (filters.type) params.set('job_type', filters.type);

      const response = await api.get(`/jobs?${params.toString()}`);
      set({ jobs: response.data, isLoading: false, filters, pagination: { ...get().pagination, page } });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  searchJobs: async (search: string, type?: string) => {
    const filters: JobFilters = { search, type: type ?? get().filters.type };
    set({ isSearching: true, filters });
    try {
      const params = new URLSearchParams();
      params.set('page', '1');
      params.set('limit', '20');
      if (search.trim()) params.set('search', search.trim());
      if (filters.type) params.set('job_type', filters.type);

      const response = await api.get(`/jobs?${params.toString()}`);
      set({ jobs: response.data, isSearching: false, pagination: { page: 1, total: 0 } });
    } catch (error) {
      console.error(error);
      set({ isSearching: false });
    }
  },

  fetchMyJobs: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/jobs/mine');
      set({ myJobs: response.data, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  fetchJobById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/jobs/${id}`);
      set({ selectedJob: response.data, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  createJob: async (data: JobCreate) => {
    try {
      const response = await api.post('/jobs', data);
      set((state) => ({
        myJobs: [response.data, ...state.myJobs],
        jobs: [response.data, ...state.jobs],
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  closeJob: async (id: string) => {
    try {
      await api.delete(`/jobs/${id}/close`);
      set((state) => ({
        myJobs: state.myJobs.map((job) =>
          job.id === id ? { ...job, status: 'closed' } : job
        ),
        jobs: state.jobs.filter((job) => job.id !== id),
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
  },
}));
