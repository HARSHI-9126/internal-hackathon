import React, { useState } from 'react';
import { DigitalTwinProvider } from './context/DigitalTwinContext';
import { TopNav } from './components/layout/TopNav';
import { Sidebar, type ViewId } from './components/layout/Sidebar';
import { OverviewView } from './views/OverviewView';
import { DigitalTwinView } from './views/DigitalTwinView';
import { LiveMonitoringView } from './views/LiveMonitoringView';
import { HealthAnalyticsView } from './views/HealthAnalyticsView';
import { FaultPredictionView } from './views/FaultPredictionView';
import { MissionReliabilityView } from './views/MissionReliabilityView';
import { AlertsView } from './views/AlertsView';
import { HistoricalDataView } from './views/HistoricalDataView';
import { AiInsightsView } from './views/AiInsightsView';
import { SettingsView } from './views/SettingsView';

const MainContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewId>('overview');

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewView onNavigate={(view) => setCurrentView(view)} />;
      case 'digital-twin':
        return <DigitalTwinView />;
      case 'live-monitoring':
        return <LiveMonitoringView />;
      case 'health-analytics':
        return <HealthAnalyticsView />;
      case 'fault-prediction':
        return <FaultPredictionView />;
      case 'mission-reliability':
        return <MissionReliabilityView />;
      case 'alerts':
        return <AlertsView />;
      case 'historical-data':
        return <HistoricalDataView />;
      case 'ai-insights':
        return <AiInsightsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView onNavigate={(view) => setCurrentView(view)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation Header */}
      <TopNav onOpenAlertsModal={() => setCurrentView('alerts')} />

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar currentView={currentView} onSelectView={(view) => setCurrentView(view)} />

        {/* Dynamic View Viewport */}
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-4rem)] max-w-full">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <DigitalTwinProvider>
      <MainContent />
    </DigitalTwinProvider>
  );
}

export default App;
