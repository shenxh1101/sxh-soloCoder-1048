import type { Schedule } from '@/types';

export const mockSchedules: Schedule[] = [
  {
    id: 's1',
    jobId: '1',
    jobName: '前端开发工程师',
    company: '字节跳动',
    type: 'interview',
    typeName: '技术面试',
    date: '2026-06-08',
    time: '10:30',
    location: '字节北京总部A座5层',
    notes: '技术一面，准备React相关问题',
    isCompleted: false
  },
  {
    id: 's2',
    jobId: '6',
    jobName: '高级前端开发',
    company: '网易',
    type: 'interview',
    typeName: '技术面试',
    date: '2026-06-10',
    time: '10:00',
    location: '网易杭州园区',
    notes: '技术二面，需要准备系统设计',
    isCompleted: false
  },
  {
    id: 's3',
    jobId: '10',
    jobName: '高级前端工程师',
    company: '蚂蚁集团',
    type: 'interview',
    typeName: '技术面试',
    date: '2026-06-09',
    time: '14:00',
    location: '蚂蚁Z空间',
    notes: '技术一面',
    isCompleted: false
  },
  {
    id: 's4',
    jobId: '3',
    jobName: '前端开发',
    company: '腾讯',
    type: 'deadline',
    typeName: 'Offer截止',
    date: '2026-06-15',
    time: '18:00',
    location: '',
    notes: '需要在截止日前回复是否接受Offer',
    isCompleted: false
  },
  {
    id: 's5',
    jobId: '5',
    jobName: '前端开发工程师',
    company: '京东',
    type: 'deadline',
    typeName: '投递截止',
    date: '2026-06-10',
    time: '23:59',
    location: '',
    notes: '内推码有效期截止',
    isCompleted: false
  },
  {
    id: 's6',
    jobId: '2',
    jobName: '高级前端工程师',
    company: '阿里巴巴',
    type: 'written',
    typeName: '在线笔试',
    date: '2026-06-12',
    time: '19:00',
    location: '线上',
    notes: '前端算法笔试，准备LeetCode',
    isCompleted: false
  },
  {
    id: 's7',
    jobId: '8',
    jobName: '前端架构师',
    company: '百度',
    type: 'meeting',
    typeName: '猎头沟通',
    date: '2026-06-09',
    time: '16:00',
    location: '电话',
    notes: '了解岗位详情和薪资范围',
    isCompleted: false
  }
];

export const typeMap: Record<string, { label: string; color: string }> = {
  interview: { label: '面试', color: '#5B6FFF' },
  written: { label: '笔试', color: '#165DFF' },
  meeting: { label: '会议', color: '#722ED1' },
  deadline: { label: '截止', color: '#F53F3F' }
};
