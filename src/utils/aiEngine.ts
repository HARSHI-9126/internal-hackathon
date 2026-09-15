import type {
  SensorDataPoint,
  ComponentMetric,
  FaultPrediction,
  RULPrediction,
  MissionConfig,
  MissionEvaluation,
  ComponentReliability,
  SystemAlert,
  AIInsight,
  MaintenanceRecommendation,
  SimulationMode,
  SensorEvidenceItem
} from '../types/digitalTwin';

// Default Nominal Sensor Thresholds
export const SENSOR_THRESHOLDS = {
  temperature: { min: 65, max: 75, warning: 80, critical: 88, unit: '°C' },
  vibration: { min: 2.0, max: 4.0, warning: 5.2, critical: 7.5, unit: 'mm/s' },
  pressure: { min: 95, max: 105, warning: 112, critical: 125, minCritical: 85, unit: 'kPa' },
  rpm: { min: 2800, max: 3300, warningHigh: 3500, warningLow: 2500, criticalHigh: 3800, unit: 'RPM' },
  voltage: { min: 23.0, max: 25.0, warningLow: 22.0, criticalLow: 20.5, unit: 'V' },
  current: { min: 7.5, max: 9.5, warningHigh: 11.0, criticalHigh: 13.5, unit: 'A' },
  humidity: { min: 45, max: 65, warning: 75, critical: 85, unit: '%' }
};

export const INITIAL_COMPONENTS: ComponentMetric[] = [
  {
    id: 'comp-engine',
    name: 'Main Turboprop Engine',
    health: 96,
    status: 'NORMAL',
    temperature: 71.2,
    vibration: 3.1,
    pressure: 101.4,
    rpm: 3050,
    current: 8.5,
    faultProbability: 4,
    rulHours: 240,
    description: 'Primary propulsion core turbine unit with twin spool assembly.',
    location: 'Nacelle Core #01'
  },
  {
    id: 'comp-bearing',
    name: 'High-Speed Bearing Assembly #01',
    health: 94,
    status: 'NORMAL',
    temperature: 69.8,
    vibration: 3.4,
    pressure: 100.2,
    rpm: 3100,
    current: 8.2,
    faultProbability: 6,
    rulHours: 230,
    description: 'Ceramic hybrid roller bearing supporting primary drive shaft.',
    location: 'Forward Gearbox'
  },
  {
    id: 'comp-cooling',
    name: 'Closed-Loop Cooling System',
    health: 98,
    status: 'NORMAL',
    temperature: 67.4,
    vibration: 2.3,
    pressure: 99.5,
    rpm: 2900,
    current: 7.8,
    faultProbability: 2,
    rulHours: 255,
    description: 'Dual-radiator ethylene glycol coolant pump and heat exchanger.',
    location: 'Lower Fuselage'
  },
  {
    id: 'comp-battery',
    name: 'Auxiliary Power Battery Unit',
    health: 95,
    status: 'NORMAL',
    temperature: 68.0,
    vibration: 2.1,
    pressure: 100.0,
    rpm: 0,
    current: 8.1,
    faultProbability: 3,
    rulHours: 245,
    description: '28V Lithium-ion redundant back-up energy distribution array.',
    location: 'Avionics Bay A'
  },
  {
    id: 'comp-control',
    name: 'Flight Control Avionics Unit',
    health: 99,
    status: 'NORMAL',
    temperature: 65.5,
    vibration: 1.8,
    pressure: 100.8,
    rpm: 0,
    current: 7.9,
    faultProbability: 1,
    rulHours: 280,
    description: 'Triple-redundant digital electronic engine control (DEEC) computer.',
    location: 'Cockpit Rack 02'
  },
  {
    id: 'comp-hydraulic',
    name: 'Hydraulic Actuator System',
    health: 96,
    status: 'NORMAL',
    temperature: 70.1,
    vibration: 2.8,
    pressure: 102.1,
    rpm: 2980,
    current: 8.4,
    faultProbability: 4,
    rulHours: 235,
    description: '3000 PSI high-pressure hydraulic manifold and servo valves.',
    location: 'Aft Wing Root'
  }
];

