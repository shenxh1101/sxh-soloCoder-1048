import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';

const JobEditPage: React.FC = () => {
  return (
    <ScrollView className={styles.page} scrollY>
      <Text className={styles.icon}>📝</Text>
      <Text className={styles.title}>新增岗位</Text>
      <Text className={styles.desc}>功能正在开发中...</Text>
    </ScrollView>
  );
};

export default JobEditPage;
