import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import StatusTag from '@/components/StatusTag';
import { useStore } from '@/store/useStore';
import { formatSalary, formatDate, formatDateTime } from '@/utils';
import { statusMap } from '@/data/mockJobs';
import type { JobStatus } from '@/types';

const JobDetailPage: React.FC = () => {
  const { currentJob, updateJobStatus } = useStore();
  const [localStatus, setLocalStatus] = useState<JobStatus>(currentJob?.status || 'pending');

  if (!currentJob) {
    return (
      <View className={styles.page}>
        <View className="container">
          <View className="card">
            <Text style={{ color: '#86909C' }}>未找到岗位信息</Text>
          </View>
        </View>
      </View>
    );
  }

  const handleStatusChange = (status: JobStatus) => {
    console.log('[JobDetail] 切换状态:', status);
    setLocalStatus(status);
    updateJobStatus(currentJob.id, status);
    Taro.showToast({ title: '状态已更新', icon: 'success' });
  };

  const resultClassMap = {
    pass: styles.resultPass,
    fail: styles.resultFail,
    pending: styles.resultPending
  };

  const resultTextMap = {
    pass: '通过',
    fail: '未通过',
    pending: '待面试'
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className="container">
        <View className={styles.header}>
          <Text className={styles.company}>{currentJob.company}</Text>
          <Text className={styles.position}>{currentJob.position}</Text>
          <View className={styles.headerTags}>
            <View className={styles.headerTag}>
              <Text>📍 {currentJob.city}</Text>
            </View>
            <View className={styles.headerTag}>
              <Text>🏢 {currentJob.industry}</Text>
            </View>
            <View className={styles.headerTag}>
              <Text>💰 {formatSalary(currentJob.salaryMin, currentJob.salaryMax)}</Text>
            </View>
          </View>
        </View>

        <View className={styles.content}>
          <View className={styles.infoCard}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>投递状态</Text>
              <StatusTag
                status={localStatus}
                label={statusMap[localStatus].label}
              />
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>投递渠道</Text>
              <Text className={styles.infoValue}>{currentJob.channel}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>投递日期</Text>
              <Text className={styles.infoValue}>{formatDate(currentJob.appliedDate)}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>薪资范围</Text>
              <Text className={classnames(styles.infoValue, styles.salaryValue)}>
                {formatSalary(currentJob.salaryMin, currentJob.salaryMax)}
              </Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>使用简历</Text>
              <Text className={styles.infoValue}>{currentJob.resumeVersion}</Text>
            </View>

            <View className={styles.statusActions}>
              {(['pending', 'applied', 'interview', 'offer', 'rejected'] as JobStatus[]).map(
                (status) => (
                  <View
                    key={status}
                    className={classnames(
                      styles.statusBtn,
                      localStatus === status && styles.activeBtn
                    )}
                    onClick={() => handleStatusChange(status)}
                  >
                    <Text>{statusMap[status].label}</Text>
                  </View>
                )
              )}
            </View>
          </View>

          {currentJob.tags.length > 0 && (
            <View className={styles.section}>
              <View className={styles.infoCard}>
                <Text className={styles.sectionTitle}>
                  <Text className={styles.sectionIcon}>🏷️</Text>
                  岗位标签
                </Text>
                <View className={styles.tags}>
                  {currentJob.tags.map((tag) => (
                    <View key={tag} className={styles.tag}>
                      <Text>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📋</Text>
              岗位描述
            </Text>
            <View className={styles.infoCard}>
              <Text className={styles.reviewText}>{currentJob.description}</Text>
            </View>
          </View>

          {currentJob.interviews.length > 0 && (
            <View className={styles.section}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.sectionIcon}>📝</Text>
                面试记录
              </Text>
              <View className={styles.timeline}>
                {currentJob.interviews.map((interview) => (
                  <View key={interview.id} className={styles.timelineItem}>
                    <View
                      className={classnames(
                        styles.timelineDot,
                        styles[interview.result]
                      )}
                    />
                    <View className={styles.timelineContent}>
                      <View className={styles.timelineHeader}>
                        <Text className={styles.roundName}>{interview.roundName}</Text>
                        <View
                          className={classnames(
                            styles.resultTag,
                            resultClassMap[interview.result]
                          )}
                        >
                          <Text>{resultTextMap[interview.result]}</Text>
                        </View>
                      </View>
                      <View className={styles.timelineMeta}>
                        <View className={styles.metaItem}>
                          <Text className={styles.metaIcon}>⏰</Text>
                          <Text>{formatDateTime(interview.date, interview.time)}</Text>
                        </View>
                      </View>
                      <View className={styles.timelineMeta}>
                        <View className={styles.metaItem}>
                          <Text className={styles.metaIcon}>📍</Text>
                          <Text>{interview.location}</Text>
                        </View>
                      </View>
                      <View className={styles.timelineMeta}>
                        <View className={styles.metaItem}>
                          <Text className={styles.metaIcon}>👤</Text>
                          <Text>面试官：{interview.interviewer}</Text>
                        </View>
                      </View>
                      {interview.notes && (
                        <View className={styles.timelineNotes}>
                          <Text>{interview.notes}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {currentJob.contacts.length > 0 && (
            <View className={styles.section}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.sectionIcon}>📇</Text>
                联系人
              </Text>
              <View className={styles.infoCard}>
                {currentJob.contacts.map((contact, index) => (
                  <View key={index} className={styles.contactItem}>
                    <View className={styles.contactAvatar}>
                      <Text className={styles.avatarText}>{contact.name[0]}</Text>
                    </View>
                    <View className={styles.contactInfo}>
                      <Text className={styles.contactName}>{contact.name}</Text>
                      <Text className={styles.contactPosition}>{contact.position}</Text>
                      <Text className={styles.contactPhone}>{contact.phone}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>💭</Text>
              面试复盘
            </Text>
            <View className={styles.infoCard}>
              {currentJob.review ? (
                <Text className={styles.reviewText}>{currentJob.review}</Text>
              ) : (
                <Text className={styles.emptyReview}>暂无复盘记录</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default JobDetailPage;
