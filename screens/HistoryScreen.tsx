import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  History: undefined;
  DataEntry: undefined;
  MitigationActions: { data?: MonitoringData };
  RiskVisualization: undefined;
};

import { calculateRisk } from '../utils/riskCalculator';
import { RiskLevel, MonitoringData } from '../types/common';

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'History'>;

interface HistoryScreenProps {
  navigation: HistoryScreenNavigationProp;
}

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const [historyData, setHistoryData] = useState<MonitoringData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const existingData = await AsyncStorage.getItem('monitoringData');
      if (existingData) {
        const dataArray: MonitoringData[] = JSON.parse(existingData);
        const sortedData = dataArray.sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setHistoryData(sortedData);
      } else {
        setHistoryData([]);
      }
    } catch (error) {
      console.error('Failed to load history from AsyncStorage:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico de dados.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'Confirmar Limpeza',
      'Tem certeza que deseja apagar TODOS os dados de monitoramento? Esta ação é irreversível.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Apagar Tudo',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('monitoringData');
              setHistoryData([]);
              Alert.alert('Sucesso', 'Todos os dados foram apagados!');
            } catch (error) {
              console.error('Failed to clear data from AsyncStorage:', error);
              Alert.alert('Erro', 'Não foi possível apagar os dados. Tente novamente.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
      return () => {};
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHistory();
  }, []);

  const renderItem = ({ item }: { item: MonitoringData }) => {
    let itemRisk: RiskLevel;

    if (item) {
      itemRisk = calculateRisk(item);
    } else {
      itemRisk = { text: 'Dados Ausentes', color: '#A9A9A9' };
    }

    return (
      <TouchableOpacity
        style={styles.recordCard}
        onPress={() => navigation.navigate('MitigationActions', { data: item })}
      >
        <Text style={styles.recordTimestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
        <Text style={styles.recordDetail}>
          Umidade: <Text style={styles.recordValue}>{item.humidity || 'N/A'}%</Text>
        </Text>
        <Text style={styles.recordDetail}>
          Inclinação: <Text style={styles.recordValue}>{item.inclination || 'N/A'}°</Text>
        </Text>
        <Text style={styles.recordDetail}>
          Choveu na última semana: <Text style={styles.recordValue}>{item.choveuUltimaSemana ? 'Sim' : 'Não'}</Text>
        </Text>
        <Text style={styles.recordDetail}>
          Temperatura Ambiente: <Text style={styles.recordValue}>{item.ambientTemperature || 'N/A'}°C</Text>
        </Text>
        <Text style={styles.recordDetail}>
          Localização: <Text style={styles.recordValue}>{item.location || 'N/A'}</Text>
        </Text>

        <View style={styles.itemRiskContainer}>
          <Text style={styles.itemRiskLabel}>Risco:</Text>
          <Text style={[styles.itemRiskText, { color: itemRisk.color }]}>
            {itemRisk.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ListEmptyComponent = () => (
    <View style={styles.emptyListContainer}>
      <Text style={styles.noDataText}>Nenhum registro de monitoramento ainda.</Text>
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('DataEntry')}>
        <Text style={styles.navButtonText}>Inserir Dados Agora</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Histórico de Monitoramento</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4682B4" />
      ) : (
        <FlatList
          data={historyData}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.timestamp + '-' + index}
          contentContainerStyle={historyData.length > 0 ? styles.listContent : styles.emptyListContent}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4682B4']} />
          }
        />
      )}

      {!loading && (
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('DataEntry')}>
            <Text style={styles.navButtonText}>Inserir Dados</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('RiskVisualization')}>
            <Text style={styles.navButtonText}>Ver Risco Atual</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MitigationActions')}>
            <Text style={styles.navButtonText}>Ações de Mitigação (Geral)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.navButton, styles.clearDataButton]} onPress={clearAllData}>
            <Text style={styles.clearDataButtonText}>Limpar Todos os Dados</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2F4F4F',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  recordTimestamp: {
    fontSize: 14,
    color: '#808080',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 8,
  },
  recordDetail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  recordValue: {
    fontWeight: '600',
    color: '#4682B4',
  },
  itemRiskContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemRiskLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  itemRiskText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#696969',
    textAlign: 'center',
    marginBottom: 20,
  },
  bottomButtonsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#F0F8FF',
  },
  navButton: {
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
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  clearDataButton: {
    backgroundColor: '#DC143C',
    marginTop: 10,
  },
  clearDataButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});