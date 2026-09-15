export type SimulationMode = 'NORMAL' | 'DEGRADATION' | 'FAULT';

export type ComponentHealthStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface SensorDataPoint {
  timestamp: string;
  timeMs: number;
  temperature: number; // °C
  vibration: number;   // mm/s
  pressure: number;    // kPa
  rpm: number;         // RPM
  voltage: number;     // V
  current: number;     // A
  humidity: number;    // %
}

export interface ComponentMetric {
  id: string;
  name: string;
  health: number; // 0-100%
  status: ComponentHealthStatus;
  temperature: number;
  vibration: number;
  pressure: number;
  rpm: number;
  current: number;
  faultProbability: number; // 0-100%
  rulHours: number;
  description: string;
  location: string;
}

export interface XAIContributingFactor {
  factor: string;
  impactPercent: number; // e.g. +42%
  trend: 'UP' | 'DOWN' | 'UNSTABLE';
  description: string;
}

export interface SensorEvidenceItem {
  sensorName: string;
  measuredValue: string;
  nominalRange: string;
  deviationPercent: number;
  status: 'NOMINAL' | 'ELEVATED' | 'CRITICAL';
}

export interface FaultPrediction {
  predictedFault: string;
  componentId: string;
  componentName: string;
  probability: number; // %
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedTimeToFailureHours: number;
  confidencePercent: number;
  contributingFactors: XAIContributingFactor[];
  explanation: string;
  sensorEvidence: SensorEvidenceItem[];
}

export interface RULPrediction {
  currentRULHours: number;
  initialRULHours: number;
  trend: 'STABLE' | 'DEGRADATION_SLOW' | 'DEGRADATION_RAPID';
  confidenceLower: number;
  confidenceUpper: number;
  projectedFailureDate: string;
  history: Array<{ time: string; rul: number }>;
}

export interface ComponentReliability {
  componentId: string;
  componentName: string;
  reliabilityPercent: number; // 0-100%
  failureRiskPercent: number;
}

export interface MissionConfig {
  missionName: string;
  durationHours: number;
  requiredReliabilityPercent: number;
  operatingTempC: number;
  expectedLoadPercent: number;
  expectedRPM: number;
}

export interface MissionEvaluation {
  config: MissionConfig;
  currentReliabilityPercent: number;
  likelihoodStatus: 'LIKELY TO COMPLETE' | 'MARGINAL RISK' | 'UNLIKELY TO COMPLETE' | 'CRITICAL FAILURE IMMINENT';
  componentBreakdown: ComponentReliability[];
  estimatedFailureProbability: number;
}

export interface SystemAlert {
  id: string;
  timestamp: string;
  componentId: string;
  componentName: string;
  sensorName: string;
  currentValue: string;
  thresholdValue: string;
  severity: AlertSeverity;
  message: string;
  recommendedAction: string;
  acknowledged: boolean;
}

export interface AIInsight {
  id: string;
  timestamp: string;
  title: string;
  category: 'TELEMETRY' | 'DEGRADATION' | 'RELIABILITY' | 'MAINTENANCE';
  description: string;
  impactLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MaintenanceRecommendation {
  id: string;
  componentId: string;
  componentName: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reason: string;
  recommendation: string;
  requiresQualifiedPersonnel: boolean;
}

export interface DemoStep {
  stepIndex: number;
  title: string;
  mode: SimulationMode;
  durationSeconds: number;
  description: string;
}
