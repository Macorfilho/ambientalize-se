import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

import { MonitoringData } from '../types/common';

type DataEntryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DataEntry'>;

interface DataEntryScreenProps {
  navigation: DataEntryScreenNavigationProp;
}

export default function DataEntryScreen({ navigation }: DataEntryScreenProps) {
  const [humidity, setHumidity] = useState<string>('');
  const [inclination, setInclination] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [choveuUltimaSemana, setChoveuUltimaSemana] = useState<boolean>(false);
  const [ambientTemperature, setAmbientTemperature] = useState<string>('');

  const saveData = async () => {
  if (
    !humidity.trim() ||
    !inclination.trim() ||
    !location.trim() ||
    !ambientTemperature.trim()
  ) {
    Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  const newData: MonitoringData = {
    id: Date.now().toString(),
    humidity,
    inclination,
    location,
    timestamp: new Date().toISOString(),
    choveuUltimaSemana,
    ambientTemperature,
  };

  try {
    const existingData = await AsyncStorage.getItem('monitoringData');
    const dataArray: MonitoringData[] = existingData ? JSON.parse(existingData) : [];
    dataArray.push(newData);
    await AsyncStorage.setItem('monitoringData', JSON.stringify(dataArray));

    Alert.alert('Sucesso', 'Dados de monitoramento salvos com sucesso!');
    setHumidity('');
    setInclination('');
    setLocation('');
    setChoveuUltimaSemana(false);
    setAmbientTemperature('');
    navigation.navigate('RiskVisualization');
  } catch (error) {
    console.error('Erro ao salvar dados no AsyncStorage:', error);
    Alert.alert('Erro', 'Não foi possível salvar os dados. Tente novamente.');
  }
  };

  return (
  <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <SafeAreaView style={styles.content}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Inserir Dados Ambientais</Text>
      <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Umidade do Solo (%)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={humidity}
        onChangeText={setHumidity}
        placeholder="Ex: 75"
        placeholderTextColor="#A0A0A0"
      />
      </View>
      <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Inclinação (graus)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={inclination}
        onChangeText={setInclination}
        placeholder="Ex: 15"
        placeholderTextColor="#A0A0A0"
      />
      </View>
      <View style={styles.switchContainer}>
      <Text style={styles.switchLabel}>Choveu na última semana?</Text>
      <Switch
        trackColor={{ false: '#BDC3C7', true: '#66BB6A' }}
        thumbColor={choveuUltimaSemana ? '#4CAF50' : '#ECF0F1'}
        ios_backgroundColor="#BDC3C7"
        onValueChange={setChoveuUltimaSemana}
        value={choveuUltimaSemana}
      />
      </View>
      <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Temperatura Ambiente (°C)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={ambientTemperature}
        onChangeText={setAmbientTemperature}
        placeholder="Ex: 28"
        placeholderTextColor="#A0A0A0"
      />
      </View>
      <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Localização</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Ex: Morro da Babilônia"
        placeholderTextColor="#A0A0A0"
      />
      </View>
      <TouchableOpacity style={styles.buttonPrimary} onPress={saveData}>
      <Text style={styles.buttonPrimaryText}>Salvar Dados</Text>
      </TouchableOpacity>
      <View style={styles.navigationButtonsContainer}>
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('History')} >
        <Text style={styles.historyButtonText}>Ver Histórico</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2F4F4F',
    marginBottom: 44,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    color: '#4682B4',
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#B0C4DE',
    borderRadius: 14,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  buttonPrimary: {
    backgroundColor: '#4682B4',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 32,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginTop: 24,
    marginBottom: 36,
  },
  buttonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  navigationButtonsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#F0F8FF',
  },
  historyButton: {
    backgroundColor: '#6A5ACD',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 12,
  },
  historyButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#6A5ACD',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 26,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 14,
  },
  buttonSecondaryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});
