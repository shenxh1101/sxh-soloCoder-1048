import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { formatDate } from '@/utils';
import type { Resume } from '@/types';
import { useStore } from '@/store/useStore';

interface ResumeCardProps {
  resume: Resume;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume }) => {
  const setCurrentResume = useStore((state) => state.setCurrentResume);

  const handleClick = () => {
    console.log('[ResumeCard] 点击简历:', resume.name, resume.version);
    setCurrentResume(resume);
    Taro.navigateTo({
      url: '/pages/resume-detail/index'
    });
  };

  return (
    <View className={styles.resumeCard} onClick={handleClick}>
      <View className={styles.iconColumn}>
        <Text className={styles.icon}>CV</Text>
      </View>

      <View className={styles.contentColumn}>
        <View className={styles.header}>
          <Text className={styles.name}>{resume.name}</Text>
          <View className={styles.version}>
            <Text>{resume.version}</Text>
          </View>
        </View>

        <Text className={styles.target}>{resume.targetIndustry}</Text>
        <Text className={styles.description}>{resume.description}</Text>

        <View className={styles.footer}>
          <Text className={styles.date}>上传于 {formatDate(resume.uploadDate)}</Text>
          <Text className={styles.usedCount}>已投递 {resume.usedCount} 次</Text>
        </View>
      </View>
    </View>
  );
};

export default ResumeCard;
