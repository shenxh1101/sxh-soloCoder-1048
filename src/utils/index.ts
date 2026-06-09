import dayjs from 'dayjs';

export const formatSalary = (min: number, max: number): string => {
  return `${(min / 1000).toFixed(0)}K-${(max / 1000).toFixed(0)}K`;
};

export const formatDate = (date: string): string => {
  return dayjs(date).format('MM月DD日');
};

export const formatDateTime = (date: string, time: string): string => {
  return `${dayjs(date).format('MM月DD日')} ${time}`;
};

export const getDaysDiff = (date: string): number => {
  const target = dayjs(date);
  const today = dayjs().startOf('day');
  return target.diff(today, 'day');
};

export const getRelativeDate = (date: string): string => {
  const diff = getDaysDiff(date);
  if (diff === 0) return '今天';
  if (diff === 1) return '明天';
  if (diff === 2) return '后天';
  if (diff < 0) return `${Math.abs(diff)}天前`;
  return `${diff}天后`;
};

export const isToday = (date: string): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

export const isTomorrow = (date: string): boolean => {
  return dayjs(date).isSame(dayjs().add(1, 'day'), 'day');
};

export const getWeekDates = (): { date: string; weekday: string; isToday: boolean }[] => {
  const dates = [];
  const today = dayjs();
  const weekStart = today.startOf('week');
  for (let i = 0; i < 7; i++) {
    const date = weekStart.add(i, 'day');
    dates.push({
      date: date.format('YYYY-MM-DD'),
      weekday: ['日', '一', '二', '三', '四', '五', '六'][i],
      isToday: date.isSame(today, 'day')
    });
  }
  return dates;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};
