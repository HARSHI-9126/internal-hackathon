import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  SimulationMode,
  SensorDataPoint,
  ComponentMetric,
  FaultPrediction,
  RULPrediction,
  MissionConfig,
  MissionEvaluation,
  SystemAlert,
  AIInsight,
  MaintenanceRecommendation,
  DemoStep
} from '../types/digitalTwin';
import {
  INITIAL_COMPONENTS,
  calculateOverallHealth,
  evaluateFaultPrediction,
  calculateRUL,
  evaluateMissionReliability,
  generateAlerts,
  generateAIInsights,
  generateMaintenanceRecommendations
} from '../utils/aiEngine';

interface DigitalTwinContextType {
  mode: SimulationMode;
  setSimulationMode: (mode: SimulationMode) => void;
  isLivePaused: boolean;
  togglePauseLive: () => void;
  clearHistory: () => void;
  
  sensors: SensorDataPoint;
  sensorHistory: SensorDataPoint[];
  components: ComponentMetric[];
  selectedComponentId: string | null;
  selectComponent: (id: string | null) => void;
  
  overallHealth: number;
  faultPrediction: FaultPrediction;
  rulPrediction: RULPrediction;
  
  missionConfig: MissionConfig;
  updateMissionConfig: (config: Partial<MissionConfig>) => void;
  missionEvaluation: MissionEvaluation;
  
  alerts: SystemAlert[];
  acknowledgeAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
  
  aiInsights: AIInsight[];
  maintenanceRecommendations: MaintenanceRecommendation[];
  
  // Demo Mode
  isDemoMode: boolean;
  demoStep: number;
  startDemoMode: () => void;
  stopDemoMode: () => void;
  
  systemMetadata: {
    systemName: string;
    systemId: string;
    digitalTwinStatus: 'SYNCHRONIZED' | 'DESYNCHRONIZED';
    connectionStatus: 'CONNECTED' | 'RECONNECTING' | 'OFFLINE';
    aiEngineStatus: 'ACTIVE' | 'CALIBRATING';
  };
}

const defaultSensors: SensorDataPoint = {
  timestamp: new Date().toLocaleTimeString(),
  timeMs: Date.now(),
  temperature: 71.4,
  vibration: 3.2,
  pressure: 101.2,
  rpm: 3080,
  voltage: 24.2,
  current: 8.4,
  humidity: 62.0
};

const defaultMissionConfig: MissionConfig = {
  missionName: 'Mission Alpha - High Altitude Sortie',
  durationHours: 8,
  requiredReliabilityPercent: 95,
  operatingTempC: 72,
  expectedLoadPercent: 85,
  expectedRPM: 3100
};

export const DEMO_STEPS: DemoStep[] = [
  {
    stepIndex: 1,
    title: 'Baseline Healthy System',
    mode: 'NORMAL',
    durationSeconds: 6,
    description: 'All 7 sensors operating within baseline specs. High system health (96%), RUL 240h, Mission Reliability 98%.'
  },
  {
    stepIndex: 2,
    title: 'Progressive Bearing Degradation',
    mode: 'DEGRADATION',
    durationSeconds: 10,
    description: 'Vibration and temperature gradually rise. Health decays (96% → 72%), RUL drops (240h → 36h). Warning alert generated.'
  },
  {
    stepIndex: 3,
    title: 'Critical Fault & Mission Breach',
    mode: 'FAULT',
    durationSeconds: 8,
    description: 'Critical vibration spike (> 6.5 mm/s). Severe Fault Predicted (78% probability). Mission Reliability drops below target.'
  }
];

const DigitalTwinContext = createContext<DigitalTwinContextType | undefined>(undefined);

