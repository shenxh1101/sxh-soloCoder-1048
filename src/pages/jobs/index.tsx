import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import JobCard from '@/components/JobCard';
import EmptyState from '@/components/EmptyState';
import { useStore } from '@/store/useStore';
import { statusMap, cityOptions, industryOptions } from '@/data/mockJobs';
import type { JobStatus } from '@/types';

const JobsPage: React.FC = () => {
  const { jobs } = useStore();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeStatus, setActiveStatus] = useState<JobStatus | 'all'>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [tempCities, setTempCities] = useState<string[]>([]);
  const [tempIndustries, setTempIndustries] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statusTabs = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待投递' },
    { key: 'applied', label: '已投递' },
    { key: 'interview', label: '面试中' },
    { key: 'offer', label: 'Offer' },
    { key: 'rejected', label: '已拒绝' }
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchKeyword =
        !searchKeyword ||
        job.company.includes(searchKeyword) ||
        job.position.includes(searchKeyword);
      const matchStatus = activeStatus === 'all' || job.status === activeStatus;
      const matchCity =
        selectedCities.length === 0 || selectedCities.includes(job.city);
      const matchIndustry =
        selectedIndustries.length === 0 || selectedIndustries.includes(job.industry);
      return matchKeyword && matchStatus && matchCity && matchIndustry;
    });
  }, [jobs, searchKeyword, activeStatus, selectedCities, selectedIndustries]);

  const handleRefresh = () => {
    console.log('[JobsPage] 下拉刷新');
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

  const openFilter = () => {
    console.log('[JobsPage] 打开筛选');
    setTempCities([...selectedCities]);
    setTempIndustries([...selectedIndustries]);
    setShowFilter(true);
  };

  const closeFilter = () => {
    setShowFilter(false);
  };

  const toggleCity = (city: string) => {
    setTempCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

  const toggleIndustry = (industry: string) => {
    setTempIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  };

  const resetFilter = () => {
    setTempCities([]);
    setTempIndustries([]);
  };

  const confirmFilter = () => {
    setSelectedCities(tempCities);
    setSelectedIndustries(tempIndustries);
    closeFilter();
  };

  const goToAddJob = () => {
    console.log('[JobsPage] 新增岗位');
    Taro.navigateTo({ url: '/pages/job-edit/index' });
  };

  const clearCity = (city: string, e) => {
    e.stopPropagation();
    setSelectedCities((prev) => prev.filter((c) => c !== city));
  };

  const clearIndustry = (industry: string, e) => {
    e.stopPropagation();
    setSelectedIndustries((prev) => prev.filter((i) => i !== industry));
  };

  return (
    <>
      <ScrollView
        className={styles.page}
        scrollY
        onScrollToUpper={handleScrollToUpper}
      >
        <View className="container">
          <View className={styles.searchBar}>
            <Text className={styles.searchIcon}>🔍</Text>
            <Input
              className={styles.searchInput}
              placeholder="搜索公司或职位..."
              placeholderClass="input-placeholder"
              value={searchKeyword}
              onInput={(e) => setSearchKeyword(e.detail.value)}
            />
          </View>

          <ScrollView
            className={styles.statusTabs}
            scrollX
            enhanced
            showScrollbar={false}
          >
            {statusTabs.map((tab) => (
              <View
                key={tab.key}
                className={classnames(
                  styles.statusTab,
                  activeStatus === tab.key && styles.active
                )}
                onClick={() => setActiveStatus(tab.key as JobStatus | 'all')}
              >
                <Text>{tab.label}</Text>
              </View>
            ))}
          </ScrollView>

          <View className={styles.filterBar}>
            <View className={styles.selectedFilters}>
              {selectedCities.map((city) => (
                <View
                  key={city}
                  className={styles.filterTag}
                  onClick={(e) => clearCity(city, e)}
                >
                  <Text>{city} ✕</Text>
                </View>
              ))}
              {selectedIndustries.map((industry) => (
                <View
                  key={industry}
                  className={styles.filterTag}
                  onClick={(e) => clearIndustry(industry, e)}
                >
                  <Text>{industry} ✕</Text>
                </View>
              ))}
            </View>
            <View className={styles.filterBtn} onClick={openFilter}>
              <Text className={styles.filterIcon}>⚙️</Text>
              <Text>筛选</Text>
            </View>
          </View>

          <View className={styles.jobList}>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <EmptyState icon="🔍" text="没有找到符合条件的岗位" />
            )}
          </View>
        </View>
      </ScrollView>

      <View className={styles.fab} onClick={goToAddJob}>
        <Text className={styles.fabIcon}>+</Text>
      </View>

      {showFilter && (
        <View className={styles.filterModal} onClick={closeFilter}>
          <View className={styles.filterContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>筛选条件</Text>
              <Text className={styles.modalClose} onClick={closeFilter}>✕</Text>
            </View>

            <View className={styles.filterSection}>
              <Text className={styles.filterSectionTitle}>城市</Text>
              <View className={styles.filterOptions}>
                {cityOptions.map((city) => (
                  <View
                    key={city}
                    className={classnames(
                      styles.filterOption,
                      tempCities.includes(city) && styles.optionActive
                    )}
                    onClick={() => toggleCity(city)}
                  >
                    <Text>{city}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.filterSection}>
              <Text className={styles.filterSectionTitle}>行业</Text>
              <View className={styles.filterOptions}>
                {industryOptions.map((industry) => (
                  <View
                    key={industry}
                    className={classnames(
                      styles.filterOption,
                      tempIndustries.includes(industry) && styles.optionActive
                    )}
                    onClick={() => toggleIndustry(industry)}
                  >
                    <Text>{industry}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.modalFooter}>
              <View className={styles.resetBtn} onClick={resetFilter}>
                <Text>重置</Text>
              </View>
              <View className={styles.confirmBtn} onClick={confirmFilter}>
                <Text>确定</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default JobsPage;
