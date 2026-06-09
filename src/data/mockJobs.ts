import type { Job } from '@/types';

export const mockJobs: Job[] = [
  {
    id: '1',
    company: '字节跳动',
    position: '前端开发工程师',
    industry: '互联网',
    city: '北京',
    channel: '内推',
    salaryMin: 25000,
    salaryMax: 40000,
    status: 'interview',
    appliedDate: '2026-06-01',
    description: '负责抖音电商平台的前端开发工作，参与产品需求分析、技术方案设计和代码实现。',
    contacts: [
      { name: '李经理', position: 'HRBP', phone: '138****1234', email: 'lihr@bytedance.com' },
      { name: '王工', position: '技术主管', phone: '139****5678', email: 'wangtech@bytedance.com' }
    ],
    interviews: [
      {
        id: 'i1',
        round: 'phone',
        roundName: '电话一面',
        date: '2026-06-05',
        time: '14:00',
        location: '飞书会议',
        interviewer: '张工程师',
        result: 'pass',
        notes: '主要问了React基础和算法，整体感觉良好'
      },
      {
        id: 'i2',
        round: 'tech',
        roundName: '技术一面',
        date: '2026-06-08',
        time: '10:30',
        location: '字节北京总部A座5层',
        interviewer: '王技术主管',
        result: 'pending',
        notes: '待面试'
      }
    ],
    resumeVersion: 'v1.2-互联网方向',
    review: '公司氛围好，技术栈先进，是理想的选择',
    tags: ['大厂', 'React', '高薪']
  },
  {
    id: '2',
    company: '阿里巴巴',
    position: '高级前端工程师',
    industry: '电商',
    city: '杭州',
    channel: 'BOSS直聘',
    salaryMin: 30000,
    salaryMax: 50000,
    status: 'applied',
    appliedDate: '2026-06-03',
    description: '负责淘宝商家后台系统的前端架构设计和核心功能开发。',
    contacts: [
      { name: '赵HR', position: '招聘专员', phone: '137****9012', email: 'zhaohr@alibaba.com' }
    ],
    interviews: [],
    resumeVersion: 'v1.2-互联网方向',
    review: '',
    tags: ['电商', '架构']
  },
  {
    id: '3',
    company: '腾讯',
    position: '前端开发',
    industry: '游戏',
    city: '深圳',
    channel: '官网投递',
    salaryMin: 28000,
    salaryMax: 45000,
    status: 'offer',
    appliedDate: '2026-05-20',
    description: '负责微信小游戏平台的前端开发工作。',
    contacts: [
      { name: '陈HR', position: '招聘经理', phone: '136****3456', email: 'chenhr@tencent.com' }
    ],
    interviews: [
      {
        id: 'i3',
        round: 'phone',
        roundName: '电话面试',
        date: '2026-05-25',
        time: '15:00',
        location: '腾讯会议',
        interviewer: '刘工程师',
        result: 'pass',
        notes: '基础扎实'
      },
      {
        id: 'i4',
        round: 'tech',
        roundName: '技术一面',
        date: '2026-05-28',
        time: '10:00',
        location: '腾讯大厦',
        interviewer: '周主管',
        result: 'pass',
        notes: '项目经验丰富'
      },
      {
        id: 'i5',
        round: 'hr',
        roundName: 'HR面',
        date: '2026-06-02',
        time: '14:00',
        location: '腾讯大厦',
        interviewer: '陈HR',
        result: 'pass',
        notes: '薪资沟通顺利'
      }
    ],
    resumeVersion: 'v1.1-游戏方向',
    review: '薪资35K*16，福利待遇好，但工作强度较大',
    tags: ['游戏', '大厂', 'Offer']
  },
  {
    id: '4',
    company: '美团',
    position: '前端工程师',
    industry: '本地生活',
    city: '北京',
    channel: '拉勾网',
    salaryMin: 22000,
    salaryMax: 35000,
    status: 'rejected',
    appliedDate: '2026-05-15',
    description: '负责美团外卖商家端的前端开发。',
    contacts: [],
    interviews: [
      {
        id: 'i6',
        round: 'phone',
        roundName: '电话面试',
        date: '2026-05-18',
        time: '16:00',
        location: '电话',
        interviewer: '孙工程师',
        result: 'fail',
        notes: '算法题没做出来'
      }
    ],
    resumeVersion: 'v1.0',
    review: '算法准备不足，需要加强LeetCode练习',
    tags: ['本地生活']
  },
  {
    id: '5',
    company: '京东',
    position: '前端开发工程师',
    industry: '电商',
    city: '北京',
    channel: '内推',
    salaryMin: 24000,
    salaryMax: 38000,
    status: 'pending',
    appliedDate: '2026-06-07',
    description: '负责京东商城营销活动页面的前端开发。',
    contacts: [],
    interviews: [],
    resumeVersion: 'v1.2-互联网方向',
    review: '',
    tags: ['电商', '内推']
  },
  {
    id: '6',
    company: '网易',
    position: '高级前端开发',
    industry: '游戏',
    city: '杭州',
    channel: 'BOSS直聘',
    salaryMin: 28000,
    salaryMax: 42000,
    status: 'interview',
    appliedDate: '2026-05-28',
    description: '负责网易云音乐Web端的前端开发和性能优化。',
    contacts: [
      { name: '吴HR', position: '招聘专员', phone: '135****7890', email: 'wuhr@netease.com' }
    ],
    interviews: [
      {
        id: 'i7',
        round: 'phone',
        roundName: '电话一面',
        date: '2026-06-02',
        time: '11:00',
        location: '网易会议',
        interviewer: '郑工程师',
        result: 'pass',
        notes: '性能优化经验丰富'
      },
      {
        id: 'i8',
        round: 'tech',
        roundName: '技术一面',
        date: '2026-06-06',
        time: '15:30',
        location: '网易杭州园区',
        interviewer: '冯主管',
        result: 'pass',
        notes: '对音乐产品有热情'
      },
      {
        id: 'i9',
        round: 'tech',
        roundName: '技术二面',
        date: '2026-06-10',
        time: '10:00',
        location: '网易杭州园区',
        interviewer: '陈总监',
        result: 'pending',
        notes: '待面试'
      }
    ],
    resumeVersion: 'v1.2-互联网方向',
    review: '喜欢网易的产品文化',
    tags: ['音乐', '杭州']
  },
  {
    id: '7',
    company: '小米',
    position: '前端开发',
    industry: '硬件',
    city: '北京',
    channel: '官网投递',
    salaryMin: 20000,
    salaryMax: 32000,
    status: 'applied',
    appliedDate: '2026-06-05',
    description: '负责小米商城小程序的前端开发。',
    contacts: [],
    interviews: [],
    resumeVersion: 'v1.1-电商方向',
    review: '',
    tags: ['硬件', '小程序']
  },
  {
    id: '8',
    company: '百度',
    position: '前端架构师',
    industry: '人工智能',
    city: '北京',
    channel: '猎头推荐',
    salaryMin: 35000,
    salaryMax: 55000,
    status: 'pending',
    appliedDate: '2026-06-08',
    description: '负责百度AI开放平台的前端架构设计。',
    contacts: [],
    interviews: [],
    resumeVersion: 'v1.2-互联网方向',
    review: '',
    tags: ['AI', '架构', '高薪']
  },
  {
    id: '9',
    company: '滴滴出行',
    position: '前端工程师',
    industry: '出行',
    city: '北京',
    channel: '拉勾网',
    salaryMin: 23000,
    salaryMax: 36000,
    status: 'applied',
    appliedDate: '2026-06-02',
    description: '负责滴滴出行乘客端H5页面的前端开发。',
    contacts: [],
    interviews: [],
    resumeVersion: 'v1.2-互联网方向',
    review: '',
    tags: ['出行', 'H5']
  },
  {
    id: '10',
    company: '蚂蚁集团',
    position: '高级前端工程师',
    industry: '金融',
    city: '杭州',
    channel: '内推',
    salaryMin: 32000,
    salaryMax: 52000,
    status: 'interview',
    appliedDate: '2026-05-25',
    description: '负责支付宝理财板块的前端开发工作。',
    contacts: [
      { name: '钱HR', position: '高级招聘经理', phone: '134****2345', email: 'qianhr@antgroup.com' }
    ],
    interviews: [
      {
        id: 'i10',
        round: 'phone',
        roundName: '电话面试',
        date: '2026-05-30',
        time: '14:30',
        location: '钉钉会议',
        interviewer: '韩工程师',
        result: 'pass',
        notes: '金融相关经验加分'
      },
      {
        id: 'i11',
        round: 'tech',
        roundName: '技术一面',
        date: '2026-06-03',
        time: '10:00',
        location: '蚂蚁Z空间',
        interviewer: '杨主管',
        result: 'pending',
        notes: '待面试'
      }
    ],
    resumeVersion: 'v1.2-互联网方向',
    review: '金融业务有前景',
    tags: ['金融', '杭州']
  }
];

export const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待投递', color: '#FF7D00' },
  applied: { label: '已投递', color: '#165DFF' },
  interview: { label: '面试中', color: '#5B6FFF' },
  offer: { label: '已Offer', color: '#00B42A' },
  rejected: { label: '已拒绝', color: '#F53F3F' }
};

export const channelOptions = ['BOSS直聘', '拉勾网', '猎聘', '内推', '官网投递', '猎头推荐', '其他'];
export const cityOptions = ['北京', '上海', '杭州', '深圳', '广州', '成都', '南京', '其他'];
export const industryOptions = ['互联网', '电商', '游戏', '金融', '人工智能', '硬件', '本地生活', '出行', '其他'];
