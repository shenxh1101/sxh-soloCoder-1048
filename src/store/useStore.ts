import { create } from 'zustand';
import type { Job, Schedule, Resume, StatData } from '@/types';
import { mockJobs } from '@/data/mockJobs';
import { mockSchedules } from '@/data/mockSchedules';
import { mockResumes } from '@/data/mockResumes';
import { mockStats } from '@/data/mockStats';

interface AppState {
  jobs: Job[];
  schedules: Schedule[];
  resumes: Resume[];
  stats: StatData;
  currentJob: Job | null;
  currentResume: Resume | null;
  setCurrentJob: (job: Job | null) => void;
  setCurrentResume: (resume: Resume | null) => void;
  updateJobStatus: (jobId: string, status: Job['status']) => void;
  toggleScheduleComplete: (scheduleId: string) => void;
  addJob: (job: Job) => void;
  addSchedule: (schedule: Schedule) => void;
  addResume: (resume: Resume) => void;
}

export const useStore = create<AppState>((set) => ({
  jobs: mockJobs,
  schedules: mockSchedules,
  resumes: mockResumes,
  stats: mockStats,
  currentJob: null,
  currentResume: null,
  setCurrentJob: (job) => set({ currentJob: job }),
  setCurrentResume: (resume) => set({ currentResume: resume }),
  updateJobStatus: (jobId, status) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === jobId ? { ...job, status } : job
      )
    })),
  toggleScheduleComplete: (scheduleId) =>
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? { ...schedule, isCompleted: !schedule.isCompleted }
          : schedule
      )
    })),
  addJob: (job) =>
    set((state) => ({
      jobs: [job, ...state.jobs]
    })),
  addSchedule: (schedule) =>
    set((state) => ({
      schedules: [...state.schedules, schedule]
    })),
  addResume: (resume) =>
    set((state) => ({
      resumes: [resume, ...state.resumes]
    }))
}));
