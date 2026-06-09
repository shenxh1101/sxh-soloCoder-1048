import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input, Textarea, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ScheduleCard from '@/components/ScheduleCard';
import EmptyState from '@/components/EmptyState';
import { useStore } from '@/store/useStore';
import { getWeekDates, generateId } from '@/utils';
import { typeMap } from '@/data/mockSchedules';
import type { ScheduleType } from '@/types';
import dayjs from 'dayjs';

const SchedulePage: React.FC = () => {
  const { schedules, jobs, addSchedule } = useStore();
  const weekDates = getWeekDates();
  const [selectedDate, setSelectedDate] = useState(
    weekDates.find((d) => d.isToday)?.date || weekDates[0].date
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    type: 'interview' as ScheduleType,
    jobId: '',
    date: selectedDate,
    time: '10:00',
    location: '',
    notes: ''
  });

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
    setScheduleForm({
      type: 'interview',
      jobId: '',
      date: selectedDate,
      time: '10:00',
      location: '',
      notes: ''
    });
    setShowAddModal(true);
  };

  const updateScheduleField = (field: string, value: any) => {
    setScheduleForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSchedule = () => {
    if (!scheduleForm.jobId) {
      Taro.showToast({ title: '请选择关联岗位', icon: 'none' });
      return;
    }

    const selectedJob = jobs.find((j) => j.id === scheduleForm.jobId);
    if (!selectedJob) return;

    const newSchedule: Schedule = {
      id: generateId(),
      jobId: scheduleForm.jobId,
      jobName: selectedJob.position,
      company: selectedJob.company,
      type: scheduleForm.type,
      typeName: typeMap[scheduleForm.type].label,
      date: scheduleForm.date,
      time: scheduleForm.time,
      location: scheduleForm.location.trim(),
      notes: scheduleForm.notes.trim(),
      isCompleted: false
    };

    addSchedule(newSchedule);
    setShowAddModal(false);
    Taro.showToast({ title: '添加成功', icon: 'success' });
  };

  const typeOptions = ['interview', 'written', 'meeting', 'deadline'] as ScheduleType[];
  const typeLabels = typeOptions.map((t) => typeMap[t].label);
  const jobOptions = jobs.map((j) => `${j.company} - ${j.position}`);
  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  return (
    <View style={{ position: 'relative', minHeight: '100vh' }}>
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
                  onClick={() => {
                    setSelectedDate(day.date);
                    updateScheduleField('date', day.date);
                  }}
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

      <View className={styles.addBtn} onClick={handleAddSchedule}>
        <Text className={styles.addBtnText}>+</Text>
      </View>

      {showAddModal && (
        <View className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>新增日程</Text>
              <View className={styles.modalClose} onClick={() => setShowAddModal(false)}>
                <Text>×</Text>
              </View>
            </View>

            <ScrollView className={styles.modalBody} scrollY>
              <View className={styles.formItem}>
                <Text className={styles.label}>日程类型</Text>
                <Picker
                  mode="selector"
                  range={typeLabels}
                  value={typeOptions.indexOf(scheduleForm.type)}
                  onChange={(e) => updateScheduleField('type', typeOptions[e.detail.value])}
                >
                  <View className={styles.picker}>
                    <Text style={{ color: typeMap[scheduleForm.type].color }}>
                      {typeMap[scheduleForm.type].label}
                    </Text>
                    <Text className={styles.pickerArrow}>›</Text>
                  </View>
                </Picker>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>关联岗位 <Text className={styles.required}>*</Text></Text>
                {jobOptions.length > 0 ? (
                  <Picker
                    mode="selector"
                    range={jobOptions}
                    value={jobs.findIndex((j) => j.id === scheduleForm.jobId)}
                    onChange={(e) => updateScheduleField('jobId', jobs[e.detail.value].id)}
                  >
                    <View className={classnames(styles.picker, !scheduleForm.jobId && styles.placeholder)}>
                      <Text>{scheduleForm.jobId ? jobOptions[jobs.findIndex((j) => j.id === scheduleForm.jobId)] : '请选择关联岗位'}</Text>
                      <Text className={styles.pickerArrow}>›</Text>
                    </View>
                  </Picker>
                ) : (
                  <View className={styles.picker}>
                    <Text style={{ color: '#86909C' }}>暂无岗位，请先添加岗位</Text>
                  </View>
                )}
              </View>

              <View className={styles.formRow}>
                <View className={styles.formItem} style={{ flex: 1, marginRight: 20 }}>
                  <Text className={styles.label}>日期</Text>
                  <Picker
                    mode="date"
                    value={scheduleForm.date}
                    onChange={(e) => updateScheduleField('date', e.detail.value)}
                  >
                    <View className={styles.picker}>
                      <Text>{scheduleForm.date}</Text>
                      <Text className={styles.pickerArrow}>›</Text>
                    </View>
                  </Picker>
                </View>

                <View className={styles.formItem} style={{ flex: 1 }}>
                  <Text className={styles.label}>时间</Text>
                  <Picker
                    mode="selector"
                    range={timeOptions}
                    value={timeOptions.indexOf(scheduleForm.time)}
                    onChange={(e) => updateScheduleField('time', timeOptions[e.detail.value])}
                  >
                    <View className={styles.picker}>
                      <Text>{scheduleForm.time}</Text>
                      <Text className={styles.pickerArrow}>›</Text>
                    </View>
                  </Picker>
                </View>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>地点</Text>
                <Input
                  className={styles.input}
                  placeholder="请输入地点"
                  value={scheduleForm.location}
                  onInput={(e) => updateScheduleField('location', e.detail.value)}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>备注</Text>
                <Textarea
                  className={styles.textarea}
                  placeholder="备注信息"
                  value={scheduleForm.notes}
                  onInput={(e) => updateScheduleField('notes', e.detail.value)}
                  maxlength={200}
                />
              </View>
            </ScrollView>

            <View className={styles.modalFooter}>
              <View className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>
                <Text>取消</Text>
              </View>
              <View className={styles.confirmBtn} onClick={handleSaveSchedule}>
                <Text>保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default SchedulePage;
