import { useChecks } from '@/context/checks-context';
import { CheckStatus } from '@/types';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AddCheckScreen() {
  const router = useRouter();
  const { addCheck, loading } = useChecks();
  const [amount, setAmount] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [checkNumber, setCheckNumber] = useState('');
  const [depositDate, setDepositDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  const handleAddCheck = async () => {
    if (!amount || !beneficiary || !dueDate) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    try {
      await addCheck({
        amount: parseFloat(amount),
        beneficiary,
        checkNumber: checkNumber || undefined,
        depositDate,
        dueDate,
        notes: notes || undefined,
        status: CheckStatus.PENDING,
      });

      Alert.alert('Succès', 'Chèque ajouté avec succès');
      resetForm();
      router.back();
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  const resetForm = () => {
    setAmount('');
    setBeneficiary('');
    setCheckNumber('');
    setDepositDate(new Date().toISOString().split('T')[0]);
    setDueDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setNotes('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Ajouter un chèque</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Montant *</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Bénéficiaire *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom du bénéficiaire"
          value={beneficiary}
          onChangeText={setBeneficiary}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Numéro du chèque</Text>
        <TextInput
          style={styles.input}
          placeholder="(Optionnel)"
          value={checkNumber}
          onChangeText={setCheckNumber}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Date de dépôt *</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={depositDate}
          onChangeText={setDepositDate}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Date de finalisation *</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={dueDate}
          onChangeText={setDueDate}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Notes supplémentaires"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          placeholderTextColor="#999"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleAddCheck}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Ajouter le chèque</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
