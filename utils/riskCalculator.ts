import { RiskLevel, MonitoringData } from '../types/common';

export const calculateRisk = (data: MonitoringData): RiskLevel => {
  const humidity = parseFloat(data.humidity);
  const inclination = parseFloat(data.inclination);
  const choveuUltimaSemana = data.choveuUltimaSemana;
  const ambientTemperature = parseFloat(data.ambientTemperature);

  if (isNaN(humidity) || isNaN(inclination) || isNaN(ambientTemperature)) {
    return { text: 'Dados Inválidos', color: '#808080' };
  }

  let score = 0;

  if (humidity >= 70) score += 3;
  else if (humidity >= 50) score += 2;
  else if (humidity >= 30) score += 1;

  if (inclination >= 25) score += 3;
  else if (inclination >= 15) score += 2;
  else if (inclination >= 5) score += 1;

  if (choveuUltimaSemana) {
    score += 4;
    if (humidity >= 50) score += 2;
  }

  if (ambientTemperature > 35 || ambientTemperature < 5) score += 1;
  else if (ambientTemperature > 28 || ambientTemperature < 10) score += 0.5;

  if (score >= 9) {
    return { text: 'Crítico', color: '#8B0000' };
  } else if (score >= 6) {
    return { text: 'Elevado', color: '#FF0000' };
  } else if (score >= 3) {
    return { text: 'Moderado', color: '#FFA500' };
  } else {
    return { text: 'Baixo', color: '#32CD32' };
  }
};
