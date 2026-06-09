import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import ResumeCard from '@/components/ResumeCard';
import EmptyState from '@/components/EmptyState';
import { useStore } from '@/store/useStore';

const ResumePage: React.FC = () => {
  const { resumes } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalUsed = useMemo(() => {
    return resumes.reduce((sum, r) => sum + r.usedCount, 0);
  }, [resumes]);

  const handleRefresh = () => {
    console.log('[ResumePage] 下拉刷新');
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

  const handleUpload = () => {
    console.log('[ResumePage] 上传简历');
    Taro.showToast({ title: '上传功能开发中', icon: 'none' });
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      onScrollToUpper={handleScrollToUpper}
    >
      <View className="container">
        <View className={styles.statsHeader}>
          <Text className={styles.statsTitle}>简历总览</Text>
          <View className={styles.statsGrid}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{resumes.length}</Text>
              <Text className={styles.statLabel}>简历版本</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{totalUsed}</Text>
              <Text className={styles.statLabel}>累计使用</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{new Set(resumes.map(r => r.targetIndustry)).size}</Text>
              <Text className={styles.statLabel}>覆盖行业</Text>
            </View>
          </View>
        </View>

        <View className={styles.tipsCard}>
          <View className={styles.tipsHeader}>
            <Text className={styles.tipsIcon}>💡</Text>
            <Text className={styles.tipsTitle}>小提示</Text>
          </View>
          <Text className={styles.tipsContent}>
            针对不同岗位定制不同版本的简历，突出相关经验，可以显著提升面试邀约率哦！
          </Text>
        </View>

        <Text className={styles.sectionTitle}>我的简历</Text>

        {resumes.length > 0 ? (
          resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))
        ) : (
          <EmptyState icon="📄" text="还没有上传简历" />
        )}
      </View>
    </ScrollView>
  );
};

export default ResumePage;
