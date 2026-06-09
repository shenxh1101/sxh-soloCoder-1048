import type { StatData } from '@/types';

export const mockStats: StatData = {
  totalJobs: 10,
  pendingJobs: 2,
  interviewJobs: 3,
  offerJobs: 1,
  rejectedJobs: 1,
  conversionRate: 45,
  cityDistribution: [
    { city: '北京', count: 6 },
    { city: '杭州', count: 3 },
    { city: '深圳', count: 1 }
  ],
  industryDistribution: [
    { industry: '互联网', count: 3 },
    { industry: '电商', count: 2 },
    { industry: '游戏', count: 2 },
    { industry: '金融', count: 1 },
    { industry: '人工智能', count: 1 },
    { industry: '出行', count: 1 }
  ],
  weeklyTrend: [
    { date: '06/03', count: 2 },
    { date: '06/04', count: 1 },
    { date: '06/05', count: 3 },
    { date: '06/06', count: 2 },
    { date: '06/07', count: 1 },
    { date: '06/08', count: 2 },
    { date: '06/09', count: 1 }
  ],
  stageFunnel: [
    { stage: '已投递', count: 10 },
    { stage: '简历筛选', count: 7 },
    { stage: '面试中', count: 5 },
    { stage: '面试通过', count: 2 },
    { stage: '已Offer', count: 1 }
  ]
};
