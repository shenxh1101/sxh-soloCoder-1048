import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { JobStatus } from '@/types';

interface StatusTagProps {
  status: JobStatus;
  label: string;
}

const StatusTag: React.FC<StatusTagProps> = ({ status, label }) => {
  return (
    <View className={classnames(styles.statusTag, styles[status])}>
      <Text>{label}</Text>
    </View>
  );
};

export default StatusTag;
