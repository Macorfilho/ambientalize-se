import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import { calculateRisk } from '../utils/riskCalculator';
import { RiskLevel, MonitoringData } from '../types/common';

type RootStackParamList = {
  History: undefined;
  DataEntry: undefined;
  MitigationActions: { data?: MonitoringData };
  RiskVisualization: undefined;
};

type RiskVisualizationScreenProps = StackScreenProps<RootStackParamList, 'RiskVisualization'>;

export default function RiskVisualizationScreen({ navigation, route }: RiskVisualizationScreenProps) {
  const [displayData, setDisplayData] = useState<MonitoringData | null>(null);
  const [risk, setRisk] = useState<RiskLevel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async (dataFromRoute?: MonitoringData) => {
    setLoading(true);
    try {
      let dataToProcess: MonitoringData | null = null;

      if (dataFromRoute) {
        dataToProcess = dataFromRoute;
      } else {
        const existingData = await AsyncStorage.getItem('monitoringData');
        if (existingData) {
          const dataArray: MonitoringData[] = JSON.parse(existingData);
          if (dataArray.length > 0) {
            dataToProcess = dataArray[dataArray.length - 1];
          }
        }
      }

      setDisplayData(dataToProcess);
      if (dataToProcess) {
        setRisk(calculateRisk(dataToProcess));
      } else {
        setRisk({ text: 'Sem Dados', color: '#808080' });
      }
    } catch (error) {
      console.error('Failed to load data for risk visualization:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados de risco.');
      setDisplayData(null);
      setRisk({ text: 'Erro no Cálculo', color: '#808080' });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const dataFromRoute = route.params?.data;
      loadData(dataFromRoute);
      return () => {};
    }, [route.params?.data])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Visualização de Riscos</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4682B4" />
        ) : displayData ? (
          <View style={styles.dataCard}>
            <Text style={styles.dataCardTitle}>Registro Analisado:</Text>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Umidade:</Text>
              <Text style={styles.dataValue}>{displayData.humidity || 'N/A'}%</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Inclinação:</Text>
              <Text style={styles.dataValue}>{displayData.inclination || 'N/A'}°</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Choveu na última semana:</Text>
              <Text style={styles.dataValue}>{displayData.choveuUltimaSemana ? 'Sim' : 'Não'}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Temperatura Ambiente:</Text>
              <Text style={styles.dataValue}>{displayData.ambientTemperature || 'N/A'}°C</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Localização:</Text>
              <Text style={styles.dataValue}>{displayData.location || 'N/A'}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Registrado em:</Text>
              <Text style={styles.dataValue}>{new Date(displayData.timestamp).toLocaleString()}</Text>
            </View>

            <View style={[styles.riskCard, { borderColor: risk?.color || '#808080' }]}>
              <Text style={styles.riskLabel}>Nível de Risco:</Text>
              <Text style={[styles.riskText, { color: risk?.color || '#808080' }]}>
                {risk?.text || 'N/A'}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noDataText}>Nenhum dado de monitoramento disponível para análise.</Text>
        )}

        <View style={styles.navigationButtonsContainer}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('DataEntry')}>
            <Text style={styles.navButtonText}>Inserir Dados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('History')}>
            <Text style={styles.navButtonText}>Ver Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MitigationActions')}>
            <Text style={styles.navButtonText}>Ações de Mitigação</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // AliceBlue
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2F4F4F', // DarkSlateGray
    marginBottom: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dataCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E0FFFF', // LightCyan
  },
  dataCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  dataValue: {
    fontSize: 16,
    color: '#4682B4', // SteelBlue
    fontWeight: '600',
  },
  riskCard: {
    marginTop: 25,
    borderTopWidth: 2, // Mais espesso para destaque
    paddingTop: 15,
    alignItems: 'center',
  },
  riskLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2F4F4F',
    marginBottom: 12,
  },
  riskText: {
    fontSize: 48, // Maior para destaque
    fontWeight: 'bold',
    textTransform: 'uppercase', // Maiúsculas para o nível de risco
  },
  noDataText: {
    fontSize: 18,
    color: '#696969',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 30,
  },
  navigationButtonsContainer: {
    width: '100%',
  },
  navButton: {
    backgroundColor: '#6A5ACD', // SlateBlue
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
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});