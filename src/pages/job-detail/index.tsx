import React, { useState } from 'react';
import { View, Text, ScrollView, Input, Textarea, Picker, Switch } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import StatusTag from '@/components/StatusTag';
import { useStore } from '@/store/useStore';
import { formatSalary, formatDate, formatDateTime, generateId } from '@/utils';
import { statusMap } from '@/data/mockJobs';
import { typeMap } from '@/data/mockSchedules';
import type { JobStatus, InterviewRecord, InterviewRound, Schedule } from '@/types';
import dayjs from 'dayjs';

const JobDetailPage: React.FC = () => {
  const { currentJob, updateJobStatus, addInterview, updateJob, addSchedule, resumes } = useStore();
  const [localStatus, setLocalStatus] = useState<JobStatus>(currentJob?.status || 'pending');
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showResumePicker, setShowResumePicker] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    round: 'tech' as InterviewRound,
    roundName: '',
    date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    time: '10:00',
    location: '',
    interviewer: '',
    result: 'pending' as 'pass' | 'fail' | 'pending',
    notes: '',
    createSchedule: true
  });

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

  const roundOptions: { value: InterviewRound; label: string }[] = [
    { value: 'phone', label: '电话面' },
    { value: 'tech', label: '技术面' },
    { value: 'hr', label: 'HR 面' },
    { value: 'leader', label: 'Leader 面' },
    { value: 'final', label: '终面' },
    { value: 'onsite', label: '现场面' }
  ];

  const resultOptions: { value: 'pass' | 'fail' | 'pending'; label: string }[] = [
    { value: 'pending', label: '待面试' },
    { value: 'pass', label: '通过' },
    { value: 'fail', label: '未通过' }
  ];

  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const resumeOptions = resumes.map((r) => r.name);

  const handleAddInterview = () => {
    setInterviewForm({
      round: 'tech',
      roundName: '',
      date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      time: '10:00',
      location: '',
      interviewer: '',
      result: 'pending',
      notes: '',
      createSchedule: true
    });
    setShowInterviewModal(true);
  };

  const updateInterviewField = (field: string, value: any) => {
    setInterviewForm((prev) => {
      const newForm = { ...prev, [field]: value };
      if (field === 'round' && !prev.roundName) {
        const roundLabel = roundOptions.find((r) => r.value === value)?.label || '';
        const nextRoundNum = (currentJob?.interviews.length || 0) + 1;
        newForm.roundName = `第${nextRoundNum}轮 · ${roundLabel}`;
      }
      return newForm;
    });
  };

  const handleSaveInterview = () => {
    if (!currentJob) return;
    if (!interviewForm.roundName.trim()) {
      Taro.showToast({ title: '请输入面试轮次名称', icon: 'none' });
      return;
    }

    const interviewRecord: InterviewRecord = {
      id: generateId(),
      round: interviewForm.round,
      roundName: interviewForm.roundName.trim(),
      date: interviewForm.date,
      time: interviewForm.time,
      location: interviewForm.location.trim(),
      interviewer: interviewForm.interviewer.trim(),
      result: interviewForm.result,
      notes: interviewForm.notes.trim()
    };

    addInterview(currentJob.id, interviewRecord);

    if (interviewForm.createSchedule && interviewForm.result === 'pending') {
      const schedule: Schedule = {
        id: generateId(),
        jobId: currentJob.id,
        jobName: currentJob.position,
        company: currentJob.company,
        type: 'interview',
        typeName: typeMap['interview'].label,
        date: interviewForm.date,
        time: interviewForm.time,
        location: interviewForm.location.trim(),
        notes: interviewForm.roundName.trim(),
        isCompleted: false
      };
      addSchedule(schedule);
      Taro.showToast({ title: '已添加面试和日程提醒', icon: 'success' });
    } else {
      Taro.showToast({ title: '面试记录已添加', icon: 'success' });
    }

    setShowInterviewModal(false);
  };

  const handleResumeChange = (value: string) => {
    if (!currentJob) return;
    updateJob(currentJob.id, { resumeVersion: value });
    setShowResumePicker(false);
    Taro.showToast({ title: '简历版本已更新', icon: 'success' });
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
            <View
              className={classnames(styles.infoRow, styles.clickableRow)}
              onClick={() => setShowResumePicker(true)}
            >
              <Text className={styles.infoLabel}>使用简历</Text>
              <View style={{ display: 'flex', alignItems: 'center' }}>
                <Text className={styles.infoValue}>{currentJob.resumeVersion}</Text>
                <Text className={styles.pickerArrow}>›</Text>
              </View>
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

          <View className={styles.section}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.sectionIcon}>📝</Text>
                面试记录
              </Text>
              <View className={styles.addInterviewBtn} onClick={handleAddInterview}>
                <Text className={styles.addInterviewText}>+ 新增</Text>
              </View>
            </View>
            {currentJob.interviews.length > 0 ? (
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
            ) : (
              <View className={styles.infoCard}>
                <Text style={{ color: '#86909C', fontSize: '28rpx' }}>
                  暂无面试记录，点击右上角添加
                </Text>
              </View>
            )}
          </View>

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

    {showInterviewModal && (
      <View className={styles.modalOverlay} onClick={() => setShowInterviewModal(false)}>
        <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <View className={styles.modalHeader}>
            <Text className={styles.modalTitle}>新增面试轮次</Text>
            <View className={styles.modalClose} onClick={() => setShowInterviewModal(false)}>
              <Text>×</Text>
            </View>
          </View>

          <ScrollView className={styles.modalBody} scrollY>
            <View className={styles.formRow}>
              <View className={styles.formItem} style={{ flex: 1, marginRight: 20 }}>
                <Text className={styles.label}>面试类型</Text>
                <Picker
                  mode="selector"
                  range={roundOptions.map((r) => r.label)}
                  value={roundOptions.findIndex((r) => r.value === interviewForm.round)}
                  onChange={(e) => updateInterviewField('round', roundOptions[e.detail.value].value)}
                >
                  <View className={styles.picker}>
                    <Text>{roundOptions.find((r) => r.value === interviewForm.round)?.label}</Text>
                    <Text className={styles.pickerArrow}>›</Text>
                  </View>
                </Picker>
              </View>

              <View className={styles.formItem} style={{ flex: 1 }}>
                <Text className={styles.label}>面试结果</Text>
                <Picker
                  mode="selector"
                  range={resultOptions.map((r) => r.label)}
                  value={resultOptions.findIndex((r) => r.value === interviewForm.result)}
                  onChange={(e) => updateInterviewField('result', resultOptions[e.detail.value].value)}
                >
                  <View className={styles.picker}>
                    <Text>{resultOptions.find((r) => r.value === interviewForm.result)?.label}</Text>
                    <Text className={styles.pickerArrow}>›</Text>
                  </View>
                </Picker>
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>轮次名称 <Text style={{ color: '#F53F3F' }}>*</Text></Text>
              <Input
                className={styles.input}
                placeholder="如：第1轮 · 技术面"
                value={interviewForm.roundName}
                onInput={(e) => updateInterviewField('roundName', e.detail.value)}
              />
            </View>

            <View className={styles.formRow}>
              <View className={styles.formItem} style={{ flex: 1, marginRight: 20 }}>
                <Text className={styles.label}>日期</Text>
                <Picker
                  mode="date"
                  value={interviewForm.date}
                  onChange={(e) => updateInterviewField('date', e.detail.value)}
                >
                  <View className={styles.picker}>
                    <Text>{interviewForm.date}</Text>
                    <Text className={styles.pickerArrow}>›</Text>
                  </View>
                </Picker>
              </View>

              <View className={styles.formItem} style={{ flex: 1 }}>
                <Text className={styles.label}>时间</Text>
                <Picker
                  mode="selector"
                  range={timeOptions}
                  value={timeOptions.indexOf(interviewForm.time)}
                  onChange={(e) => updateInterviewField('time', timeOptions[e.detail.value])}
                >
                  <View className={styles.picker}>
                    <Text>{interviewForm.time}</Text>
                    <Text className={styles.pickerArrow}>›</Text>
                  </View>
                </Picker>
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>地点</Text>
              <Input
                className={styles.input}
                placeholder="请输入面试地点"
                value={interviewForm.location}
                onInput={(e) => updateInterviewField('location', e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>面试官</Text>
              <Input
                className={styles.input}
                placeholder="请输入面试官姓名"
                value={interviewForm.interviewer}
                onInput={(e) => updateInterviewField('interviewer', e.detail.value)}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.label}>面试复盘/备注</Text>
              <Textarea
                className={styles.textarea}
                placeholder="请输入面试复盘或备注信息"
                value={interviewForm.notes}
                onInput={(e) => updateInterviewField('notes', e.detail.value)}
                maxlength={500}
              />
            </View>

            {interviewForm.result === 'pending' && (
              <View className={styles.switchRow}>
                <Text className={styles.label}>自动创建日程提醒</Text>
                <Switch
                  checked={interviewForm.createSchedule}
                  onChange={(e) => updateInterviewField('createSchedule', e.detail.value)}
                  color="#5B6FFF"
                />
              </View>
            )}
          </ScrollView>

          <View className={styles.modalFooter}>
            <View className={styles.cancelBtn} onClick={() => setShowInterviewModal(false)}>
              <Text>取消</Text>
            </View>
            <View className={styles.confirmBtn} onClick={handleSaveInterview}>
              <Text>保存</Text>
            </View>
          </View>
        </View>
      </View>
    )}

    {showResumePicker && (
      <View className={styles.modalOverlay} onClick={() => setShowResumePicker(false)}>
        <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <View className={styles.modalHeader}>
            <Text className={styles.modalTitle}>选择简历版本</Text>
            <View className={styles.modalClose} onClick={() => setShowResumePicker(false)}>
              <Text>×</Text>
            </View>
          </View>

          <ScrollView className={styles.modalBody} scrollY>
            {resumeOptions.map((option) => (
              <View
                key={option}
                className={classnames(
                  styles.optionItem,
                  currentJob?.resumeVersion === option && styles.optionSelected
                )}
                onClick={() => handleResumeChange(option)}
              >
                <Text>{option}</Text>
                {currentJob?.resumeVersion === option && (
                  <Text className={styles.checkMark}>✓</Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    )}
  );
};

export default JobDetailPage;
