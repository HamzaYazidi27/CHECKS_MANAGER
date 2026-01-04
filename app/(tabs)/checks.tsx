import CheckCard from '@/components/check-card';
import { useChecks } from '@/context/checks-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type FilterTab = 'all' | 'due' | 'upcoming' | 'cashed';

export default function ChecksScreen() {
  const router = useRouter();
  const { checks, loading, refreshChecks, dueChecks, upcomingChecks, cashedChecks } = useChecks();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshChecks();
    }, [refreshChecks])
  );

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

  return (
    <View style={styles.container}>
      {/* Header avec stats */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Chèques</Text>
        <View style={styles.statsContainer}>
          <StatCard label="À encaisser" value={stats.due} color="#f44336" />
          <StatCard label="Bientôt" value={stats.upcoming} color="#FF9800" />
          <StatCard label="Encaissés" value={stats.cashed} color="#4CAF50" />
        </View>
      </View>

      {/* Tabs de filtrage */}
      <View style={styles.tabsContainer}>
        {['all', 'due', 'upcoming', 'cashed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab as FilterTab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab === 'all' && 'Tous'}
              {tab === 'due' && 'À encaisser'}
              {tab === 'upcoming' && 'Bientôt'}
              {tab === 'cashed' && 'Encaissés'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste des chèques */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <ScrollView
          style={styles.checksContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredChecks.length > 0 ? (
            <View style={styles.checksList}>
              {filteredChecks.map((check) => (
                <CheckCard key={check.id} check={check} />
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
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statColorBar, { backgroundColor: color }]} />
      <View style={styles.statContent}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  statColorBar: {
    width: 4,
  },
  statContent: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#fff',
  },
  checksContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  checksList: {
    paddingBottom: 20,
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
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});
