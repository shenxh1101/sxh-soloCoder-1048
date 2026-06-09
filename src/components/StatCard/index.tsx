import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface StatCardProps {
  value: number | string;
  label: string;
  color?: 'primary' | 'success' | 'pending' | 'rejected';
}

const StatCard: React.FC<StatCardProps> = ({ value, label, color = 'primary' }) => {
  return (
    <View className={styles.statCard}>
      <Text className={classnames(styles.value, styles[color])}>{value}</Text>
      <Text className={styles.label}>{label}</Text>
    </View>
  );
};

export default StatCard;
