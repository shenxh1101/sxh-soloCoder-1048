import React, { useState } from 'react';
import { View, Text, ScrollView, Input, Textarea, Picker } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useStore } from '@/store/useStore';
import { generateId } from '@/utils';
import { statusMap, channelOptions, cityOptions, industryOptions } from '@/data/mockJobs';
import type { Job, JobStatus, Contact } from '@/types';
import dayjs from 'dayjs';

const JobEditPage: React.FC = () => {
  const { addJob, resumes } = useStore();

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    city: '',
    industry: '',
    channel: '',
    salaryMin: '',
    salaryMax: '',
    contactName: '',
    contactPosition: '',
    contactPhone: '',
    contactEmail: '',
    appliedDate: dayjs().format('YYYY-MM-DD'),
    status: 'pending' as JobStatus,
    resumeVersion: '',
    description: '',
    review: ''
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.company.trim()) {
      Taro.showToast({ title: '请输入公司名称', icon: 'none' });
      return;
    }
    if (!formData.position.trim()) {
      Taro.showToast({ title: '请输入岗位名称', icon: 'none' });
      return;
    }
    if (!formData.city) {
      Taro.showToast({ title: '请选择城市', icon: 'none' });
      return;
    }
    if (!formData.industry) {
      Taro.showToast({ title: '请选择行业', icon: 'none' });
      return;
    }

    const contacts: Contact[] = [];
    if (formData.contactName.trim()) {
      contacts.push({
        name: formData.contactName.trim(),
        position: formData.contactPosition.trim(),
        phone: formData.contactPhone.trim(),
        email: formData.contactEmail.trim()
      });
    }

    const newJob: Job = {
      id: generateId(),
      company: formData.company.trim(),
      position: formData.position.trim(),
      industry: formData.industry,
      city: formData.city,
      channel: formData.channel || '其他',
      salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) * 1000 : 0,
      salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) * 1000 : 0,
      status: formData.status,
      appliedDate: formData.appliedDate,
      description: formData.description.trim(),
      contacts,
      interviews: [],
      resumeVersion: formData.resumeVersion || (resumes[0]?.name || ''),
      review: formData.review.trim(),
      tags: []
    };

    addJob(newJob);
    Taro.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 500);
  };

  const statusOptions = (['pending', 'applied', 'interview', 'offer', 'rejected'] as JobStatus[]).map(
    (s) => statusMap[s].label
  );
  const resumeOptions = resumes.map((r) => r.name);

  return (
    <ScrollView className={styles.page} scrollY>
      <View className="container">
        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>基本信息</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>公司名称 <Text className={styles.required}>*</Text></Text>
            <Input
              className={styles.input}
              placeholder="请输入公司名称"
              value={formData.company}
              onInput={(e) => updateField('company', e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>岗位名称 <Text className={styles.required}>*</Text></Text>
            <Input
              className={styles.input}
              placeholder="请输入岗位名称"
              value={formData.position}
              onInput={(e) => updateField('position', e.detail.value)}
            />
          </View>

          <View className={styles.formRow}>
            <View className={styles.formItem} style={{ flex: 1, marginRight: 20 }}>
              <Text className={styles.label}>城市 <Text className={styles.required}>*</Text></Text>
              <Picker
                mode="selector"
                range={cityOptions}
                value={cityOptions.indexOf(formData.city)}
                onChange={(e) => updateField('city', cityOptions[e.detail.value])}
              >
                <View className={classnames(styles.picker, !formData.city && styles.placeholder)}>
                  <Text>{formData.city || '请选择城市'}</Text>
                  <Text className={styles.pickerArrow}>›</Text>
                </View>
              </Picker>
            </View>

            <View className={styles.formItem} style={{ flex: 1 }}>
              <Text className={styles.label}>行业 <Text className={styles.required}>*</Text></Text>
              <Picker
                mode="selector"
                range={industryOptions}
                value={industryOptions.indexOf(formData.industry)}
                onChange={(e) => updateField('industry', industryOptions[e.detail.value])}
              >
                <View className={classnames(styles.picker, !formData.industry && styles.placeholder)}>
                  <Text>{formData.industry || '请选择行业'}</Text>
                  <Text className={styles.pickerArrow}>›</Text>
                </View>
              </Picker>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>投递渠道</Text>
            <Picker
              mode="selector"
              range={channelOptions}
              value={channelOptions.indexOf(formData.channel)}
              onChange={(e) => updateField('channel', channelOptions[e.detail.value])}
            >
              <View className={classnames(styles.picker, !formData.channel && styles.placeholder)}>
                <Text>{formData.channel || '请选择投递渠道'}</Text>
                <Text className={styles.pickerArrow}>›</Text>
              </View>
            </Picker>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>薪资范围 (K)</Text>
            <View className={styles.salaryRow}>
              <Input
                className={styles.salaryInput}
                type="number"
                placeholder="最低"
                value={formData.salaryMin}
                onInput={(e) => updateField('salaryMin', e.detail.value)}
              />
              <Text className={styles.salaryDash}>—</Text>
              <Input
                className={styles.salaryInput}
                type="number"
                placeholder="最高"
                value={formData.salaryMax}
                onInput={(e) => updateField('salaryMax', e.detail.value)}
              />
              <Text className={styles.salaryUnit}>K</Text>
            </View>
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>投递信息</Text>

          <View className={styles.formRow}>
            <View className={styles.formItem} style={{ flex: 1, marginRight: 20 }}>
              <Text className={styles.label}>投递日期</Text>
              <Picker
                mode="date"
                value={formData.appliedDate}
                onChange={(e) => updateField('appliedDate', e.detail.value)}
              >
                <View className={styles.picker}>
                  <Text>{formData.appliedDate}</Text>
                  <Text className={styles.pickerArrow}>›</Text>
                </View>
              </Picker>
            </View>

            <View className={styles.formItem} style={{ flex: 1 }}>
              <Text className={styles.label}>当前状态</Text>
              <Picker
                mode="selector"
                range={statusOptions}
                value={(['pending', 'applied', 'interview', 'offer', 'rejected'] as JobStatus[]).indexOf(formData.status)}
                onChange={(e) => updateField('status', ['pending', 'applied', 'interview', 'offer', 'rejected'][e.detail.value] as JobStatus)}
              >
                <View className={styles.picker}>
                  <Text style={{ color: statusMap[formData.status].color }}>
                    {statusMap[formData.status].label}
                  </Text>
                  <Text className={styles.pickerArrow}>›</Text>
                </View>
              </Picker>
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>使用简历</Text>
            {resumeOptions.length > 0 ? (
              <Picker
                mode="selector"
                range={resumeOptions}
                value={resumeOptions.indexOf(formData.resumeVersion)}
                onChange={(e) => updateField('resumeVersion', resumeOptions[e.detail.value])}
              >
                <View className={classnames(styles.picker, !formData.resumeVersion && styles.placeholder)}>
                  <Text>{formData.resumeVersion || '请选择简历版本'}</Text>
                  <Text className={styles.pickerArrow}>›</Text>
                </View>
              </Picker>
            ) : (
              <View className={styles.picker}>
                <Text style={{ color: '#86909C' }}>暂无简历版本</Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>联系人</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>姓名</Text>
            <Input
              className={styles.input}
              placeholder="HR或面试官姓名"
              value={formData.contactName}
              onInput={(e) => updateField('contactName', e.detail.value)}
            />
          </View>

          <View className={styles.formRow}>
            <View className={styles.formItem} style={{ flex: 1, marginRight: 20 }}>
              <Text className={styles.label}>职位</Text>
              <Input
                className={styles.input}
                placeholder="如：HRBP"
                value={formData.contactPosition}
                onInput={(e) => updateField('contactPosition', e.detail.value)}
              />
            </View>
            <View className={styles.formItem} style={{ flex: 1 }}>
              <Text className={styles.label}>电话</Text>
              <Input
                className={styles.input}
                placeholder="联系电话"
                value={formData.contactPhone}
                onInput={(e) => updateField('contactPhone', e.detail.value)}
              />
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>邮箱</Text>
            <Input
              className={styles.input}
              placeholder="联系邮箱"
              value={formData.contactEmail}
              onInput={(e) => updateField('contactEmail', e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.formSection}>
          <Text className={styles.sectionTitle}>其他信息</Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>岗位描述</Text>
            <Textarea
              className={styles.textarea}
              placeholder="请输入岗位描述或JD摘要"
              value={formData.description}
              onInput={(e) => updateField('description', e.detail.value)}
              maxlength={500}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>备注</Text>
            <Textarea
              className={styles.textarea}
              placeholder="备注信息、面试复盘等"
              value={formData.review}
              onInput={(e) => updateField('review', e.detail.value)}
              maxlength={500}
            />
          </View>
        </View>

        <View className={styles.saveBtn} onClick={handleSave}>
          <Text className={styles.saveBtnText}>保存</Text>
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
};

export default JobEditPage;