// Health score computation
export function calculateOverallHealth(sensors: SensorDataPoint, components: ComponentMetric[]): number {
  const avgComponentHealth = components.reduce((acc, c) => acc + c.health, 0) / components.length;
  
  // Direct sensor penalty check
  let sensorPenalty = 0;
  if (sensors.temperature > SENSOR_THRESHOLDS.temperature.max) {
    sensorPenalty += (sensors.temperature - SENSOR_THRESHOLDS.temperature.max) * 1.5;
  }
  if (sensors.vibration > SENSOR_THRESHOLDS.vibration.max) {
    sensorPenalty += (sensors.vibration - SENSOR_THRESHOLDS.vibration.max) * 12;
  }
  if (sensors.pressure < SENSOR_THRESHOLDS.pressure.min) {
    sensorPenalty += (SENSOR_THRESHOLDS.pressure.min - sensors.pressure) * 1.2;
  } else if (sensors.pressure > SENSOR_THRESHOLDS.pressure.max) {
    sensorPenalty += (sensors.pressure - SENSOR_THRESHOLDS.pressure.max) * 1.2;
  }

  const calculated = Math.max(10, Math.min(100, Math.round(avgComponentHealth * 0.7 + (100 - sensorPenalty) * 0.3)));
  return calculated;
}

// Fault prediction & XAI feature contribution engine
export function evaluateFaultPrediction(
  sensors: SensorDataPoint,
  overallHealth: number,
  _components: ComponentMetric[],
  mode: SimulationMode
): FaultPrediction {
  const vibDev = Math.max(0, sensors.vibration - 3.0);
  const tempDev = Math.max(0, sensors.temperature - 70.0);
  const pressDev = Math.abs(sensors.pressure - 100.0);
  const rpmInstability = Math.abs(sensors.rpm - 3100) / 50;

  let predictedFault = 'Bearing Degradation';
  let componentId = 'comp-bearing';
  let componentName = 'High-Speed Bearing Assembly #01';
  let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let probability = 5;
  let estimatedTimeToFailureHours = 220;
  let confidencePercent = 94;

  if (mode === 'FAULT' || sensors.vibration > 6.0 || sensors.temperature > 84) {
    predictedFault = sensors.vibration > 6.0 ? 'Bearing Degradation & Mechanical Failure' : 'Engine Overheating & Thermal Stress';
    componentId = sensors.vibration > 6.0 ? 'comp-bearing' : 'comp-engine';
    componentName = sensors.vibration > 6.0 ? 'High-Speed Bearing Assembly #01' : 'Main Turboprop Engine';
    severity = 'CRITICAL';
    probability = Math.min(98, Math.round(75 + vibDev * 4 + tempDev * 1.5));
    estimatedTimeToFailureHours = Math.max(4, Math.round(36 - vibDev * 4));
    confidencePercent = 96;
  } else if (mode === 'DEGRADATION' || sensors.vibration > 4.5 || sensors.temperature > 77) {
    predictedFault = 'Bearing Degradation';
    componentId = 'comp-bearing';
    componentName = 'High-Speed Bearing Assembly #01';
    severity = 'HIGH';
    probability = Math.min(85, Math.round(45 + vibDev * 8 + tempDev * 1.2));
    estimatedTimeToFailureHours = Math.max(18, Math.round(110 - vibDev * 12));
    confidencePercent = 91;
  } else if (sensors.pressure > 110 || sensors.pressure < 90) {
    predictedFault = 'Hydraulic Pressure Anomaly';
    componentId = 'comp-hydraulic';
    componentName = 'Hydraulic Actuator System';
    severity = 'MEDIUM';
    probability = 54;
    estimatedTimeToFailureHours = 84;
    confidencePercent = 88;
  } else {
    predictedFault = 'Nominal Parameter Variance';
    severity = 'LOW';
    probability = Math.max(3, Math.round(100 - overallHealth));
    estimatedTimeToFailureHours = 240;
    confidencePercent = 95;
  }

  // Calculate XAI feature attributions
  const totalWeight = vibDev * 10 + tempDev * 3 + pressDev * 1.5 + rpmInstability * 2 + 1;
  const vibImpact = Math.round((vibDev * 10 / totalWeight) * 100);
  const tempImpact = Math.round((tempDev * 3 / totalWeight) * 100);
  const rpmImpact = Math.round((rpmInstability * 2 / totalWeight) * 100);
  const histImpact = Math.max(0, 100 - (vibImpact + tempImpact + rpmImpact));

  const contributingFactors = [
    {
      factor: 'Vibration Amplitude Spike',
      impactPercent: Math.max(10, vibImpact),
      trend: sensors.vibration > 4.5 ? 'UP' : 'UNSTABLE',
      description: `Vibration reading of ${sensors.vibration.toFixed(1)} mm/s exceeds nominal baseline (2.0-4.0 mm/s).`
    },
    {
      factor: 'Operating Temperature Thermal Rise',
      impactPercent: Math.max(8, tempImpact),
      trend: sensors.temperature > 76 ? 'UP' : 'UNSTABLE',
      description: `Core temperature of ${sensors.temperature.toFixed(1)}°C shows continuous upward gradient.`
    },
    {
      factor: 'RPM Flutter & Frequency Instability',
      impactPercent: Math.max(5, rpmImpact),
      trend: 'UNSTABLE',
      description: `Rotor shaft speed exhibiting ±${Math.round(rpmInstability * 20)} RPM harmonic micro-oscillations.`
    },
    {
      factor: 'Accumulated Component Mechanical Wear',
      impactPercent: histImpact,
      trend: 'UP',
      description: 'Historical degradation telemetry model predicts accelerated raceway fatigue.'
    }
  ].sort((a, b) => b.impactPercent - a.impactPercent) as FaultPrediction['contributingFactors'];

  const explanation = probability > 50
    ? `Machine failure predicted due to sustained high vibration (${sensors.vibration.toFixed(1)} mm/s) accompanied by elevated thermal signature (${sensors.temperature.toFixed(1)}°C). Neural degradation model detected high spectral distortion in roller bearing raceway.`
    : `System operates within safe envelope. Nominal sensor fluctuations detected; no immediate mechanical interlock failure risk identified.`;

  const sensorEvidence: SensorEvidenceItem[] = [
    {
      sensorName: 'Vibration Transducer',
      measuredValue: `${sensors.vibration.toFixed(2)} mm/s`,
      nominalRange: '2.0 - 4.0 mm/s',
      deviationPercent: Math.round(((sensors.vibration - 3.0) / 3.0) * 100),
      status: sensors.vibration > 5.5 ? 'CRITICAL' : sensors.vibration > 4.2 ? 'ELEVATED' : 'NOMINAL'
    },
    {
      sensorName: 'Thermocouple Sensor #02',
      measuredValue: `${sensors.temperature.toFixed(1)} °C`,
      nominalRange: '65.0 - 75.0 °C',
      deviationPercent: Math.round(((sensors.temperature - 70.0) / 70.0) * 100),
      status: sensors.temperature > 82 ? 'CRITICAL' : sensors.temperature > 76 ? 'ELEVATED' : 'NOMINAL'
    },
    {
      sensorName: 'Pressure Transducer P-101',
      measuredValue: `${sensors.pressure.toFixed(1)} kPa`,
      nominalRange: '95.0 - 105.0 kPa',
      deviationPercent: Math.round(((sensors.pressure - 100.0) / 100.0) * 100),
      status: sensors.pressure > 112 || sensors.pressure < 88 ? 'CRITICAL' : 'NOMINAL'
    },
    {
      sensorName: 'Shaft Tachometer (RPM)',
      measuredValue: `${Math.round(sensors.rpm)} RPM`,
      nominalRange: '2800 - 3300 RPM',
      deviationPercent: Math.round(((sensors.rpm - 3050) / 3050) * 100),
      status: 'NOMINAL'
    }
  ];

  return {
    predictedFault,
    componentId,
    componentName,
    probability,
    severity,
    estimatedTimeToFailureHours,
    confidencePercent,
    contributingFactors,
    explanation,
    sensorEvidence
  };
}

