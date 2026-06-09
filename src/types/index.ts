export type JobStatus = 'pending' | 'applied' | 'interview' | 'offer' | 'rejected';
export type InterviewRound = 'phone' | 'tech' | 'hr' | 'leader' | 'final' | 'onsite';
export type ScheduleType = 'interview' | 'written' | 'meeting' | 'deadline';

export interface Contact {
  name: string;
  position: string;
  phone: string;
  email: string;
}

export interface InterviewRecord {
  id: string;
  round: InterviewRound;
  roundName: string;
  date: string;
  time: string;
  location: string;
  interviewer: string;
  result: 'pass' | 'fail' | 'pending';
  notes: string;
}

export interface Job {
  id: string;
  company: string;
  position: string;
  industry: string;
  city: string;
  channel: string;
  salaryMin: number;
  salaryMax: number;
  status: JobStatus;
  appliedDate: string;
  description: string;
  contacts: Contact[];
  interviews: InterviewRecord[];
  resumeVersion: string;
  review: string;
  tags: string[];
}

export interface Schedule {
  id: string;
  jobId: string;
  jobName: string;
  company: string;
  type: ScheduleType;
  typeName: string;
  date: string;
  time: string;
  location: string;
  notes: string;
  isCompleted: boolean;
}

export interface Resume {
  id: string;
  name: string;
  version: string;
  targetIndustry: string;
  uploadDate: string;
  fileUrl: string;
  usedCount: number;
  description: string;
}

export interface StatData {
  totalJobs: number;
  pendingJobs: number;
  interviewJobs: number;
  offerJobs: number;
  rejectedJobs: number;
  conversionRate: number;
  cityDistribution: { city: string; count: number }[];
  industryDistribution: { industry: string; count: number }[];
  weeklyTrend: { date: string; count: number }[];
  stageFunnel: { stage: string; count: number }[];
}
