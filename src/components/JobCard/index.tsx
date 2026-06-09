import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import StatusTag from '@/components/StatusTag';
import { formatSalary, formatDate } from '@/utils';
import { statusMap } from '@/data/mockJobs';
import type { Job } from '@/types';
import { useStore } from '@/store/useStore';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const setCurrentJob = useStore((state) => state.setCurrentJob);

  const handleClick = () => {
    console.log('[JobCard] 点击岗位:', job.company, job.position);
    setCurrentJob(job);
    Taro.navigateTo({
      url: `/pages/job-detail/index?jobId=${job.id}`
    });
  };

  return (
    <View className={styles.jobCard} onClick={handleClick}>
      <View className={styles.cardHeader}>
        <View className={styles.companyInfo}>
          <Text className={styles.company}>{job.company}</Text>
          <Text className={styles.position}>{job.position}</Text>
        </View>
        <StatusTag status={job.status} label={statusMap[job.status].label} />
      </View>

      <View className={styles.cardBody}>
        <View className={`${styles.tag} ${styles.cityTag}`}>
          <Text>{job.city}</Text>
        </View>
        <View className={`${styles.tag} ${styles.industryTag}`}>
          <Text>{job.industry}</Text>
        </View>
        <View className={`${styles.tag} ${styles.channelTag}`}>
          <Text>{job.channel}</Text>
        </View>
        <View className={`${styles.tag} ${styles.salaryTag}`}>
          <Text>{formatSalary(job.salaryMin, job.salaryMax)}</Text>
        </View>
      </View>

      <View className={styles.cardFooter}>
        <Text className={styles.dateInfo}>投递于 {formatDate(job.appliedDate)}</Text>
        {job.interviews.length > 0 && (
          <Text className={styles.interviewCount}>已面试 {job.interviews.length} 轮</Text>
        )}
      </View>
    </View>
  );
};

export default JobCard;