// RUL Estimation
export function calculateRUL(
  _sensors: SensorDataPoint,
  overallHealth: number,
  mode: SimulationMode,
  currentRUL: number
): RULPrediction {
  let targetRUL = 240;
  if (mode === 'NORMAL') {
    targetRUL = Math.max(180, Math.round(overallHealth * 2.4));
  } else if (mode === 'DEGRADATION') {
    targetRUL = Math.max(30, Math.round(overallHealth * 1.1));
  } else if (mode === 'FAULT') {
    targetRUL = Math.max(4, Math.round(overallHealth * 0.25));
  }

  // Smooth decay towards target RUL
  const nextRUL = Math.max(4, Math.round(currentRUL * 0.95 + targetRUL * 0.05));
  const trend = mode === 'FAULT' ? 'DEGRADATION_RAPID' : mode === 'DEGRADATION' ? 'DEGRADATION_SLOW' : 'STABLE';

  const date = new Date(Date.now() + nextRUL * 3600 * 1000);
  const projectedFailureDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    currentRULHours: nextRUL,
    initialRULHours: 240,
    trend,
    confidenceLower: Math.max(2, Math.round(nextRUL * 0.88)),
    confidenceUpper: Math.round(nextRUL * 1.12),
    projectedFailureDate,
    history: []
  };
}

