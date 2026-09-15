# AI-Enabled Real-Time Digital Twin for Health Monitoring, Fault Prediction and Mission Reliability

> **Smart India Hackathon (SIH) 2026 Project Submission**  
> **System Name:** `AEGIS-TWIN X1` | **System ID:** `SYS-AERO-2026-99`

---

## 📌 Project Overview

**AEGIS-TWIN X1** is an aerospace and defense-grade real-time **Digital Twin & Predictive Maintenance Control Dashboard**. It bridges physical machinery operations with virtual simulation using live telemetry streaming, mathematical machine learning models, and explainable AI diagnostics.

The primary goal of this application is to demonstrate a real-time Digital Twin system that monitors an industrial/aerospace machine, detects abnormal behavior, predicts sub-system faults, estimates Remaining Useful Life (RUL), and evaluates mission completion reliability.

---

## ✨ Features

- **Interactive 2D Technical Digital Twin Schematic:** Real-time visual CAD schematic mapping 6 core sub-system components with active status indicators (`GREEN = NORMAL`, `YELLOW = WARNING`, `RED = CRITICAL`) and clickable hotspot telemetry cards.
- **Real-Time Sensor Telemetry Monitoring:** Live sampling of 7 core sensors (Temperature, Vibration, Pressure, RPM, Voltage, Current, Humidity) updating every 1.2s.
- **Simulation Engine Modes:** Smooth mode transitions between `NORMAL`, `DEGRADATION`, and `FAULT` states.
- **AI Fault Prediction:** Anomaly detection predicting fault types (Bearing degradation, Engine overheating, Excessive vibration, Cooling failure, Battery degradation, Pressure anomaly) with probabilities, severity levels, and estimated time to failure.
- **Explainable AI (XAI):** SHAP-style feature attribution breakdown (% impact of vibration, temperature, RPM instability, historical wear), plain-English diagnostic rationale, and empirical **Sensor Evidence Trace Log**.
- **Remaining Useful Life (RUL) Prognostics:** Dynamic RUL estimation in hours with lower/upper confidence bounds.
- **Mission Reliability Evaluation:** Interactive mission planner allowing users to set Mission Duration, Required Reliability, Operating Temp, Expected Load, and RPM, computing Weibull survival probability $R(t)$.
- **Real-Time Alert System:** Alarm generation (`INFO`, `WARNING`, `CRITICAL`) with threshold limits, recommended engineering actions, and acknowledgement workflows.
- **Historical Data & CSV Export:** Recorded telemetry history buffer, timeline log, and one-click CSV data export.
- **AI Insights & Maintenance Recommendations:** Automated diagnostic summaries and prioritized maintenance work orders.
- **One-Click SIH Judge Demo Mode:** Automated 3-step presentation routine (`START SIH DEMO`) walking judges through Baseline -> Degradation -> Critical Fault states within seconds.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 18, TypeScript, Vite
- **Styling & UI:** Tailwind CSS, Custom Aerospace Dark CSS Tokens, Lucide Icons
- **Data Visualization:** Recharts (Real-Time Line Streams, Bar Charts, Radial Gauges)
- **Schematic Engine:** Interactive SVG 2D Vector CAD Overlay
- **Backend (Optional Adapter):** Python 3.11+, FastAPI, WebSockets (`/ws/live`), Uvicorn

---

## 🏗️ System Architecture

