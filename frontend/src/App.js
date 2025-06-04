import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const App = () => {
  // System state
  const [systemInitialized, setSystemInitialized] = useState(false);
  const [matrixLoading, setMatrixLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState('INITIALIZING');
  const [accessGranted, setAccessGranted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('cosmos');
  const [networkConnected, setNetworkConnected] = useState(false);
  const [securityLevel, setSecurityLevel] = useState('QUANTUM');

  // Enhanced visual state
  const [starField, setStarField] = useState([]);
  const [colorPhase, setColorPhase] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(0.5);
  const [nebulaDrift, setNebulaDrift] = useState(0);
  
  // Application state
  const [activeWindows, setActiveWindows] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savings, setSavings] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dragging, setDragging] = useState(null);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [transparency, setTransparency] = useState(92);
  const [terminalAccess, setTerminalAccess] = useState(false);
  const [userStats, setUserStats] = useState({
    streakDays: 15,
    totalPoints: 2847,
    quantumEntanglements: 23,
    dimensionsAccessed: 7,
    dataHarvested: '∞ Petabytes'
  });

  // Cinematic color palettes using color theory
  const cinematicThemes = {
    cosmos: {
      name: 'COSMIC DEPTHS',
      primary: '#00d4ff',
      secondary: '#7c3aed', 
      accent: '#f59e0b',
      nebula: '#ec4899',
      quantum: '#10b981',
      background: 'radial-gradient(ellipse at center, #0f0a1e 0%, #1a0a2e 35%, #0d1b2a 100%)',
      windowBg: 'rgba(15, 10, 30, 0.95)',
      textColor: '#00d4ff'
    },
    stellar: {
      name: 'STELLAR FORGE',
      primary: '#ff6b35',
      secondary: '#004e89',
      accent: '#fcdc00',
      nebula: '#ff006e',
      quantum: '#8338ec',
      background: 'radial-gradient(ellipse at center, #1a0a00 0%, #3d1a00 35%, #000814 100%)',
      windowBg: 'rgba(26, 10, 0, 0.95)',
      textColor: '#ff6b35'
    },
    aurora: {
      name: 'AURORA BOREALIS',
      primary: '#39ff14',
      secondary: '#ff1493',
      accent: '#00ffff',
      nebula: '#9400d3',
      quantum: '#ffd700',
      background: 'radial-gradient(ellipse at center, #001122 0%, #003344 35%, #000a0a 100%)',
      windowBg: 'rgba(0, 17, 34, 0.95)',
      textColor: '#39ff14'
    },
    quantum: {
      name: 'QUANTUM REALM',
      primary: '#e0aaff',
      secondary: '#c77dff',
      accent: '#7209b7',
      nebula: '#560bad',
      quantum: '#f72585',
      background: 'radial-gradient(ellipse at center, #240046 0%, #3c096c 35%, #10002b 100%)',
      windowBg: 'rgba(36, 0, 70, 0.95)',
      textColor: '#e0aaff'
    }
  };

  // Initialize star field for parallax effect
  useEffect(() => {
    const stars = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
      brightness: Math.random(),
      color: Math.random() > 0.8 ? cinematicThemes[currentTheme].accent : '#ffffff'
    }));
    setStarField(stars);
  }, [currentTheme]);

  // Animate star field and cosmic effects
  useEffect(() => {
    const interval = setInterval(() => {
      setColorPhase(prev => (prev + 0.02) % (Math.PI * 2));
      setPulseIntensity(prev => 0.3 + Math.sin(Date.now() * 0.003) * 0.2);
      setNebulaDrift(prev => prev + 0.1);
      
      setStarField(prev => prev.map(star => ({
        ...star,
        y: (star.y + star.speed) % 100,
        brightness: 0.3 + Math.sin((Date.now() * 0.002) + star.id) * 0.7
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Enhanced loading sequence with realistic progress
  useEffect(() => {
    if (matrixLoading) {
      const phases = [
        { phase: 'INITIALIZING QUANTUM PROTOCOLS', duration: 2000, progress: 15 },
        { phase: 'ESTABLISHING COSMIC CONNECTIONS', duration: 2500, progress: 30 },
        { phase: 'DECRYPTING NEURAL NETWORKS', duration: 3000, progress: 50 },
        { phase: 'SYNCHRONIZING DIMENSIONAL DATA', duration: 2000, progress: 70 },
        { phase: 'CALIBRATING MATRIX INTERFACE', duration: 2500, progress: 85 },
        { phase: 'FINALIZING COSMIC DEPLOYMENT', duration: 2000, progress: 100 }
      ];

      let currentPhaseIndex = 0;
      
      const advancePhase = () => {
        if (currentPhaseIndex < phases.length) {
          const currentPhaseData = phases[currentPhaseIndex];
          setLoadingPhase(currentPhaseData.phase);
          
          // Animate progress over phase duration
          const startProgress = currentPhaseIndex === 0 ? 0 : phases[currentPhaseIndex - 1].progress;
          const endProgress = currentPhaseData.progress;
          const duration = currentPhaseData.duration;
          const startTime = Date.now();
          
          const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progressRatio = Math.min(elapsed / duration, 1);
            const currentProgress = startProgress + (endProgress - startProgress) * progressRatio;
            setLoadingProgress(currentProgress);
            
            if (progressRatio >= 1) {
              clearInterval(progressInterval);
              currentPhaseIndex++;
              setTimeout(advancePhase, 200);
            }
          }, 50);
        } else {
          setTimeout(() => {
            setMatrixLoading(false);
            setSystemInitialized(true);
            setNetworkConnected(true);
            setNotifications([{
              id: 'cosmic_init',
              type: 'quantum',
              title: '🌌 COSMIC NETWORK INITIALIZED',
              message: 'THRIVEREMOTE QUANTUM PORTAL ONLINE',
              timestamp: new Date().toISOString()
            }]);
          }, 1000);
        }
      };
      
      advancePhase();
    }
  }, [matrixLoading]);

  // Enhanced window management with cosmic effects
  const openWindow = (windowId, title, component, requiresAuth = false) => {
    if (requiresAuth && !terminalAccess) {
      setNotifications(prev => [...prev, {
        id: 'quantum_denied',
        type: 'warning',
        title: '⚠️ QUANTUM ACCESS REQUIRED',
        message: 'NEURAL AUTHORIZATION NEEDED - ACTIVATE CONSCIOUSNESS LINK',
        timestamp: new Date().toISOString()
      }]);
      return;
    }

    if (!activeWindows.find(w => w.id === windowId)) {
      const newWindow = {
        id: windowId,
        title,
        component,
        minimized: false,
        position: { 
          x: Math.max(50, 50 + (activeWindows.length * 60)), 
          y: Math.max(50, 50 + (activeWindows.length * 60)) 
        },
        zIndex: 1000 + activeWindows.length,
        size: { width: 1000, height: 700 },
        opening: true,
        classified: requiresAuth
      };
      
      setActiveWindows(prev => [...prev, newWindow]);
      
      setTimeout(() => {
        setActiveWindows(windows => windows.map(w => 
          w.id === windowId ? { ...w, opening: false } : w
        ));
      }, 500);
    }
  };

  const closeWindow = (windowId) => {
    setActiveWindows(windows => windows.map(w => 
      w.id === windowId ? { ...w, closing: true } : w
    ));
    
    setTimeout(() => {
      setActiveWindows(windows => windows.filter(w => w.id !== windowId));
    }, 300);
  };

  const minimizeWindow = (windowId) => {
    setActiveWindows(activeWindows.map(w => 
      w.id === windowId ? { ...w, minimized: !w.minimized } : w
    ));
  };

  const bringToFront = (windowId) => {
    const maxZ = Math.max(...activeWindows.map(w => w.zIndex), 1000);
    setActiveWindows(activeWindows.map(w => 
      w.id === windowId ? { ...w, zIndex: maxZ + 1 } : w
    ));
  };

  // Enhanced theme changer with psychological engagement
  const changeTheme = (newTheme) => {
    setNotifications(prev => [...prev, {
      id: 'dimensional_shift',
      type: 'quantum',
      title: '🌌 DIMENSIONAL SHIFT INITIATED',
      message: 'REALITY MATRIX RECALIBRATING...',
      timestamp: new Date().toISOString()
    }]);

    const confirmAuth = prompt("🔮 CONSCIOUSNESS INTERFACE ACTIVATED\nEnter 'TRANSCEND' to shift dimensional reality:");
    if (confirmAuth?.toUpperCase() === 'TRANSCEND') {
      setCurrentTheme(newTheme);
      setNotifications(prev => [...prev, {
        id: 'reality_shifted',
        type: 'success',
        title: '✨ REALITY MATRIX UPDATED',
        message: `DIMENSIONAL PHASE: ${cinematicThemes[newTheme].name}`,
        timestamp: new Date().toISOString()
      }]);
    } else {
      setNotifications(prev => [...prev, {
        id: 'consciousness_rejected',
        type: 'error',
        title: '🚫 CONSCIOUSNESS LINK FAILED',
        message: 'NEURAL PATHWAY AUTHENTICATION DENIED',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  // Terminal authorization with enhanced security theater
  const requestTerminalAccess = () => {
    const authCode = prompt("🧠 NEURAL INTERFACE ACTIVATION\nEnter 'AWAKEN' to unlock quantum consciousness:");
    if (authCode?.toUpperCase() === 'AWAKEN') {
      setTerminalAccess(true);
      setSecurityLevel('TRANSCENDENT');
      setNotifications(prev => [...prev, {
        id: 'consciousness_unlocked',
        type: 'quantum',
        title: '🧠 CONSCIOUSNESS MATRIX UNLOCKED',
        message: 'QUANTUM SYSTEMS NOW ACCESSIBLE VIA NEURAL LINK',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  // Network portal applications with enhanced descriptions
  const portalApplications = [
    { id: 'cosmic_scanner', name: 'Cosmic Network Scanner', icon: '🌌', component: 'CosmicScanner', classified: false, description: 'Scan multidimensional networks' },
    { id: 'quantum_jobs', name: 'Quantum Job Portal', icon: '💫', component: 'QuantumJobs', classified: false, description: 'Discover remote opportunities across space-time' },
    { id: 'dimensional_relocation', name: 'Dimensional Relocation', icon: '🌠', component: 'DimensionalRelocation', classified: false, description: 'Navigate Arizona→Peak District portal' },
    { id: 'stellar_finance', name: 'Stellar Finance Tracker', icon: '⭐', component: 'StellarFinance', classified: false, description: 'Track resources across dimensions' },
    { id: 'neural_tasks', name: 'Neural Task Matrix', icon: '🧠', component: 'NeuralTasks', classified: false, description: 'Organize thoughts and missions' },
    { id: 'cosmic_learning', name: 'Cosmic Learning Hub', icon: '🚀', component: 'CosmicLearning', classified: false, description: 'Expand consciousness and skills' },
    { id: 'quantum_terminal', name: 'Quantum Terminal', icon: '⚡', component: 'QuantumTerminal', classified: true, description: 'Direct neural interface access' },
    { id: 'reality_analyzer', name: 'Reality Data Analyzer', icon: '🔮', component: 'RealityAnalyzer', classified: true, description: 'Analyze multidimensional data streams' },
    { id: 'cosmic_games', name: 'Cosmic Entertainment', icon: '🎮', component: 'CosmicGames', classified: false, description: 'Mind-expanding experiences' },
    { id: 'consciousness_vault', name: 'Consciousness Vault', icon: '🔐', component: 'ConsciousnessVault', classified: true, description: 'Secure neural configurations' },
    { id: 'dimensional_achievements', name: 'Achievement Matrix', icon: '🏆', component: 'DimensionalAchievements', classified: false, description: 'Track consciousness evolution' },
    { id: 'quantum_monitor', name: 'Quantum System Monitor', icon: '📡', component: 'QuantumMonitor', classified: true, description: 'Monitor dimensional stability' }
  ];

  // Enhanced Matrix Loading Screen with realistic progress and better effects
  const CosmicLoadingScreen = () => (
    <div className="cosmic-loading">
      {/* Animated star field background */}
      <div className="star-field">
        {starField.map(star => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.brightness,
              backgroundColor: star.color,
              boxShadow: `0 0 ${star.size * 2}px ${star.color}`
            }}
          />
        ))}
      </div>

      {/* Enhanced matrix rain with variable speeds */}
      <div className="matrix-rain-enhanced">
        {Array.from({ length: 80 }, (_, i) => (
          <div 
            key={i} 
            className="matrix-column-enhanced" 
            style={{ 
              left: `${i * 1.25}%`,
              animationDuration: `${2 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            {Array.from({ length: 40 }, (_, j) => (
              <span 
                key={j} 
                className="matrix-char-enhanced"
                style={{ 
                  opacity: Math.random(),
                  color: Math.random() > 0.7 ? cinematicThemes[currentTheme].accent : cinematicThemes[currentTheme].primary
                }}
              >
                {String.fromCharCode(0x30A0 + Math.random() * 96)}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Cosmic loading interface */}
      <div className="cosmic-loading-content">
        <div className="cosmic-title">
          <span className="title-main">THRIVEREMOTE</span>
          <span className="title-sub">QUANTUM CONSCIOUSNESS PORTAL</span>
        </div>
        
        <div className="loading-phase-display">
          <div className="phase-text">{loadingPhase}</div>
          <div className="neural-indicators">
            <div className="neural-pulse"></div>
            <div className="neural-pulse delay-1"></div>
            <div className="neural-pulse delay-2"></div>
          </div>
        </div>
        
        <div className="cosmic-progress-container">
          <div className="progress-outer-ring">
            <div className="progress-inner-ring">
              <div className="progress-percentage">{Math.floor(loadingProgress)}%</div>
              <div className="progress-eta">
                ETA: {Math.max(0, Math.floor((100 - loadingProgress) * 0.15))}s
              </div>
            </div>
          </div>
          <div 
            className="progress-arc"
            style={{
              background: `conic-gradient(
                ${cinematicThemes[currentTheme].primary} 0deg,
                ${cinematicThemes[currentTheme].accent} ${(loadingProgress / 100) * 360}deg,
                transparent ${(loadingProgress / 100) * 360}deg
              )`
            }}
          />
        </div>
        
        <div className="initialization-log">
          <div className="log-line">█ QUANTUM FIELD GENERATORS: ONLINE</div>
          <div className="log-line">█ NEURAL INTERFACE MATRIX: CALIBRATING</div>
          <div className="log-line">█ DIMENSIONAL GATEWAY: ESTABLISHING</div>
          <div className="log-line">█ CONSCIOUSNESS BRIDGE: SYNCHRONIZING</div>
          <div className="log-line">█ REALITY ANCHOR POINTS: STABILIZING</div>
          <div className="log-line pulsing">█ COSMIC AWARENESS: EXPANDING</div>
        </div>

        <div className="cosmic-loading-footer">
          <div className="dimension-coords">COORDS: α-42.7851 β-173.4328 γ-∞</div>
          <div className="reality-signature">REALITY SIGNATURE: THR1V3-R3M0T3-QU4NTUM</div>
        </div>
      </div>
    </div>
  );

  // Enhanced Window Components with cosmic styling
  const CosmicScanner = () => (
    <div className="cosmic-interface">
      <div className="cosmic-header">
        <span className="cosmic-prompt">quantum@scanner:~$</span> initiate-multidimensional-scan --reality-layers=∞
      </div>
      <div className="scan-results-cosmic">
        <div className="scan-line-cosmic">
          <span className="scan-status success">◉</span> ARIZONA QUANTUM FIELD: 127 ACTIVE NODES
        </div>
        <div className="scan-line-cosmic">
          <span className="scan-status success">◉</span> PEAK DISTRICT MATRIX: 89 NEURAL PATHWAYS
        </div>
        <div className="scan-line-cosmic">
          <span className="scan-status warning">◉</span> REMOTE WORK PORTALS: 1,247 DIMENSIONAL RIFTS
        </div>
        <div className="scan-line-cosmic">
          <span className="scan-status quantum">◉</span> CONSCIOUSNESS GATEWAYS: ACCESS EXPANDING
        </div>
      </div>
      
      <div className="network-tools-cosmic">
        <div className="cosmic-tools-section">
          <h3>🌌 QUANTUM NETWORK ANALYSIS</h3>
          <div className="cosmic-tool-grid">
            <a href="https://speedtest.net/" target="_blank" rel="noopener noreferrer" className="cosmic-tool-link">
              ⚡ Neural Speed Analysis
            </a>
            <a href="https://downdetector.com/" target="_blank" rel="noopener noreferrer" className="cosmic-tool-link">
              🔍 Reality Status Monitor
            </a>
            <a href="https://whatismyipaddress.com/" target="_blank" rel="noopener noreferrer" className="cosmic-tool-link">
              🌍 Dimensional Coordinates
            </a>
            <a href="https://mxtoolbox.com/" target="_blank" rel="noopener noreferrer" className="cosmic-tool-link">
              🛠️ Quantum Diagnostic Array
            </a>
          </div>
        </div>

        <div className="cosmic-tools-section">
          <h3>🚀 INTERSTELLAR NAVIGATION</h3>
          <div className="cosmic-tool-grid">
            <a href="https://makemydrivefun.com" target="_blank" rel="noopener noreferrer" className="cosmic-tool-link">
              🌌 Cosmic Route Optimizer
            </a>
            <a href="https://waze.com/" target="_blank" rel="noopener noreferrer" className="cosmic-tool-link">
              🗺️ Reality Navigation Matrix
            </a>
            <a href="https://maps.google.com/" target="_blank" rel="noopener noreferrer" className="cosmic-tool-link">
              📍 Dimensional Mapping System
            </a>
            <a href="https://gasbuddy.com/" target="_blank" rel="noopener noreferrer" className="cosmic-tool-link">
              ⛽ Energy Source Locator
            </a>
          </div>
        </div>
      </div>

      <div className="quantum-visualization">
        <div className="visualization-title">LIVE QUANTUM FIELD TOPOLOGY</div>
        <div className="quantum-grid">
          {Array.from({ length: 64 }, (_, i) => (
            <div 
              key={i} 
              className={`quantum-node ${Math.random() > 0.7 ? 'active' : ''} ${Math.random() > 0.9 ? 'critical' : ''}`}
              style={{
                animationDelay: `${i * 0.05}s`,
                '--quantum-color': cinematicThemes[currentTheme].accent
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderWindowContent = (component) => {
    switch (component) {
      case 'CosmicScanner': return <CosmicScanner />;
      case 'QuantumJobs': return <div className="cosmic-interface"><div className="cosmic-coming-soon">🌌 Quantum Job Portal<br/>Scanning interdimensional opportunities...</div></div>;
      case 'DimensionalRelocation': return <div className="cosmic-interface"><div className="cosmic-coming-soon">🌠 Dimensional Gateway<br/>Arizona ↔ Peak District portal active</div></div>;
      case 'StellarFinance': return <div className="cosmic-interface"><div className="cosmic-coming-soon">⭐ Stellar Finance<br/>Tracking cosmic resources...</div></div>;
      case 'NeuralTasks': return <div className="cosmic-interface"><div className="cosmic-coming-soon">🧠 Neural Task Matrix<br/>Organizing quantum thoughts...</div></div>;
      case 'CosmicLearning': return <div className="cosmic-interface"><div className="cosmic-coming-soon">🚀 Cosmic Learning Hub<br/>Expanding consciousness...</div></div>;
      case 'QuantumTerminal': return <div className="cosmic-interface"><div className="cosmic-coming-soon">⚡ Quantum Terminal<br/>Neural interface ready...</div></div>;
      case 'RealityAnalyzer': return <div className="cosmic-interface"><div className="cosmic-coming-soon">🔮 Reality Analyzer<br/>Processing dimensional data...</div></div>;
      case 'CosmicGames': return <div className="cosmic-interface"><div className="cosmic-coming-soon">🎮 Cosmic Entertainment<br/>Mind-expanding experiences...</div></div>;
      case 'ConsciousnessVault': return <div className="cosmic-interface"><div className="cosmic-coming-soon">🔐 Consciousness Vault<br/>Securing neural patterns...</div></div>;
      case 'DimensionalAchievements': return <div className="cosmic-interface"><div className="cosmic-coming-soon">🏆 Achievement Matrix<br/>Tracking evolution...</div></div>;
      case 'QuantumMonitor': return <div className="cosmic-interface"><div className="cosmic-coming-soon">📡 Quantum Monitor<br/>Reality stability: OPTIMAL</div></div>;
      default: return <div className="cosmic-interface"><div className="cosmic-coming-soon">🌌 Loading cosmic interface...</div></div>;
    }
  };

  // Show cosmic loading screen
  if (matrixLoading) {
    return <CosmicLoadingScreen />;
  }

  const currentThemeData = cinematicThemes[currentTheme];

  return (
    <div 
      className={`cosmic-portal ${currentTheme}-theme`}
      style={{
        background: currentThemeData.background,
        '--primary-color': currentThemeData.primary,
        '--secondary-color': currentThemeData.secondary,
        '--accent-color': currentThemeData.accent,
        '--nebula-color': currentThemeData.nebula,
        '--quantum-color': currentThemeData.quantum
      }}
    >
      {/* Dynamic cosmic background */}
      <div className="cosmic-background">
        <div className="star-field">
          {starField.map(star => (
            <div
              key={star.id}
              className="star"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.brightness,
                backgroundColor: star.color,
                boxShadow: `0 0 ${star.size * 2}px ${star.color}`
              }}
            />
          ))}
        </div>
        
        {/* Nebula effects */}
        <div className="nebula-layer">
          <div 
            className="nebula-cloud nebula-1"
            style={{
              transform: `translate(${nebulaDrift * 0.1}px, ${Math.sin(nebulaDrift * 0.01) * 50}px)`,
              opacity: pulseIntensity * 0.3
            }}
          />
          <div 
            className="nebula-cloud nebula-2"
            style={{
              transform: `translate(${-nebulaDrift * 0.15}px, ${Math.cos(nebulaDrift * 0.008) * 30}px)`,
              opacity: pulseIntensity * 0.2
            }}
          />
        </div>
      </div>

      {/* Enhanced notification system with cosmic styling */}
      <div className="cosmic-notification-matrix">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`cosmic-notification ${notification.type}`}
            style={{ borderColor: currentThemeData.primary }}
            onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
          >
            <div className="notification-title">{notification.title}</div>
            <div className="notification-message">{notification.message}</div>
            <div className="notification-time">{new Date(notification.timestamp).toLocaleTimeString()}</div>
            <div className="notification-pulse" />
          </div>
        ))}
      </div>

      {/* Quantum Control Panel */}
      <div className="quantum-control-panel">
        <div className="panel-left">
          <div className="cosmic-logo">
            <span className="logo-main">◉ THRIVEREMOTE</span>
            <span className="logo-sub">QUANTUM CONSCIOUSNESS v5.0</span>
          </div>
          <div className="network-status-cosmic">
            <span className="status-indicator quantum">◉</span> 
            NETWORK: {networkConnected ? 'QUANTUM ENTANGLED' : 'REALITY DRIFT'} | 
            SECURITY: {securityLevel} |
            STREAK: {userStats.streakDays} CYCLES |
            POINTS: {userStats.totalPoints.toLocaleString()}
          </div>
        </div>
        
        <div className="panel-right">
          <div className="theme-constellation">
            {Object.keys(cinematicThemes).map(theme => (
              <button
                key={theme}
                className={`cosmic-theme-btn ${currentTheme === theme ? 'active' : ''}`}
                onClick={() => changeTheme(theme)}
                style={{ 
                  borderColor: currentTheme === theme ? currentThemeData.primary : 'transparent',
                  color: currentTheme === theme ? currentThemeData.primary : '#666',
                  boxShadow: currentTheme === theme ? `0 0 20px ${currentThemeData.primary}` : 'none'
                }}
              >
                {cinematicThemes[theme].name}
              </button>
            ))}
          </div>
          
          <div className="cosmic-time" style={{ color: currentThemeData.primary }}>
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Enhanced Application Constellation */}
      <div className="application-constellation">
        {portalApplications.map((app, index) => (
          <div
            key={app.id}
            className={`cosmic-app ${app.classified ? 'classified' : ''}`}
            style={{ 
              animationDelay: `${index * 0.1}s`,
              borderColor: app.classified && !terminalAccess ? '#ff0000' : currentThemeData.primary
            }}
            onClick={() => {
              if (app.classified && !terminalAccess) {
                requestTerminalAccess();
              } else {
                openWindow(app.id, app.name, app.component, app.classified);
              }
            }}
          >
            <div className="app-icon-cosmic" style={{ color: currentThemeData.primary }}>
              {app.icon}
            </div>
            <div className="app-name-cosmic" style={{ color: currentThemeData.textColor }}>
              {app.name}
            </div>
            <div className="app-description-cosmic" style={{ color: currentThemeData.secondary }}>
              {app.description}
            </div>
            {app.classified && !terminalAccess && (
              <div className="quantum-lock">🔒 QUANTUM LOCKED</div>
            )}
            <div className="cosmic-glow" style={{ boxShadow: `0 0 30px ${currentThemeData.accent}` }} />
          </div>
        ))}
      </div>

      {/* Enhanced Active Windows */}
      {activeWindows.map(window => (
        <div
          key={window.id}
          className={`cosmic-window ${window.minimized ? 'minimized' : ''} ${window.opening ? 'opening' : ''} ${window.closing ? 'closing' : ''}`}
          style={{
            left: window.position.x,
            top: window.position.y,
            zIndex: window.zIndex,
            width: window.size.width,
            height: window.size.height,
            backgroundColor: currentThemeData.windowBg,
            borderColor: window.classified ? '#ff0000' : currentThemeData.primary,
            boxShadow: `0 0 50px ${currentThemeData.primary}, inset 0 0 50px rgba(0,0,0,0.3)`
          }}
        >
          <div 
            className="cosmic-window-header"
            style={{ 
              backgroundColor: currentThemeData.windowBg,
              borderBottomColor: currentThemeData.primary 
            }}
          >
            <div className="window-title-cosmic" style={{ color: currentThemeData.primary }}>
              {window.classified && '🔮 '}{window.title}
            </div>
            <div className="cosmic-window-controls">
              <button
                className="cosmic-window-control minimize"
                onClick={() => minimizeWindow(window.id)}
                style={{ color: currentThemeData.accent }}
              >
                ◦
              </button>
              <button
                className="cosmic-window-control close"
                onClick={() => closeWindow(window.id)}
                style={{ color: '#ff4444' }}
              >
                ◉
              </button>
            </div>
          </div>
          {!window.minimized && (
            <div className="cosmic-window-content" style={{ color: currentThemeData.textColor }}>
              {renderWindowContent(window.component)}
            </div>
          )}
        </div>
      ))}

      {/* Quantum Status Bar */}
      <div className="quantum-status-bar" style={{ backgroundColor: currentThemeData.windowBg }}>
        <div className="status-left">
          <span style={{ color: currentThemeData.primary }}>◉</span> 
          QUANTUM PORTAL ACTIVE | 
          ENTANGLEMENTS: {userStats.quantumEntanglements} | 
          DATA: {userStats.dataHarvested}
        </div>
        <div className="status-center">
          {activeWindows.map(window => (
            <div
              key={window.id}
              className={`cosmic-status-window ${window.minimized ? 'minimized' : ''}`}
              onClick={() => minimizeWindow(window.id)}
              style={{ 
                backgroundColor: window.minimized ? 'transparent' : currentThemeData.primary,
                color: window.minimized ? currentThemeData.primary : '#000',
                boxShadow: window.minimized ? 'none' : `0 0 15px ${currentThemeData.primary}`
              }}
            >
              {window.title}
            </div>
          ))}
        </div>
        <div className="status-right" style={{ color: currentThemeData.primary }}>
          {currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default App;