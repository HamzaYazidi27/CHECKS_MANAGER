import { Check, CheckStatus } from '@/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatisticsProps {
  checks: Check[];
}

export default function Statistics({ checks }: StatisticsProps) {
  const totalAmount = checks.reduce((sum, check) => sum + check.amount, 0);
  const dueAmount = checks
    .filter(c => c.status === CheckStatus.DUE)
    .reduce((sum, check) => sum + check.amount, 0);
  const cashedAmount = checks
    .filter(c => c.status === CheckStatus.CASHED)
    .reduce((sum, check) => sum + check.amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.value}>{totalAmount.toFixed(2)} DH</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.stat}>
        <Text style={styles.label}>À encaisser</Text>
        <Text style={[styles.value, styles.dueValue]}>
          {dueAmount.toFixed(2)} DH
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.stat}>
        <Text style={styles.label}>Encaissés</Text>
        <Text style={[styles.value, styles.cashedValue]}>
          {cashedAmount.toFixed(2)} DH
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
  label: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  dueValue: {
    color: '#f44336',
  },
  cashedValue: {
    color: '#4CAF50',
  },
});
