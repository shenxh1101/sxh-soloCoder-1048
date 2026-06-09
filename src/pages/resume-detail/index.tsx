import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useStore } from '@/store/useStore';
import { formatDate } from '@/utils';
import dayjs from 'dayjs';

const ResumeDetailPage: React.FC = () => {
  const { currentResume, jobs } = useStore();

  const usedJobs = useMemo(() => {
    if (!currentResume) return [];
    return jobs.filter((j) => j.resumeVersion === currentResume.name);
  }, [currentResume, jobs]);

  if (!currentResume) {
    return (
      <ScrollView className={styles.page} scrollY>
        <View className="container">
          <View className="card">
            <Text style={{ color: '#86909C' }}>未找到简历信息</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  const handleUseResume = () => {
    console.log('[ResumeDetail] 使用简历');
    Taro.showToast({ title: '请在新增岗位时选择此简历', icon: 'none' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className="container">
        <View className={styles.header}>
          <View className={styles.resumeIcon}>
            <Text className={styles.resumeIconText}>📄</Text>
          </View>
          <Text className={styles.resumeName}>{currentResume.name}</Text>
          <View className={styles.resumeMeta}>
            <Text className={styles.versionTag}>{currentResume.version}</Text>
            <Text className={styles.industryTag}>🏢 {currentResume.targetIndustry}</Text>
          </View>
        </View>

        <View className={styles.statsCard}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{currentResume.usedCount}</Text>
            <Text className={styles.statLabel}>使用次数</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{usedJobs.length}</Text>
            <Text className={styles.statLabel}>关联岗位</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>
              {dayjs(currentResume.uploadDate).format('MM.DD')}
            </Text>
            <Text className={styles.statLabel}>上传日期</Text>
          </View>
        </View>

        <View className={styles.infoCard}>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>文件名称</Text>
            <Text className={styles.infoValue}>{currentResume.fileUrl}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>目标行业</Text>
            <Text className={styles.infoValue}>{currentResume.targetIndustry}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>版本号</Text>
            <Text className={styles.infoValue}>{currentResume.version}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>上传日期</Text>
            <Text className={styles.infoValue}>{formatDate(currentResume.uploadDate)}</Text>
          </View>
        </View>

        {currentResume.description && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📝</Text>
              简历说明
            </Text>
            <View className={styles.infoCard}>
              <Text className={styles.descText}>{currentResume.description}</Text>
            </View>
          </View>
        )}

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📋</Text>
            使用记录
          </Text>

          {usedJobs.length > 0 ? (
            <View className={styles.infoCard}>
              {usedJobs.map((job, index) => (
                <View key={job.id}>
                  {index > 0 && <View className={styles.recordDivider} />}
                  <View className={styles.recordItem}>
                    <View>
                      <Text className={styles.recordCompany}>{job.company}</Text>
                      <Text className={styles.recordPosition}>{job.position}</Text>
                    </View>
                    <Text className={styles.recordDate}>{formatDate(job.appliedDate)}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyRecord}>
              <Text className={styles.emptyIcon}>📭</Text>
              <Text className={styles.emptyText}>暂无使用记录</Text>
              <Text className={styles.emptyDesc}>在新增岗位时选择此简历后，将自动记录</Text>
            </View>
          )}
        </View>

        <View className={styles.actionBtn} onClick={handleUseResume}>
          <Text className={styles.actionBtnText}>使用此简历投递</Text>
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
};

export default ResumeDetailPage;
