export interface MonitoringData {
  humidity: string; 
  inclination: string; 
  location: string; // Localização descritiva
  timestamp: string; // Data e hora do registro
  choveuUltimaSemana: boolean; // NOVO: Indicador booleano se choveu
  ambientTemperature: string; // NOVO: Temperatura do ambiente (°C)

}

export interface RiskLevel {
  text: string;
  color: string;
}