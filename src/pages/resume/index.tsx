import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input, Textarea, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ResumeCard from '@/components/ResumeCard';
import EmptyState from '@/components/EmptyState';
import { useStore } from '@/store/useStore';
import { generateId } from '@/utils';
import { industryOptions } from '@/data/mockJobs';
import type { Resume } from '@/types';
import dayjs from 'dayjs';

const ResumePage: React.FC = () => {
  const { resumes, addResume, setCurrentResume } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [resumeForm, setResumeForm] = useState({
    name: '',
    version: '',
    targetIndustry: '',
    fileName: '',
    description: ''
  });

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
    setResumeForm({
      name: '',
      version: 'v1.0',
      targetIndustry: '',
      fileName: '',
      description: ''
    });
    setShowAddModal(true);
  };

  const updateResumeField = (field: string, value: any) => {
    setResumeForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveResume = () => {
    if (!resumeForm.name.trim()) {
      Taro.showToast({ title: '请输入简历名称', icon: 'none' });
      return;
    }
    if (!resumeForm.targetIndustry) {
      Taro.showToast({ title: '请选择目标行业', icon: 'none' });
      return;
    }

    const newResume: Resume = {
      id: generateId(),
      name: resumeForm.name.trim(),
      version: resumeForm.version.trim() || 'v1.0',
      targetIndustry: resumeForm.targetIndustry,
      uploadDate: dayjs().format('YYYY-MM-DD'),
      fileUrl: resumeForm.fileName.trim() || '未上传',
      usedCount: 0,
      description: resumeForm.description.trim()
    };

    addResume(newResume);
    setShowAddModal(false);
    Taro.showToast({ title: '添加成功', icon: 'success' });
  };

  const handleResumeClick = (resume: Resume) => {
    setCurrentResume(resume);
    Taro.navigateTo({ url: '/pages/resume-detail/index' });
  };

  return (
    <View style={{ position: 'relative', minHeight: '100vh' }}>
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
              <View key={resume.id} onClick={() => handleResumeClick(resume)}>
                <ResumeCard resume={resume} />
              </View>
            ))
          ) : (
            <EmptyState icon="📄" text="还没有上传简历" />
          )}
        </View>
      </ScrollView>

      <View className={styles.addBtn} onClick={handleUpload}>
        <Text className={styles.addBtnText}>+</Text>
      </View>

      {showAddModal && (
        <View className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>新增简历</Text>
              <View className={styles.modalClose} onClick={() => setShowAddModal(false)}>
                <Text>×</Text>
              </View>
            </View>

            <ScrollView className={styles.modalBody} scrollY>
              <View className={styles.formItem}>
                <Text className={styles.label}>简历名称 <Text className={styles.required}>*</Text></Text>
                <Input
                  className={styles.input}
                  placeholder="如：前端开发-通用版"
                  value={resumeForm.name}
                  onInput={(e) => updateResumeField('name', e.detail.value)}
                />
              </View>

              <View className={styles.formRow}>
                <View className={styles.formItem} style={{ flex: 1, marginRight: 20 }}>
                  <Text className={styles.label}>版本号</Text>
                  <Input
                    className={styles.input}
                    placeholder="如：v1.0"
                    value={resumeForm.version}
                    onInput={(e) => updateResumeField('version', e.detail.value)}
                  />
                </View>
                <View className={styles.formItem} style={{ flex: 1 }}>
                  <Text className={styles.label}>目标行业 <Text className={styles.required}>*</Text></Text>
                  <Picker
                    mode="selector"
                    range={industryOptions}
                    value={industryOptions.indexOf(resumeForm.targetIndustry)}
                    onChange={(e) => updateResumeField('targetIndustry', industryOptions[e.detail.value])}
                  >
                    <View className={classnames(styles.picker, !resumeForm.targetIndustry && styles.placeholder)}>
                      <Text>{resumeForm.targetIndustry || '请选择'}</Text>
                      <Text className={styles.pickerArrow}>›</Text>
                    </View>
                  </Picker>
                </View>
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>文件名</Text>
                <Input
                  className={styles.input}
                  placeholder="如：张三_前端开发.pdf"
                  value={resumeForm.fileName}
                  onInput={(e) => updateResumeField('fileName', e.detail.value)}
                />
              </View>

              <View className={styles.formItem}>
                <Text className={styles.label}>说明</Text>
                <Textarea
                  className={styles.textarea}
                  placeholder="简历版本说明、适用岗位等"
                  value={resumeForm.description}
                  onInput={(e) => updateResumeField('description', e.detail.value)}
                  maxlength={300}
                />
              </View>
            </ScrollView>

            <View className={styles.modalFooter}>
              <View className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>
                <Text>取消</Text>
              </View>
              <View className={styles.confirmBtn} onClick={handleSaveResume}>
                <Text>保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ResumePage;
