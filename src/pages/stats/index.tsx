import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import StatCard from '@/components/StatCard';
import { useStore } from '@/store/useStore';

const StatsPage: React.FC = () => {
  const { stats } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    console.log('[StatsPage] 下拉刷新');
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

  const maxCityCount = Math.max(...stats.cityDistribution.map((c) => c.count), 1);
  const maxIndustryCount = Math.max(...stats.industryDistribution.map((i) => i.count), 1);
  const maxWeeklyCount = Math.max(...stats.weeklyTrend.map((w) => w.count), 1);
  const maxFunnelCount = Math.max(...stats.stageFunnel.map((s) => s.count), 1);

  return (
    <ScrollView
      className={styles.page}
      scrollY
      onScrollToUpper={handleScrollToUpper}
    >
      <View className="container">
        <View className={styles.statsGrid}>
          <StatCard
            value={stats.totalJobs}
            label="总投递数"
            color="primary"
          />
          <StatCard
            value={stats.interviewJobs}
            label="面试中"
            color="primary"
          />
          <StatCard
            value={stats.offerJobs}
            label="已Offer"
            color="success"
          />
          <StatCard
            value={stats.rejectedJobs}
            label="已拒绝"
            color="rejected"
          />
        </View>

        <View className={styles.conversionRate}>
          <View className={styles.rateInfo}>
            <Text className={styles.rateLabel}>综合转化率</Text>
            <Text className={styles.rateValue}>{stats.conversionRate}%</Text>
            <Text className={styles.rateDesc}>
              每投递 {Math.round(100 / stats.conversionRate)} 份简历获得 1 个 Offer
            </Text>
          </View>
          <Text className={styles.rateIcon}>📈</Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>投递转化漏斗</Text>
          <View className={styles.card}>
            <View className={styles.funnelChart}>
              {stats.stageFunnel.map((stage, index) => (
                <View
                  key={stage.stage}
                  className={styles.funnelItem}
                  style={{
                    width: `${30 + ((maxFunnelCount - stage.count) / maxFunnelCount) * 30 + (maxFunnelCount - index) * 8}%`,
                    opacity: 0.6 + (index / stats.stageFunnel.length) * 0.4
                  }}
                >
                  <Text className={styles.funnelStage}>{stage.stage}</Text>
                  <Text className={styles.funnelCount}>{stage.count}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>本周投递趋势</Text>
          <View className={styles.card}>
            <View className={styles.weeklyChart}>
              {stats.weeklyTrend.map((item) => (
                <View key={item.date} className={styles.weeklyBarWrapper}>
                  <View
                    className={styles.weeklyBar}
                    style={{
                      height: `${maxWeeklyCount > 0 ? (item.count / maxWeeklyCount) * 100 : 10}%`,
                      opacity: item.count > 0 ? 1 : 0.3
                    }}
                  />
                  <Text className={styles.weeklyValue}>{item.count}</Text>
                  <Text className={styles.weeklyLabel}>{item.date}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.twoColumns}>
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>城市分布</Text>
            <View className={styles.card}>
              {stats.cityDistribution.map((item) => (
                <View key={item.city} className={styles.distributionItem}>
                  <Text className={styles.distributionLabel}>{item.city}</Text>
                  <View className={styles.distributionBar}>
                    <View
                      className={`${styles.distributionFill} ${styles.cityFill}`}
                      style={{ width: `${(item.count / maxCityCount) * 100}%` }}
                    />
                  </View>
                  <Text className={styles.distributionValue}>{item.count}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.section}>
            <Text className={styles.sectionTitle}>行业分布</Text>
            <View className={styles.card}>
              {stats.industryDistribution.map((item) => (
                <View key={item.industry} className={styles.distributionItem}>
                  <Text className={styles.distributionLabel}>{item.industry}</Text>
                  <View className={styles.distributionBar}>
                    <View
                      className={`${styles.distributionFill} ${styles.industryFill}`}
                      style={{ width: `${(item.count / maxIndustryCount) * 100}%` }}
                    />
                  </View>
                  <Text className={styles.distributionValue}>{item.count}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default StatsPage;
