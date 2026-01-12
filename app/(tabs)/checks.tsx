import CheckCard from '@/components/check-card';
import { useChecks } from '@/context/checks-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Easing,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';

type FilterTab = 'all' | 'due' | 'upcoming' | 'cashed';

export default function ChecksScreen() {
  const router = useRouter();
  const { checks, loading, refreshChecks, dueChecks, upcomingChecks, cashedChecks } = useChecks();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();
  const introAnim = useRef(new Animated.Value(0)).current;
  const tabIndicator = useRef(new Animated.Value(0)).current;

  const tabs = useMemo(
    () => [
      { key: 'all', label: 'Tous' },
      { key: 'due', label: 'À encaisser' },
      { key: 'upcoming', label: 'Bientôt' },
      { key: 'cashed', label: 'Encaissés' },
    ],
    []
  );

  const tabsHorizontalMargin = 20;
  const tabsInnerPadding = 6;
  const tabWidth = (width - tabsHorizontalMargin * 2 - tabsInnerPadding * 2) / tabs.length;

  useFocusEffect(
    useCallback(() => {
      refreshChecks();
    }, [refreshChecks])
  );

  useEffect(() => {
    Animated.timing(introAnim, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [introAnim]);

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.key === activeTab);
    Animated.spring(tabIndicator, {
      toValue: index * tabWidth,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
      mass: 0.7,
    }).start();
  }, [activeTab, tabIndicator, tabWidth, tabs]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshChecks();
    setRefreshing(false);
  };

  const getFilteredChecks = () => {
    switch (activeTab) {
      case 'due':
        return dueChecks();
      case 'upcoming':
        return upcomingChecks();
      case 'cashed':
        return cashedChecks();
      case 'all':
      default:
        return checks;
    }
  };

  const filteredChecks = getFilteredChecks();

  const stats = {
    total: checks.length,
    due: dueChecks().length,
    upcoming: upcomingChecks().length,
    cashed: cashedChecks().length,
  };

  const headerStyle = {
    opacity: introAnim,
    transform: [
      {
        translateY: introAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  };

  const cardEnterStyle = {
    opacity: introAnim,
    transform: [
      {
        translateY: introAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Header avec stats */}
      <Animated.View style={[styles.header, headerStyle]}>
        <Text style={styles.headerEyebrow}>Tableau de bord</Text>
        <Text style={styles.headerTitle}>Mes Chèques</Text>
        <Text style={styles.headerSubtitle}>
          Suivez l’état de vos encaissements en temps réel.
        </Text>
        <View style={styles.statsContainer}>
          <StatCard label="À encaisser" value={stats.due} color="#EF4444" index={0} />
          <StatCard label="Bientôt" value={stats.upcoming} color="#F59E0B" index={1} />
          <StatCard label="Encaissés" value={stats.cashed} color="#22C55E" index={2} />
        </View>
      </Animated.View>

      {/* Tabs de filtrage */}
      <View style={styles.tabsContainer}>
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              width: tabWidth,
              transform: [{ translateX: tabIndicator }],
            },
          ]}
        />
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => setActiveTab(tab.key as FilterTab)}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste des chèques */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <ScrollView
          style={styles.checksContainer}
          contentContainerStyle={styles.checksContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />
          }
        >
          {filteredChecks.length > 0 ? (
            <View style={styles.checksList}>
              {filteredChecks.map((check) => (
                <Animated.View
                  key={check.id}
                  style={[styles.checkCardWrapper, cardEnterStyle]}
                >
                  <CheckCard check={check} />
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>
                {activeTab === 'all'
                  ? 'Aucun chèque enregistré'
                  : 'Aucun chèque dans cette catégorie'}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-check')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  index: number;
}

function StatCard({ label, value, color, index }: StatCardProps) {
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 500,
      delay: 120 + index * 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [cardAnim, index]);

  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          opacity: cardAnim,
          transform: [
            {
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[styles.statColorBar, { backgroundColor: color }]} />
      <View style={styles.statContent}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerEyebrow: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#94A3B8',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#CBD5F5',
    marginTop: 6,
    marginBottom: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  statColorBar: {
    width: 4,
  },
  statContent: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 20,
    marginTop: -18,
    padding: 6,
    borderRadius: 999,
    position: 'relative',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 999,
    zIndex: 1,
  },
  tabText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    left: 6,
    top: 6,
    bottom: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 999,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  checksContainer: {
    flex: 1,
    marginTop: 12,
  },
  checksContent: {
    paddingBottom: 120,
  },
  checksList: {
    paddingBottom: 16,
  },
  checkCardWrapper: {
    opacity: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});