// Mission Reliability Engine
export function evaluateMissionReliability(
  config: MissionConfig,
  overallHealth: number,
  components: ComponentMetric[]
): MissionEvaluation {
  // Weibull survival calculation R(t) = exp(- (t / eta)^beta)
  const healthFactor = overallHealth / 100;
  const loadPenalty = (config.expectedLoadPercent / 100) * 0.15;
  const tempPenalty = (Math.max(0, config.operatingTempC - 70) / 50) * 0.2;
  
  const baseLambda = 0.0005; // Base hazard rate per hour
  const effectiveLambda = baseLambda * (1 / (healthFactor * healthFactor)) * (1 + loadPenalty + tempPenalty);
  
  const reliabilityFraction = Math.exp(-effectiveLambda * config.durationHours);
  const currentReliabilityPercent = parseFloat((reliabilityFraction * 100).toFixed(1));

  let likelihoodStatus: MissionEvaluation['likelihoodStatus'] = 'LIKELY TO COMPLETE';
  if (currentReliabilityPercent < 80) {
    likelihoodStatus = 'CRITICAL FAILURE IMMINENT';
  } else if (currentReliabilityPercent < config.requiredReliabilityPercent - 5) {
    likelihoodStatus = 'UNLIKELY TO COMPLETE';
  } else if (currentReliabilityPercent < config.requiredReliabilityPercent) {
    likelihoodStatus = 'MARGINAL RISK';
  }

  const componentBreakdown: ComponentReliability[] = components.map(c => {
    const compHealthFactor = c.health / 100;
    const compRel = Math.min(99.9, Math.max(10, parseFloat((Math.exp(-effectiveLambda * (1 / (compHealthFactor * compHealthFactor)) * config.durationHours) * 100).toFixed(1))));
    return {
      componentId: c.id,
      componentName: c.name,
      reliabilityPercent: compRel,
      failureRiskPercent: parseFloat((100 - compRel).toFixed(1))
    };
  });

  return {
    config,
    currentReliabilityPercent,
    likelihoodStatus,
    componentBreakdown,
    estimatedFailureProbability: parseFloat((100 - currentReliabilityPercent).toFixed(1))
  };
}

