import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ScheduleCard from '@/components/ScheduleCard';
import EmptyState from '@/components/EmptyState';
import { useStore } from '@/store/useStore';
import { getWeekDates } from '@/utils';
import dayjs from 'dayjs';

const SchedulePage: React.FC = () => {
  const { schedules } = useStore();
  const weekDates = getWeekDates();
  const [selectedDate, setSelectedDate] = useState(
    weekDates.find((d) => d.isToday)?.date || weekDates[0].date
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedDateSchedules = useMemo(() => {
    return schedules
      .filter((s) => s.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [schedules, selectedDate]);

  const hasEventOnDate = (date: string) => {
    return schedules.some((s) => s.date === date && !s.isCompleted);
  };

  const weekStats = useMemo(() => {
    const weekStart = dayjs().startOf('week');
    const stats = [];
    for (let i = 0; i < 7; i++) {
      const date = weekStart.add(i, 'day').format('YYYY-MM-DD');
      const count = schedules.filter((s) => s.date === date && !s.isCompleted).length;
      const total = schedules.filter((s) => s.date === date).length;
      stats.push({ date, count, total, day: ['日', '一', '二', '三', '四', '五', '六'][i] });
    }
    return stats;
  }, [schedules]);

  const weekProgress = useMemo(() => {
    const weekStart = dayjs().startOf('week');
    const weekEnd = dayjs().endOf('week');
    const weekSchedules = schedules.filter(
      (s) =>
        dayjs(s.date).isAfter(weekStart.subtract(1, 'day')) &&
        dayjs(s.date).isBefore(weekEnd.add(1, 'day'))
    );
    const completed = weekSchedules.filter((s) => s.isCompleted).length;
    const total = weekSchedules.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [schedules]);

  const handleRefresh = () => {
    console.log('[SchedulePage] 下拉刷新');
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      Taro.stopPullDownRefresh();
    }, 1000);
  };

  const handleScrollToUpper = () => {
    if (!isRefreshing) {
      setIsRefreshing(true);
      handleRefresh();
    }
  };

  const maxCount = Math.max(...weekStats.map((s) => s.count), 1);

  const handleAddSchedule = () => {
    console.log('[SchedulePage] 新增日程');
    Taro.showToast({ title: '新增功能开发中', icon: 'none' });
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      onScrollToUpper={handleScrollToUpper}
    >
      <View className="container">
        <View className={styles.weekCalendar}>
          <View className={styles.weekDays}>
            {weekDates.map((day) => (
              <View
                key={day.date}
                className={classnames(
                  styles.dayItem,
                  selectedDate === day.date && styles.selected,
                  hasEventOnDate(day.date) && styles.hasEvent
                )}
                onClick={() => setSelectedDate(day.date)}
              >
                <Text className={styles.weekday}>{day.weekday}</Text>
                <Text className={styles.dateNumber}>
                  {dayjs(day.date).format('D')}
                </Text>
                {day.isToday && (
                  <View className={styles.todayBadge}>
                    <Text>今</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.dateHeader}>
          <Text className={styles.dateTitle}>
            {dayjs(selectedDate).format('MM月DD日')}
            {weekDates.find((d) => d.date === selectedDate)?.isToday && ' 今天'}
          </Text>
          <Text className={styles.scheduleCount}>
            {selectedDateSchedules.length} 项安排
          </Text>
        </View>

        {selectedDateSchedules.length > 0 ? (
          selectedDateSchedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))
        ) : (
          <EmptyState icon="📅" text="今天没有日程安排" />
        )}

        <View className={styles.weekOverview}>
          <View className={styles.overviewHeader}>
            <View>
              <Text className={styles.overviewTitle}>本周待办</Text>
            </View>
            <Text className={styles.overviewSubtitle}>
              完成 {weekProgress.completed}/{weekProgress.total}
            </Text>
          </View>

          <View className={styles.weekBars}>
            {weekStats.map((stat) => (
              <View key={stat.date} className={styles.dayBarWrapper}>
                <View
                  className={styles.dayBar}
                  style={{
                    height: `${maxCount > 0 ? (stat.count / maxCount) * 80 + 20 : 20}%`,
                    opacity: stat.count > 0 ? 1 : 0.3
                  }}
                />
                <Text className={styles.barLabel}>{stat.day}</Text>
              </View>
            ))}
          </View>

          <View className={styles.progressRow}>
            <Text className={styles.progressText}>
              完成率 {weekProgress.percentage}%
            </Text>
            <View className={styles.progressBar}>
              <View
                className={styles.progressFill}
                style={{ width: `${weekProgress.percentage}%` }}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SchedulePage;