export const DigitalTwinProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<SimulationMode>('NORMAL');
  const [isLivePaused, setIsLivePaused] = useState<boolean>(false);
  
  const [sensors, setSensors] = useState<SensorDataPoint>(defaultSensors);
  const [sensorHistory, setSensorHistory] = useState<SensorDataPoint[]>([]);
  const [components, setComponents] = useState<ComponentMetric[]>(INITIAL_COMPONENTS);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  
  const [overallHealth, setOverallHealth] = useState<number>(96);
  const [faultPrediction, setFaultPrediction] = useState<FaultPrediction>(() => 
    evaluateFaultPrediction(defaultSensors, 96, INITIAL_COMPONENTS, 'NORMAL')
  );
  const [rulPrediction, setRulPrediction] = useState<RULPrediction>(() => 
    calculateRUL(defaultSensors, 96, 'NORMAL', 240)
  );
  
  const [missionConfig, setMissionConfig] = useState<MissionConfig>(defaultMissionConfig);
  const [missionEvaluation, setMissionEvaluation] = useState<MissionEvaluation>(() => 
    evaluateMissionReliability(defaultMissionConfig, 96, INITIAL_COMPONENTS)
  );
  
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [maintenanceRecommendations, setMaintenanceRecommendations] = useState<MaintenanceRecommendation[]>([]);
  
  // Demo Mode state
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);

  // Initialize seed history
  useEffect(() => {
    const initialHistory: SensorDataPoint[] = [];
    const now = Date.now();
    for (let i = 40; i >= 0; i--) {
      const timeMs = now - i * 2000;
      const t = new Date(timeMs).toLocaleTimeString();
      initialHistory.push({
        timestamp: t,
        timeMs,
        temperature: 68 + Math.sin(i * 0.2) * 2 + Math.random(),
        vibration: 2.8 + Math.cos(i * 0.3) * 0.4 + Math.random() * 0.2,
        pressure: 100 + Math.sin(i * 0.1) * 1.5,
        rpm: 3000 + Math.round(Math.sin(i * 0.4) * 80),
        voltage: 24.1 + (Math.random() * 0.2 - 0.1),
        current: 8.3 + (Math.random() * 0.2 - 0.1),
        humidity: 60 + Math.sin(i * 0.05) * 4
      });
    }
    setSensorHistory(initialHistory);
  }, []);

  // Update telemetry simulation loop
  useEffect(() => {
    if (isLivePaused) return;

    const interval = setInterval(() => {
      setSensors(prev => {
        let nextTemp = prev.temperature;
        let nextVib = prev.vibration;
        let nextPress = prev.pressure;
        let nextRpm = prev.rpm;
        let nextVolt = prev.voltage;
        let nextCurr = prev.current;
        let nextHum = prev.humidity;

        if (mode === 'NORMAL') {
          // Stable nominal range with small natural fluctuations
          nextTemp = Math.max(66, Math.min(74, nextTemp * 0.85 + (70 + (Math.random() * 4 - 2)) * 0.15));
          nextVib = Math.max(2.2, Math.min(3.8, nextVib * 0.85 + (3.0 + (Math.random() * 0.8 - 0.4)) * 0.15));
          nextPress = Math.max(97, Math.min(103, nextPress * 0.85 + (100.5 + (Math.random() * 1.5 - 0.75)) * 0.15));
          nextRpm = Math.max(2850, Math.min(3250, nextRpm * 0.85 + (3050 + (Math.random() * 60 - 30)) * 0.15));
          nextVolt = 24.2 + (Math.random() * 0.3 - 0.15);
          nextCurr = 8.4 + (Math.random() * 0.3 - 0.15);
          nextHum = 62 + (Math.random() * 2 - 1);
        } else if (mode === 'DEGRADATION') {
          // Gradual escalation of temperature & vibration
          nextTemp = Math.min(83.5, nextTemp + 0.35 + Math.random() * 0.2);
          nextVib = Math.min(6.2, nextVib + 0.12 + Math.random() * 0.08);
          nextPress = nextPress + (Math.random() * 1.2 - 0.6);
          nextRpm = 3100 + (Math.random() * 180 - 90); // RPM instability
          nextVolt = Math.max(21.5, nextVolt - 0.04);
          nextCurr = Math.min(11.2, nextCurr + 0.08);
          nextHum = prev.humidity;
        } else if (mode === 'FAULT') {
          // Critical abnormal fault values
          nextTemp = Math.min(94, nextTemp + 0.6 + Math.random() * 0.3);
          nextVib = Math.min(8.8, nextVib + 0.25 + Math.random() * 0.15);
          nextPress = Math.min(124, nextPress + 0.8);
          nextRpm = 3400 + (Math.random() * 300 - 150);
          nextVolt = 20.8 + Math.random() * 0.4;
          nextCurr = 12.6 + Math.random() * 0.6;
          nextHum = prev.humidity;
        }

        const nowMs = Date.now();
        const newPoint: SensorDataPoint = {
          timestamp: new Date(nowMs).toLocaleTimeString(),
          timeMs: nowMs,
          temperature: parseFloat(nextTemp.toFixed(1)),
          vibration: parseFloat(nextVib.toFixed(2)),
          pressure: parseFloat(nextPress.toFixed(1)),
          rpm: Math.round(nextRpm),
          voltage: parseFloat(nextVolt.toFixed(1)),
          current: parseFloat(nextCurr.toFixed(1)),
          humidity: parseFloat(nextHum.toFixed(1))
        };

        // Append to history buffer (max 100 points)
        setSensorHistory(history => [...history.slice(-99), newPoint]);

        return newPoint;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [mode, isLivePaused]);

  // Recalculate component metrics & AI projections whenever sensors or mode change
  useEffect(() => {
    // Component health updating based on sensor readings & mode
    const updatedComponents = components.map(c => {
      let cHealth = c.health;
      let cStatus: ComponentMetric['status'] = 'NORMAL';
      let cFaultProb = c.faultProbability;
      let cRul = c.rulHours;

      if (c.id === 'comp-bearing') {
        const vibFactor = Math.max(0, sensors.vibration - 3.0);
        const tempFactor = Math.max(0, sensors.temperature - 70.0);
        cHealth = Math.max(35, Math.round(96 - vibFactor * 12 - tempFactor * 1.5));
        cFaultProb = Math.min(98, Math.round(4 + vibFactor * 16 + tempFactor * 2));
        cRul = Math.max(8, Math.round(230 - vibFactor * 32));
      } else if (c.id === 'comp-engine') {
        const tempFactor = Math.max(0, sensors.temperature - 70.0);
        cHealth = Math.max(45, Math.round(98 - tempFactor * 2.5));
        cFaultProb = Math.min(95, Math.round(3 + tempFactor * 3.5));
        cRul = Math.max(12, Math.round(240 - tempFactor * 8));
      } else if (c.id === 'comp-cooling') {
        if (mode === 'FAULT' || sensors.temperature > 80) {
          cHealth = Math.max(50, cHealth - 2);
        } else {
          cHealth = Math.min(98, cHealth + 1);
        }
      }

      if (cHealth < 65) cStatus = 'CRITICAL';
      else if (cHealth < 82) cStatus = 'WARNING';
      else cStatus = 'NORMAL';

      return {
        ...c,
        health: cHealth,
        status: cStatus,
        temperature: c.id === 'comp-engine' || c.id === 'comp-bearing' ? sensors.temperature : c.temperature,
        vibration: c.id === 'comp-bearing' ? sensors.vibration : c.vibration,
        faultProbability: cFaultProb,
        rulHours: cRul
      };
    });

    setComponents(updatedComponents);

    // Overall Health
    const health = calculateOverallHealth(sensors, updatedComponents);
    setOverallHealth(health);

    // Fault Prediction
    const fault = evaluateFaultPrediction(sensors, health, updatedComponents, mode);
    setFaultPrediction(fault);

    // RUL Prediction
    setRulPrediction(prevRul => calculateRUL(sensors, health, mode, prevRul.currentRULHours));

    // Mission Evaluation
    const mission = evaluateMissionReliability(missionConfig, health, updatedComponents);
    setMissionEvaluation(mission);

    // System Alerts
    setAlerts(prev => generateAlerts(sensors, updatedComponents, prev));

    // AI Insights & Recommendations
    setAiInsights(generateAIInsights(sensors, health, fault, mission));
    setMaintenanceRecommendations(generateMaintenanceRecommendations(updatedComponents, fault));

  }, [sensors, mode, missionConfig]);

  // Demo Mode Automated Sequence Runner
  useEffect(() => {
    if (!isDemoMode) return;

    let timer: ReturnType<typeof setTimeout>;
    if (demoStep === 1) {
      setModeState('NORMAL');
      timer = setTimeout(() => {
        setDemoStep(2);
      }, DEMO_STEPS[0].durationSeconds * 1000);
    } else if (demoStep === 2) {
      setModeState('DEGRADATION');
      timer = setTimeout(() => {
        setDemoStep(3);
      }, DEMO_STEPS[1].durationSeconds * 1000);
    } else if (demoStep === 3) {
      setModeState('FAULT');
      timer = setTimeout(() => {
        // Auto pause demo or loop back
        setIsDemoMode(false);
      }, DEMO_STEPS[2].durationSeconds * 1000);
    }

    return () => clearTimeout(timer);
  }, [isDemoMode, demoStep]);

  const startDemoMode = useCallback(() => {
    setIsDemoMode(true);
    setDemoStep(1);
    setModeState('NORMAL');
  }, []);

  const stopDemoMode = useCallback(() => {
    setIsDemoMode(false);
    setModeState('NORMAL');
  }, []);

  const setSimulationMode = useCallback((newMode: SimulationMode) => {
    setIsDemoMode(false);
    setModeState(newMode);
  }, []);

  const togglePauseLive = useCallback(() => {
    setIsLivePaused(prev => !prev);
  }, []);

  const clearHistory = useCallback(() => {
    setSensorHistory([]);
  }, []);

  const selectComponent = useCallback((id: string | null) => {
    setSelectedComponentId(id);
  }, []);

  const updateMissionConfig = useCallback((newConfig: Partial<MissionConfig>) => {
    setMissionConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return (
    <DigitalTwinContext.Provider
      value={{
        mode,
        setSimulationMode,
        isLivePaused,
        togglePauseLive,
        clearHistory,
        sensors,
        sensorHistory,
        components,
        selectedComponentId,
        selectComponent,
        overallHealth,
        faultPrediction,
        rulPrediction,
        missionConfig,
        updateMissionConfig,
        missionEvaluation,
        alerts,
        acknowledgeAlert,
        clearAllAlerts,
        aiInsights,
        maintenanceRecommendations,
        isDemoMode,
        demoStep,
        startDemoMode,
        stopDemoMode,
        systemMetadata: {
          systemName: 'AEGIS-TWIN X1',
          systemId: 'SYS-AERO-2026-99',
          digitalTwinStatus: 'SYNCHRONIZED',
          connectionStatus: isLivePaused ? 'OFFLINE' : 'CONNECTED',
          aiEngineStatus: 'ACTIVE'
        }
      }}
    >
      {children}
    </DigitalTwinContext.Provider>
  );
};

export const useDigitalTwin = () => {
  const context = useContext(DigitalTwinContext);
  if (!context) {
    throw new Error('useDigitalTwin must be used within a DigitalTwinProvider');
  }
  return context;
};
