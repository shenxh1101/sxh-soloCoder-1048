import type { Resume } from '@/types';

export const mockResumes: Resume[] = [
  {
    id: 'r1',
    name: '前端开发简历',
    version: 'v1.2',
    targetIndustry: '互联网方向',
    uploadDate: '2026-06-01',
    fileUrl: '',
    usedCount: 8,
    description: '针对互联网大厂优化的版本，突出React和工程化经验'
  },
  {
    id: 'r2',
    name: '游戏开发简历',
    version: 'v1.1',
    targetIndustry: '游戏方向',
    uploadDate: '2026-05-20',
    fileUrl: '',
    usedCount: 2,
    description: '侧重Canvas、WebGL和游戏引擎相关经验'
  },
  {
    id: 'r3',
    name: '电商开发简历',
    version: 'v1.1',
    targetIndustry: '电商方向',
    uploadDate: '2026-05-25',
    fileUrl: '',
    usedCount: 3,
    description: '突出电商营销活动和小程序开发经验'
  },
  {
    id: 'r4',
    name: '通用简历',
    version: 'v1.0',
    targetIndustry: '通用',
    uploadDate: '2026-05-10',
    fileUrl: '',
    usedCount: 1,
    description: '基础版本，覆盖全面但不够聚焦'
  }
];
