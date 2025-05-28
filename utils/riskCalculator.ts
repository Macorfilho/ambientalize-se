// utils/riskCalculator.ts

import { RiskLevel, MonitoringData } from '../types/common';

/**
 * Calcula o nível de risco de deslizamento com base em múltiplos indicadores.
 * @param data O objeto MonitoringData completo contendo todos os indicadores.
 * @returns Um objeto RiskLevel contendo o texto do risco e uma cor associada.
 */
export const calculateRisk = (data: MonitoringData): RiskLevel => {
  const humidity = parseFloat(data.humidity);
  const inclination = parseFloat(data.inclination);
  const choveuUltimaSemana = data.choveuUltimaSemana; // NOVO: booleano
  const ambientTemperature = parseFloat(data.ambientTemperature); // NOVO: temperatura ambiente

  // Tratamento de dados inválidos
  if (isNaN(humidity) || isNaN(inclination) || isNaN(ambientTemperature)) {
    return { text: 'Dados Inválidos', color: '#808080' }; // Cinza
  }

  // --- Lógica de Risco Aprimorada com Múltiplos Indicadores (Ajustada) ---
  let score = 0;

  // Pontuação baseada na Umidade
  if (humidity >= 70) score += 3;
  else if (humidity >= 50) score += 2;
  else if (humidity >= 30) score += 1;

  // Pontuação baseada na Inclinação
  if (inclination >= 25) score += 3;
  else if (inclination >= 15) score += 2;
  else if (inclination >= 5) score += 1;

  // Pontuação baseada em Choveu na Última Semana (booleano)
  if (choveuUltimaSemana) {
    score += 4; // Se choveu, aumenta significativamente o risco
    // Podemos adicionar mais nuances, ex: se umidade já alta e choveu, aumenta ainda mais
    if (humidity >= 50) score += 2;
  }

  // Pontuação baseada na Temperatura Ambiente (exemplo: extremos podem ser um fator)
  // Temperaturas muito altas podem levar a rachaduras e ressecamento, baixas a congelamento/descongelamento.
  if (ambientTemperature > 35 || ambientTemperature < 5) score += 1;
  else if (ambientTemperature > 28 || ambientTemperature < 10) score += 0.5;

  // Removida: Pontuação para Vibração

  // Classificação final baseada na pontuação total
  if (score >= 9) {
    return { text: 'Crítico', color: '#8B0000' }; // DarkRed
  } else if (score >= 6) {
    return { text: 'Elevado', color: '#FF0000' }; // Vermelho
  } else if (score >= 3) {
    return { text: 'Moderado', color: '#FFA500' }; // Laranja
  } else {
    return { text: 'Baixo', color: '#32CD32' }; // Verde (LimeGreen)
  }
};