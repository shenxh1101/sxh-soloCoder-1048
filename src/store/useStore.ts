import { create } from 'zustand';
import Taro from '@tarojs/taro';
import type { Job, Schedule, Resume, StatData } from '@/types';
import { mockJobs } from '@/data/mockJobs';
import { mockSchedules } from '@/data/mockSchedules';
import { mockResumes } from '@/data/mockResumes';
import dayjs from 'dayjs';

const STORAGE_KEYS = {
  JOBS: 'job_tracker_jobs',
  SCHEDULES: 'job_tracker_schedules',
  RESUMES: 'job_tracker_resumes',
  INITIALIZED: 'job_tracker_initialized'
};

const getStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const data = Taro.getStorageSync(key);
    return data ? (JSON.parse(data) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStoredData = <T>(key: string, data: T): void => {
  try {
    Taro.setStorageSync(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
};

const calculateStats = (jobs: Job[]): StatData => {
  const totalJobs = jobs.length;
  const pendingJobs = jobs.filter((j) => j.status === 'pending').length;
  const interviewJobs = jobs.filter((j) => j.status === 'interview').length;
  const offerJobs = jobs.filter((j) => j.status === 'offer').length;
  const rejectedJobs = jobs.filter((j) => j.status === 'rejected').length;
  const appliedJobs = jobs.filter((j) => j.status !== 'pending').length;
  const conversionRate = appliedJobs > 0
    ? Math.round((interviewJobs / appliedJobs) * 100)
    : 0;

  const cityMap = new Map<string, number>();
  const industryMap = new Map<string, number>();
  jobs.forEach((job) => {
    cityMap.set(job.city, (cityMap.get(job.city) || 0) + 1);
    industryMap.set(job.industry, (industryMap.get(job.industry) || 0) + 1);
  });

  const cityDistribution = Array.from(cityMap.entries())
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);

  const industryDistribution = Array.from(industryMap.entries())
    .map(([industry, count]) => ({ industry, count }))
    .sort((a, b) => b.count - a.count);

  const weeklyTrend: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    const count = jobs.filter((j) => j.appliedDate === date).length;
    weeklyTrend.push({ date, count });
  }

  const stageFunnel = [
    { stage: '已投递', count: appliedJobs },
    { stage: '面试中', count: interviewJobs },
    { stage: '已Offer', count: offerJobs },
    { stage: '已拒绝', count: rejectedJobs }
  ];

  return {
    totalJobs,
    pendingJobs,
    interviewJobs,
    offerJobs,
    rejectedJobs,
    conversionRate,
    cityDistribution,
    industryDistribution,
    weeklyTrend,
    stageFunnel
  };
};

const initializeData = () => {
  const initialized = Taro.getStorageSync(STORAGE_KEYS.INITIALIZED);
  if (!initialized) {
    setStoredData(STORAGE_KEYS.JOBS, mockJobs);
    setStoredData(STORAGE_KEYS.SCHEDULES, mockSchedules);
    setStoredData(STORAGE_KEYS.RESUMES, mockResumes);
    Taro.setStorageSync(STORAGE_KEYS.INITIALIZED, 'true');
    return { jobs: mockJobs, schedules: mockSchedules, resumes: mockResumes };
  }
  return {
    jobs: getStoredData(STORAGE_KEYS.JOBS, mockJobs),
    schedules: getStoredData(STORAGE_KEYS.SCHEDULES, mockSchedules),
    resumes: getStoredData(STORAGE_KEYS.RESUMES, mockResumes)
  };
};

const initialData = initializeData();

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
  updateResumeUsedCount: (resumeId: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  jobs: initialData.jobs,
  schedules: initialData.schedules,
  resumes: initialData.resumes,
  stats: calculateStats(initialData.jobs),
  currentJob: null,
  currentResume: null,

  setCurrentJob: (job) => set({ currentJob: job }),
  setCurrentResume: (resume) => set({ currentResume: resume }),

  updateJobStatus: (jobId, status) =>
    set((state) => {
      const jobs = state.jobs.map((job) =>
        job.id === jobId ? { ...job, status } : job
      );
      setStoredData(STORAGE_KEYS.JOBS, jobs);
      return { jobs, stats: calculateStats(jobs) };
    }),

  toggleScheduleComplete: (scheduleId) =>
    set((state) => {
      const schedules = state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? { ...schedule, isCompleted: !schedule.isCompleted }
          : schedule
      );
      setStoredData(STORAGE_KEYS.SCHEDULES, schedules);
      return { schedules };
    }),

  addJob: (job) =>
    set((state) => {
      const jobs = [job, ...state.jobs];
      setStoredData(STORAGE_KEYS.JOBS, jobs);
      return { jobs, stats: calculateStats(jobs) };
    }),

  addSchedule: (schedule) =>
    set((state) => {
      const schedules = [...state.schedules, schedule];
      setStoredData(STORAGE_KEYS.SCHEDULES, schedules);
      return { schedules };
    }),

  addResume: (resume) =>
    set((state) => {
      const resumes = [resume, ...state.resumes];
      setStoredData(STORAGE_KEYS.RESUMES, resumes);
      return { resumes };
    }),

  updateResumeUsedCount: (resumeId) =>
    set((state) => {
      const resumes = state.resumes.map((r) =>
        r.id === resumeId ? { ...r, usedCount: r.usedCount + 1 } : r
      );
      setStoredData(STORAGE_KEYS.RESUMES, resumes);
      return { resumes };
    })
}));
