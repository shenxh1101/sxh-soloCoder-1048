import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import ScheduleCard from '@/components/ScheduleCard';
import JobCard from '@/components/JobCard';
import { useStore } from '@/store/useStore';
import { isToday, isTomorrow } from '@/utils';
import dayjs from 'dayjs';

const HomePage: React.FC = () => {
  const { jobs, schedules, stats } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const todaySchedules = useMemo(() => {
    return schedules.filter((s) => isToday(s.date) && !s.isCompleted);
  }, [schedules]);

  const tomorrowSchedules = useMemo(() => {
    return schedules.filter((s) => isTomorrow(s.date) && !s.isCompleted);
  }, [schedules]);

  const pendingSchedules = useMemo(() => {
    return [...todaySchedules, ...tomorrowSchedules].slice(0, 3);
  }, [todaySchedules, tomorrowSchedules]);

  const recentJobs = useMemo(() => {
    return [...jobs]
      .sort((a, b) => dayjs(b.appliedDate).valueOf() - dayjs(a.appliedDate).valueOf())
      .slice(0, 3);
  }, [jobs]);

  const weekTodoCount = useMemo(() => {
    const weekStart = dayjs().startOf('week');
    const weekEnd = dayjs().endOf('week');
    return schedules.filter(
      (s) =>
        !s.isCompleted &&
        dayjs(s.date).isAfter(weekStart) &&
        dayjs(s.date).isBefore(weekEnd)
    ).length;
  }, [schedules]);

  const greeting = useMemo(() => {
    const hour = dayjs().hour();
    if (hour < 6) return '夜深了';
    if (hour < 12) return '早上好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  }, []);

  const handleRefresh = () => {
    console.log('[HomePage] 下拉刷新');
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      Taro.stopPullDownRefresh();
    }, 1000);
  };

  React.useEffect(() => {
    if (isRefreshing) {
      handleRefresh();
    }
  }, [isRefreshing]);

  const handlePullDownRefresh = () => {
    setIsRefreshing(true);
  };

  React.useEffect(() => {
    Taro.eventCenter.on('onPullDownRefresh', handlePullDownRefresh);
    return () => {
      Taro.eventCenter.off('onPullDownRefresh', handlePullDownRefresh);
    };
  }, []);

  const handleQuickAction = (action: string) => {
    console.log('[HomePage] 点击快捷操作:', action);
    switch (action) {
      case 'add':
        Taro.navigateTo({ url: '/pages/job-edit/index' });
        break;
      case 'schedule':
        Taro.switchTab({ url: '/pages/schedule/index' });
        break;
      case 'resume':
        Taro.switchTab({ url: '/pages/resume/index' });
        break;
      case 'stats':
        Taro.switchTab({ url: '/pages/stats/index' });
        break;
    }
  };

  const quickActions = [
    { icon: '➕', text: '新增岗位', action: 'add' },
    { icon: '📅', text: '日程管理', action: 'schedule' },
    { icon: '📄', text: '简历库', action: 'resume' },
    { icon: '📊', text: '数据统计', action: 'stats' }
  ];

  return (
    <ScrollView
      className={styles.page}
      scrollY
      onScrollToUpper={() => setIsRefreshing(true)}
    >
      <View className="container">
        <View className={styles.header}>
          <Text className={styles.greeting}>{greeting}，求职者</Text>
          <Text className={styles.date}>
            {dayjs().format('YYYY年MM月DD日 dddd')}
          </Text>

          <View className={styles.statsRow}>
            <View className={styles.miniStatCard}>
              <Text className={styles.miniStatValue}>{stats.totalJobs}</Text>
              <Text className={styles.miniStatLabel}>总投递</Text>
            </View>
            <View className={styles.miniStatCard}>
              <Text className={styles.miniStatValue}>{stats.interviewJobs}</Text>
              <Text className={styles.miniStatLabel}>面试中</Text>
            </View>
            <View className={styles.miniStatCard}>
              <Text className={styles.miniStatValue}>{stats.pendingJobs}</Text>
              <Text className={styles.miniStatLabel}>待处理</Text>
            </View>
            <View className={styles.miniStatCard}>
              <Text className={styles.miniStatValue}>{stats.offerJobs}</Text>
              <Text className={styles.miniStatLabel}>已Offer</Text>
            </View>
          </View>
        </View>

        <View className={styles.content}>
          <ScrollView
            className={styles.quickActions}
            scrollX
            enhanced
            showScrollbar={false}
          >
            {quickActions.map((item) => (
              <View
                key={item.action}
                className={styles.quickActionItem}
                onClick={() => handleQuickAction(item.action)}
              >
                <Text className={styles.quickActionIcon}>{item.icon}</Text>
                <Text className={styles.quickActionText}>{item.text}</Text>
              </View>
            ))}
          </ScrollView>

          {weekTodoCount > 0 && (
            <View className={styles.weekTodoCard}>
              <Text className={styles.todoIcon}>📋</Text>
              <View className={styles.todoContent}>
                <Text className={styles.todoTitle}>本周待办</Text>
                <Text className={styles.todoDesc}>还有 {weekTodoCount} 件事需要处理</Text>
              </View>
              <Text className={styles.todoCount}>{weekTodoCount}</Text>
            </View>
          )}

          <View className={styles.section}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>待处理事项</Text>
              <Text
                className={styles.moreBtn}
                onClick={() => Taro.switchTab({ url: '/pages/schedule/index' })}
              >
                更多
              </Text>
            </View>
            {pendingSchedules.length > 0 ? (
              pendingSchedules.map((schedule) => (
                <ScheduleCard key={schedule.id} schedule={schedule} />
              ))
            ) : (
              <View className="card">
                <Text style={{ color: '#86909C', fontSize: '28rpx' }}>
                  近期没有待处理事项，继续加油！
                </Text>
              </View>
            )}
          </View>

          <View className={styles.section}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>最近进展</Text>
            </View>
            {recentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;