```
                                  ┌───────────────────────────┐
                                  │   Physical Machine /      │
                                  │   IoT Sensors Stream      │
                                  └─────────────┬─────────────┘
                                                │
                                                ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│                                CENTRAL TELEMETRY ENGINE                                       │
│                             (src/context/DigitalTwinContext.tsx)                              │
│                                                                                               │
│  ┌────────────────────────┐   ┌─────────────────────────┐   ┌─────────────────────────────┐   │
│  │ 7 Sensor Stream Engine │   │ Mode Simulation Controller│   │ System Alerts & Event Log  │   │
│  │ (Temp, Vib, Press, RPM)│   │ (NORMAL/DEGRADATION/FAULT)│   │ (INFO / WARNING / CRITICAL) │   │
│  └───────────┬────────────┘   └────────────┬────────────┘   └──────────────┬──────────────┘   │
└──────────────┼─────────────────────────────┼───────────────────────────────┼──────────────────┘
               │                             │                               │
               ▼                             ▼                               ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 AI & MATHEMATICAL PROGNOSIS                                   │
│                                    (src/utils/aiEngine.ts)                                    │
│                                                                                               │
│  ┌────────────────────────┐   ┌─────────────────────────┐   ┌─────────────────────────────┐   │
│  │  Health Index Engine   │   │  XAI Anomaly Predictor  │   │ Weibull Mission Survivability│  │
│  │   (Composite 0-100%)   │   │   (SHAP Attributions)   │   │ R(t) = exp(-λ_eff · t)      │   │
│  └────────────────────────┘   └─────────────────────────┘   └─────────────────────────────┘   │
└────────────────────────────────────────────┬──────────────────────────────────────────────────┘
                                             │
                                             ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│                              MISSION CONTROL DASHBOARD UI (10 VIEWS)                           │
│                                                                                               │
│ [Overview]  [Digital Twin]  [Live Monitoring]  [Health Analytics]  [Fault Prediction]          │
│ [Mission Reliability]  [Alerts]  [Historical Data]  [AI Insights]  [Settings]                 │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI / ML Features

1. **Composite Health Indexing:**
   $$H_{sys} = 0.7 \cdot \bar{H}_{components} + 0.3 \cdot \left(100 - \sum \text{Penalty}_{sensors}\right)$$
2. **Explainable Anomaly Attribution (XAI):**
   Computes exact percentage contribution of sensor deviations (e.g. +42% Vibration Spike, +18% Thermal Rise) justifying the failure prediction.
3. **Prognostic RUL Regression:**
   Predicts remaining operational hours before interlock failure.
4. **Weibull Mission Survival Modeling:**
   $$R(t) = \exp(-\lambda_{eff} \cdot t), \quad \lambda_{eff} = \lambda_0 \cdot \left(\frac{100}{H_{sys}}\right)^2 \cdot (1 + \text{LoadPenalty} + \text{TempPenalty})$$

---

## 🌐 Digital Twin Features

- **2D Technical Schematic Mirror:** Virtual representation of aircraft turboprop engine, high-speed bearings, cooling manifold, battery array, flight control avionics, and hydraulics.
- **Physical-to-Virtual Synchronization:** Every telemetry tick synchronously updates schematic node colors, component health, fault risks, and RUL projections.
- **Hotspot Telemetry Inspection:** Click any schematic component node to view real-time sensor parameters.

---

## 📥 How to Install

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 🚀 How to Run Locally

1. Start the Vite development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

3. *(Optional)* Run Python FastAPI Backend:
   ```bash
   cd backend
   pip install fastapi uvicorn
   python main.py
   ```

---

## 🎯 Demo Instructions (SIH Presentation)

When demonstrating the project to Hackathon judges:

1. Click **`START SIH DEMO`** at the top right of the navigation bar.
2. **Step 1 (Normal Mode):** Show healthy baseline machine operations (Health: 96%, RUL: 240h, Mission Reliability: 98%).
3. **Step 2 (Degradation Mode):** Watch telemetry charts gradually show vibration and thermal escalation. Health decays (96% → 72%), RUL drops to 36h, and Warning Alerts trigger.
4. **Step 3 (Fault Mode):** Observe severe critical alerts, 78% bearing degradation probability, and mission reliability dropping below target.
5. Click **`Digital Twin`** view to demonstrate interactive schematic hotspots, or **`Fault Prediction`** to show Explainable AI evidence.

---

## 🔮 Future Scope

- Integration with physical hardware IoT transducers via MQTT / ROS2.
- 3D WebGL / Three.js interactive twin model rendering.
- Neural Network model deployment using ONNX WebAssembly runtime.
- Automated maintenance dispatch integration with enterprise ERP systems.

---
*Built for Smart India Hackathon 2026*
