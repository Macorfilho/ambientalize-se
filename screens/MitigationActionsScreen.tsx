import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import { calculateRisk } from '../utils/riskCalculator';
import { MonitoringData, RiskLevel } from '../types/common';

type RootStackParamList = {
  History: undefined;
  DataEntry: undefined;
  MitigationActions: { data?: MonitoringData };
  RiskVisualization: undefined;
};

type MitigationActionsScreenProps = StackScreenProps<RootStackParamList, 'MitigationActions'>;

const mitigationActions: { [key: string]: string[] } = {
  Baixo: [
    'Continue o monitoramento regular.',
    'Mantenha as áreas de drenagem limpas.',
    'Observe a presença de trincas ou movimentações no solo.',
  ],
  Moderado: [
    'Aumente a frequência do monitoramento.',
    'Evite acumular água em áreas vulneráveis.',
    'Comunique-se com a defesa civil para orientações.',
    'Prepare um plano de evacuação para a família.',
  ],
  Elevado: [
    'Evacue a área imediatamente, se possível, para um local seguro.',
    'Acione a defesa civil local (ligue para 199 ou 193).',
    'Avise vizinhos e outras pessoas na área de risco.',
    'Não retorne à área até que as autoridades declarem ser seguro.',
  ],
  Crítico: [
    'Evacue a área IMEDIATAMENTE e acione as autoridades de emergência (Defesa Civil: 199 / Bombeiros: 193).',
    'Permaneça em local seguro e siga todas as instruções das autoridades.',
    'Mantenha contato com a família e vizinhos para garantir a segurança de todos.',
    'NÃO retorne à área sob hipótese alguma antes da liberação oficial.',
  ],
  'Sem Dados': [
    'Insira dados de monitoramento para avaliar o risco.',
    'Verifique a funcionalidade dos sensores e a conexão do aplicativo.',
  ],
  'Dados Inválidos': [
    'Verifique a correção dos dados inseridos. Certifique-se de que umidade, inclinação e temperatura são números válidos.',
    'Recolha novos dados com atenção e precisão.',
  ],
  'Erro no Cálculo': [
    'Ocorreu um erro ao processar os dados. Tente reiniciar o aplicativo.',
    'Se o problema persistir, verifique a integridade dos dados e o código de cálculo.',
  ],
  'Dados Ausentes': [
    'Um ou mais dados essenciais para o cálculo do risco estão faltando.',
    'Por favor, insira todos os dados de monitoramento para obter uma avaliação de risco precisa.'
  ],
};

export default function MitigationActionsScreen({ route }: MitigationActionsScreenProps){
  const [currentRisk, setCurrentRisk] = useState<RiskLevel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [analyzedData, setAnalyzedData] = useState<MonitoringData | null>(null);

  const processAndDisplayData = async (dataToUse?: MonitoringData) => {
    setLoading(true);
    try {
      let dataForAnalysis: MonitoringData | null = null;

      if (dataToUse) {
        dataForAnalysis = dataToUse;
      } else {
        const existingData = await AsyncStorage.getItem('monitoringData');
        if (existingData) {
          const dataArray: MonitoringData[] = JSON.parse(existingData);
          if (dataArray.length > 0) {
            dataForAnalysis = dataArray[dataArray.length - 1];
          }
        }
      }

      setAnalyzedData(dataForAnalysis);
      if (dataForAnalysis) {
        setCurrentRisk(calculateRisk(dataForAnalysis));
      } else {
        setCurrentRisk({ text: 'Sem Dados', color: '#808080' });
      }
    } catch (error) {
      console.error('Failed to process data for mitigation actions:', error);
      Alert.alert('Erro', 'Não foi possível processar os dados para as ações de mitigação.');
      setAnalyzedData(null);
      setCurrentRisk({ text: 'Erro no Cálculo', color: '#808080' });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const dataFromRoute = route.params?.data;
      processAndDisplayData(dataFromRoute);
      return () => {};
    }, [route.params?.data])
  );

  const actionsToDisplay = currentRisk ? mitigationActions[currentRisk.text] : [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Ações de Mitigação</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4682B4" />
        ) : (
          <View style={styles.content}>
            {currentRisk && (
              <View style={[styles.riskInfoCard, { borderColor: currentRisk.color }]}>
                <Text style={styles.currentRiskLabel}>Nível de Risco Avaliado:</Text>
                <Text style={[styles.currentRiskText, { color: currentRisk.color }]}>
                  {currentRisk.text}
                </Text>
              </View>
            )}

            {analyzedData && (
              <View style={styles.dataDetailsCard}>
                <Text style={styles.dataDetailsTitle}>Detalhes do Registro:</Text>
                <Text style={styles.dataDetailsText}>Umidade: {analyzedData.humidity || 'N/A'}%</Text>
                <Text style={styles.dataDetailsText}>Inclinação: {analyzedData.inclination || 'N/A'}°</Text>
                <Text style={styles.dataDetailsText}>Choveu na última semana: {analyzedData.choveuUltimaSemana ? 'Sim' : 'Não'}</Text>
                <Text style={styles.dataDetailsText}>Temperatura Ambiente: {analyzedData.ambientTemperature || 'N/A'}°C</Text>
                <Text style={styles.dataDetailsText}>Localização: {analyzedData.location || 'N/A'}</Text>
                <Text style={styles.dataDetailsText}>Registrado em: {new Date(analyzedData.timestamp).toLocaleString()}</Text>
              </View>
            )}

            <Text style={styles.actionsHeader}>Ações Recomendadas:</Text>
            {actionsToDisplay && actionsToDisplay.length > 0 ? (
              actionsToDisplay.map((action, index) => (
                <View key={index} style={styles.actionItem}>
                  <Text style={styles.actionBullet}>•</Text>
                  <Text style={styles.actionText}>{action}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noActionsText}>Nenhuma ação disponível para este estado.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2F4F4F',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  riskInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 25,
    borderWidth: 2,
  },
  currentRiskLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  currentRiskText: {
    fontSize: 44,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  dataDetailsCard: {
    width: '100%',
    backgroundColor: '#E0FFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#B0E0E6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dataDetailsTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#2F4F4F',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#B0E0E6',
    paddingBottom: 8,
  },
  dataDetailsText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    lineHeight: 24,
  },
  actionsHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4682B4',
    marginTop: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  actionBullet: {
    fontSize: 18,
    color: '#6A5ACD',
    marginRight: 10,
    lineHeight: 24,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  noActionsText: {
    fontSize: 16,
    color: '#696969',
    textAlign: 'center',
    marginTop: 20,
  },
});
