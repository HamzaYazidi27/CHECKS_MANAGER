import { useChecks } from '@/context/checks-context';
import { Check } from '@/types';
import { useNavigation, useRoute } from '@react-navigation/native';
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

interface RouteParams {
  check: Check;
}

export default function EditCheckScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { check } = route.params as RouteParams;
  const { updateCheck, loading } = useChecks();

  const [amount, setAmount] = useState(check.amount.toString());
  const [beneficiary, setBeneficiary] = useState(check.beneficiary);
  const [checkNumber, setCheckNumber] = useState(check.checkNumber || '');
  const [depositDate, setDepositDate] = useState(check.depositDate);
  const [dueDate, setDueDate] = useState(check.dueDate);
  const [notes, setNotes] = useState(check.notes || '');

  const handleUpdateCheck = async () => {
    if (!amount || !beneficiary || !dueDate) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    try {
      await updateCheck(check.id, {
        amount: parseFloat(amount),
        beneficiary,
        checkNumber: checkNumber || undefined,
        depositDate,
        dueDate,
        notes: notes || undefined,
      });

      Alert.alert('Succès', 'Chèque mis à jour');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Modifier un chèque</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
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

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleUpdateCheck}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Mettre à jour</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  closeButton: {
    fontSize: 24,
    color: '#999',
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
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
