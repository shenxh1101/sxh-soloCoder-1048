import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { getRelativeDate } from '@/utils';
import type { Schedule } from '@/types';
import { useStore } from '@/store/useStore';
import { typeMap } from '@/data/mockSchedules';

interface ScheduleCardProps {
  schedule: Schedule;
  onClick?: () => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, onClick }) => {
  const toggleScheduleComplete = useStore((state) => state.toggleScheduleComplete);

  const handleToggle = (e) => {
    e.stopPropagation();
    console.log('[ScheduleCard] 切换日程状态:', schedule.id, schedule.jobName);
    toggleScheduleComplete(schedule.id);
  };

  const handleCardClick = (e) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <View
      className={classnames(styles.scheduleCard, schedule.isCompleted && styles.completed)}
      onClick={handleCardClick}
    >
      <View className={styles.timeColumn}>
        <Text className={styles.time}>{schedule.time}</Text>
        <Text className={styles.relativeDate}>{getRelativeDate(schedule.date)}</Text>
      </View>

      <View className={styles.contentColumn}>
        <View className={classnames(styles.typeTag, styles[schedule.type])}>
          <Text>{schedule.typeName}</Text>
        </View>
        <Text className={styles.jobInfo}>{schedule.jobName}</Text>
        <Text className={styles.company}>{schedule.company}</Text>
        {schedule.location && (
          <View className={styles.location}>
            <View className={styles.dot}></View>
            <Text>{schedule.location}</Text>
          </View>
        )}
      </View>

      <View
        className={classnames(styles.checkbox, schedule.isCompleted && styles.checked)}
        onClick={handleToggle}
      >
        {schedule.isCompleted && <Text className={styles.checkIcon}>✓</Text>}
      </View>
    </View>
  );
};

export default ScheduleCard;
