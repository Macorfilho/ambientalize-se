export interface MonitoringData {
  humidity: string; 
  inclination: string; 
  location: string; 
  timestamp: string;
  choveuUltimaSemana: boolean; 
  ambientTemperature: string;

}

export interface RiskLevel {
  text: string;
  color: string;
}