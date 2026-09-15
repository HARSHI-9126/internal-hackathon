"""
FastAPI Backend for SIH 2026 Project:
AI-Enabled Real-Time Digital Twin for Health Monitoring, Fault Prediction & Mission Reliability
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import random
import time
from typing import List, Dict, Any

app = FastAPI(
    title="AEGIS Digital Twin API",
    description="Real-time telemetry, fault prognosis, and mission reliability engine",
    version="1.0.0"
)

# Enable CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_telemetry_snapshot() -> Dict[str, Any]:
    return {
        "timestamp": time.strftime("%H:%M:%S"),
        "timeMs": int(time.time() * 1000),
        "temperature": round(71.4 + random.uniform(-2.0, 3.0), 1),
        "vibration": round(3.2 + random.uniform(-0.4, 0.6), 2),
        "pressure": round(101.2 + random.uniform(-1.5, 1.5), 1),
        "rpm": int(3080 + random.uniform(-40, 40)),
        "voltage": round(24.2 + random.uniform(-0.2, 0.2), 1),
        "current": round(8.4 + random.uniform(-0.2, 0.2), 1),
        "humidity": round(62.0 + random.uniform(-1.0, 1.0), 1)
    }

@app.get("/api/system/status")
def get_system_status():
    return {
        "systemName": "AEGIS-TWIN X1",
        "systemId": "SYS-AERO-2026-99",
        "digitalTwinStatus": "SYNCHRONIZED",
        "connectionStatus": "CONNECTED",
        "aiEngineStatus": "ACTIVE"
    }

@app.get("/api/sensors/live")
def get_live_sensors():
    return generate_telemetry_snapshot()

@app.get("/api/health")
def get_health_metrics():
    return {
        "overallHealth": 94,
        "components": [
            {"id": "comp-engine", "name": "Main Turboprop Engine", "health": 96, "status": "NORMAL"},
            {"id": "comp-bearing", "name": "High-Speed Bearing Assembly #01", "health": 94, "status": "NORMAL"},
            {"id": "comp-cooling", "name": "Closed-Loop Cooling System", "health": 98, "status": "NORMAL"},
            {"id": "comp-battery", "name": "Auxiliary Power Battery Unit", "health": 95, "status": "NORMAL"},
            {"id": "comp-control", "name": "Flight Control Avionics Unit", "health": 99, "status": "NORMAL"},
            {"id": "comp-hydraulic", "name": "Hydraulic Actuator System", "health": 96, "status": "NORMAL"}
        ]
    }

@app.get("/api/faults")
def get_fault_predictions():
    return {
        "predictedFault": "Bearing Degradation",
        "probability": 78,
        "severity": "HIGH",
        "estimatedTimeToFailureHours": 36,
        "confidencePercent": 91,
        "contributingFactors": [
            {"factor": "Vibration Amplitude Spike", "impactPercent": 42},
            {"factor": "Operating Temperature Thermal Rise", "impactPercent": 18},
            {"factor": "RPM Flutter Instability", "impactPercent": 12},
            {"factor": "Accumulated Mechanical Wear", "impactPercent": 16}
        ]
    }

@app.get("/api/rul")
def get_rul():
    return {
        "currentRULHours": 184,
        "initialRULHours": 240,
        "trend": "STABLE",
        "confidenceLower": 160,
        "confidenceUpper": 205
    }

@app.get("/api/reliability")
def get_mission_reliability():
    return {
        "missionName": "Mission Alpha",
        "durationHours": 8,
        "requiredReliabilityPercent": 95,
        "currentReliabilityPercent": 96.4,
        "status": "LIKELY TO COMPLETE"
    }

@app.get("/api/alerts")
def get_alerts():
    return [
        {
            "id": "alt-1",
            "timestamp": time.strftime("%H:%M:%S"),
            "componentName": "High-Speed Bearing Assembly #01",
            "severity": "WARNING",
            "message": "Bearing vibration above normal threshold."
        }
    ]

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = generate_telemetry_snapshot()
            await websocket.send_json(data)
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