// Alert Generator
export function generateAlerts(
  sensors: SensorDataPoint,
  _components: ComponentMetric[],
  existingAlerts: SystemAlert[]
): SystemAlert[] {
  const alerts: SystemAlert[] = [...existingAlerts];
  const now = new Date().toLocaleTimeString();

  const pushAlert = (
    componentId: string,
    componentName: string,
    sensorName: string,
    currentValue: string,
    thresholdValue: string,
    severity: 'INFO' | 'WARNING' | 'CRITICAL',
    message: string,
    recommendedAction: string
  ) => {
    const duplicate = alerts.some(a => a.componentId === componentId && a.sensorName === sensorName && !a.acknowledged && a.severity === severity);
    if (!duplicate) {
      alerts.unshift({
        id: `alt-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        timestamp: now,
        componentId,
        componentName,
        sensorName,
        currentValue,
        thresholdValue,
        severity,
        message,
        recommendedAction,
        acknowledged: false
      });
    }
  };

  if (sensors.vibration > SENSOR_THRESHOLDS.vibration.critical) {
    pushAlert(
      'comp-bearing',
      'High-Speed Bearing Assembly #01',
      'Vibration',
      `${sensors.vibration.toFixed(1)} mm/s`,
      `> ${SENSOR_THRESHOLDS.vibration.critical} mm/s`,
      'CRITICAL',
      'Severe vibration surge detected in bearing housing. Catastrophic wear imminent.',
      'Immediate manual interlock. Inspect roller raceway before next flight sortie.'
    );
  } else if (sensors.vibration > SENSOR_THRESHOLDS.vibration.warning) {
    pushAlert(
      'comp-bearing',
      'High-Speed Bearing Assembly #01',
      'Vibration',
      `${sensors.vibration.toFixed(1)} mm/s`,
      `> ${SENSOR_THRESHOLDS.vibration.warning} mm/s`,
      'WARNING',
      'Bearing vibration above nominal threshold. Micro-cracking suspected.',
      'Schedule acoustic emission diagnostic scan.'
    );
  }

  if (sensors.temperature > SENSOR_THRESHOLDS.temperature.critical) {
    pushAlert(
      'comp-engine',
      'Main Turboprop Engine',
      'Temperature',
      `${sensors.temperature.toFixed(1)} °C`,
      `> ${SENSOR_THRESHOLDS.temperature.critical} °C`,
      'CRITICAL',
      'Engine thermal runaway threshold breached. Overheating risk.',
      'Reduce turbine throttle to idle. Activate secondary coolant purge pump.'
    );
  } else if (sensors.temperature > SENSOR_THRESHOLDS.temperature.warning) {
    pushAlert(
      'comp-engine',
      'Main Turboprop Engine',
      'Temperature',
      `${sensors.temperature.toFixed(1)} °C`,
      `> ${SENSOR_THRESHOLDS.temperature.warning} °C`,
      'WARNING',
      'Engine temperature approaching thermal operating limit.',
      'Monitor coolant pressure differential and check radiator intake flow.'
    );
  }

  return alerts.slice(0, 25);
}

// Generate natural language AI Insights
export function generateAIInsights(
  sensors: SensorDataPoint,
  _health: number,
  fault: FaultPrediction,
  mission: MissionEvaluation
): AIInsight[] {
  const now = new Date().toLocaleTimeString();
  const insights: AIInsight[] = [];

  if (sensors.vibration > 4.5) {
    insights.push({
      id: 'ins-1',
      timestamp: now,
      title: 'Vibration Amplitude Trend Warning',
      category: 'TELEMETRY',
      description: `Vibration has increased by ${Math.round(((sensors.vibration - 3.0)/3.0)*100)}% over baseline during the last operating cycle.`,
      impactLevel: sensors.vibration > 6.0 ? 'HIGH' : 'MEDIUM'
    });
  }

  if (sensors.temperature > 76) {
    insights.push({
      id: 'ins-2',
      timestamp: now,
      title: 'Thermal Gradient Escalation',
      category: 'DEGRADATION',
      description: 'Engine core temperature is exhibiting a steady upward slope (+0.4°C/min), correlating with bearing friction losses.',
      impactLevel: sensors.temperature > 82 ? 'HIGH' : 'MEDIUM'
    });
  }

  if (mission.currentReliabilityPercent < mission.config.requiredReliabilityPercent) {
    insights.push({
      id: 'ins-3',
      timestamp: now,
      title: 'Mission Target Breach Risk',
      category: 'RELIABILITY',
      description: `Calculated mission completion reliability (${mission.currentReliabilityPercent}%) has dropped below configured mission threshold (${mission.config.requiredReliabilityPercent}%).`,
      impactLevel: 'HIGH'
    });
  }

  insights.push({
    id: 'ins-4',
    timestamp: now,
    title: 'AI Prognostic RUL Assessment',
    category: 'MAINTENANCE',
    description: `Current degradation rate projects ${fault.estimatedTimeToFailureHours} hours remaining before component interlock threshold. Preventive overhaul recommended.`,
    impactLevel: fault.estimatedTimeToFailureHours < 50 ? 'HIGH' : 'LOW'
  });

  return insights;
}

// Generate Maintenance Recommendations
export function generateMaintenanceRecommendations(
  components: ComponentMetric[],
  _fault: FaultPrediction
): MaintenanceRecommendation[] {
  const recs: MaintenanceRecommendation[] = [];

  components.forEach(comp => {
    if (comp.health < 80) {
      recs.push({
        id: `rec-${comp.id}`,
        componentId: comp.id,
        componentName: comp.name,
        priority: comp.health < 65 ? 'CRITICAL' : 'HIGH',
        reason: comp.id === 'comp-bearing' ? 'Raceway micro-pitting and vibration instability detected.' : 'Thermal degradation threshold exceeded.',
        recommendation: comp.id === 'comp-bearing' 
          ? 'Perform high-frequency acoustic emission scan. Replace bearing sleeve assembly before next mission.'
          : 'Flush heat exchanger and test coolant pump valve flow rate.',
        requiresQualifiedPersonnel: true
      });
    }
  });

  if (recs.length === 0) {
    recs.push({
      id: 'rec-nominal',
      componentId: 'comp-engine',
      componentName: 'Main Turboprop Engine',
      priority: 'LOW',
      reason: 'All components within normal operating tolerance.',
      recommendation: 'Continue standard routine 100-hour inspection schedule.',
      requiresQualifiedPersonnel: false
    });
  }

  return recs;
}
