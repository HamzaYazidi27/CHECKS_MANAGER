import { useChecks } from '@/context/checks-context';
import { Check, CheckStatus } from '@/types';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface CheckCardProps {
  check: Check;
  onPress?: () => void;
}

export default function CheckCard({ check, onPress }: CheckCardProps) {
  const { deleteCheck, markAsCashed } = useChecks();

  const getStatusColor = (status: CheckStatus) => {
    switch (status) {
      case CheckStatus.PENDING:
        return '#4CAF50'; // Vert
      case CheckStatus.UPCOMING:
        return '#FF9800'; // Orange
      case CheckStatus.DUE:
        return '#f44336'; // Rouge
      case CheckStatus.CASHED:
        return '#9E9E9E'; // Gris
      default:
        return '#757575';
    }
  };

  const getStatusLabel = (status: CheckStatus) => {
    switch (status) {
      case CheckStatus.PENDING:
        return 'En attente';
      case CheckStatus.UPCOMING:
        return 'À encaisser bientôt';
      case CheckStatus.DUE:
        return 'À encaisser';
      case CheckStatus.CASHED:
        return 'Encaissé';
      default:
        return status;
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le chèque',
      'Êtes-vous sûr de vouloir supprimer ce chèque?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCheck(check.id);
              Alert.alert('Succès', 'Chèque supprimé');
            } catch (error: any) {
              Alert.alert('Erreur', error.message);
            }
          },
        },
      ]
    );
  };

  const handleMarkAsCashed = async () => {
    try {
      await markAsCashed(check.id);
      Alert.alert('Succès', 'Chèque marqué comme encaissé');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  const daysUntilDue = Math.ceil(
    (new Date(check.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculer les heures restantes pour le rappel 48h
  const hoursUntilDue = Math.ceil(
    (new Date(check.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60)
  );
  const hasReminder48h = hoursUntilDue <= 48 && hoursUntilDue > 0 && check.status !== 'cashed';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {hasReminder48h && (
        <View style={styles.reminderBanner}>
          <Text style={styles.reminderText}>⏰ RAPPEL 48h - Expire dans {hoursUntilDue}h</Text>
        </View>
      )}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.amount}>{check.amount.toFixed(2)} DH</Text>
          <Text style={styles.beneficiary}>{check.beneficiary}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(check.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusLabel(check.status)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        {check.checkNumber && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>N° du chèque:</Text>
            <Text style={styles.detailValue}>{check.checkNumber}</Text>
          </View>
        )}

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date de dépôt:</Text>
          <Text style={styles.detailValue}>{check.depositDate}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date de finalisation:</Text>
          <Text style={styles.detailValue}>{check.dueDate}</Text>
        </View>

        {check.status !== CheckStatus.CASHED && daysUntilDue >= 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Jours restants:</Text>
            <Text
              style={[
                styles.detailValue,
                daysUntilDue <= 7 && { color: '#f44336' },
              ]}
            >
              {daysUntilDue} jour(s)
            </Text>
          </View>
        )}

        {check.notes && (
          <View style={[styles.detailRow, styles.notesRow]}>
            <Text style={styles.detailLabel}>Notes:</Text>
            <Text style={styles.notesValue}>{check.notes}</Text>
          </View>
        )}
      </View>

      {check.status !== CheckStatus.CASHED && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionCash]}
            onPress={handleMarkAsCashed}
          >
            <Text style={styles.actionText}>✓ Encaisser</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionDelete]}
            onPress={handleDelete}
          >
            <Text style={styles.actionText}>🗑 Supprimer</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 15,
    marginHorizontal: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  amount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  beneficiary: {
    fontSize: 14,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 12,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  notesRow: {
    flexDirection: 'column',
    marginTop: 8,
  },
  notesValue: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionCash: {
    backgroundColor: '#22C55E',
  },
  actionDelete: {
    backgroundColor: '#EF4444',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  reminderBanner: {
    backgroundColor: '#F97316',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  reminderText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
