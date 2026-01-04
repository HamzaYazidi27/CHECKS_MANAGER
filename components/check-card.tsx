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
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  beneficiary: {
    fontSize: 14,
    color: '#666',
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
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
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
    color: '#999',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  notesRow: {
    flexDirection: 'column',
    marginTop: 8,
  },
  notesValue: {
    fontSize: 12,
    color: '#555',
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
    borderRadius: 6,
    alignItems: 'center',
  },
  actionCash: {
    backgroundColor: '#4CAF50',
  },
  actionDelete: {
    backgroundColor: '#f44336',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  reminderBanner: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  reminderText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
