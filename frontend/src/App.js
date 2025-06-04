import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const App = () => {
  // System state
  const [systemInitialized, setSystemInitialized] = useState(false);
  const [matrixLoading, setMatrixLoading] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('matrix');
  const [networkConnected, setNetworkConnected] = useState(false);
  const [securityLevel, setSecurityLevel] = useState('CLASSIFIED');

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
  const [transparency, setTransparency] = useState(95);
  const [terminalAccess, setTerminalAccess] = useState(false);
  const [userStats, setUserStats] = useState({
    streakDays: 15,
    totalPoints: 2847,
    networkPenetrations: 23,
    systemsAccessed: 7,
    dataExtracted: '127.3 GB'
  });

  // User cursor tracking
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [dotLock, setDotLock] = useState(false);

  // Network background scenery
  const networkBackgrounds = [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', // Forest
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', // Mountain lake
    'https://images.unsplash.com/photo-1447758902204-850440cd4d6d', // Countryside
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000', // Nature scene
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29'  // Forest path
  ];

  // Themes
  const themes = {
    matrix: {
      name: 'MATRIX PROTOCOL',
      primary: '#00ff41',
      secondary: '#008f11',
      background: 'linear-gradient(0deg, #000000 0%, #001100 100%)',
      windowBg: 'rgba(0, 0, 0, 0.95)',
      textColor: '#00ff41'
    },
    retro: {
      name: 'RETRO TERMINAL',
      primary: '#ff6600',
      secondary: '#cc3300',
      background: 'linear-gradient(45deg, #2d1810 0%, #1a0a00 100%)',
      windowBg: 'rgba(45, 24, 16, 0.95)',
      textColor: '#ff6600'
    },
    future: {
      name: 'FUTURE AI',
      primary: '#00d4ff',
      secondary: '#0099cc',
      background: 'linear-gradient(135deg, #0a0a1e 0%, #1e0a3e 100%)',
      windowBg: 'rgba(10, 10, 30, 0.95)',
      textColor: '#00d4ff'
    },
    stealth: {
      name: 'STEALTH MODE',
      primary: '#ff0040',
      secondary: '#990026',
      background: 'linear-gradient(180deg, #1a0000 0%, #000000 100%)',
      windowBg: 'rgba(26, 0, 0, 0.95)',
      textColor: '#ff0040'
    }
  };

  // Matrix loading animation
  useEffect(() => {
    if (matrixLoading) {
      const timer = setTimeout(() => {
        setMatrixLoading(false);
        setSystemInitialized(true);
        setNetworkConnected(true);
        setNotifications([{
          id: 'system_init',
          type: 'success',
          title: '🔒 SYSTEM ACCESS GRANTED',
          message: 'THRIVEREMOTE NETWORK PORTAL INITIALIZED',
          timestamp: new Date().toISOString()
        }]);
      }, 18000); // 18 seconds matrix loading

      return () => clearTimeout(timer);
    }
  }, [matrixLoading]);

  // Cursor tracking with dot lock
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      // Dot lock mechanism
      const isOnDot = (e.clientX % 20 < 10) && (e.clientY % 20 < 10);
      if (isOnDot && !dotLock) {
        setDotLock(true);
        setTimeout(() => setDotLock(false), 150);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [dotLock]);

  // Enhanced window management
  const openWindow = (windowId, title, component, requiresAuth = false) => {
    if (requiresAuth && !terminalAccess) {
      setNotifications(prev => [...prev, {
        id: 'access_denied',
        type: 'error',
        title: '🚫 ACCESS DENIED',
        message: 'TERMINAL AUTHORIZATION REQUIRED - TYPE "Y" TO CONFIRM',
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

  // Theme changer with security confirmation
  const changeTheme = (newTheme) => {
    setNotifications(prev => [...prev, {
      id: 'theme_change_request',
      type: 'warning',
      title: '⚠️ SECURITY CHECKPOINT',
      message: 'THEME CHANGE DETECTED - AUTHORIZATION REQUIRED',
      timestamp: new Date().toISOString()
    }]);

    const confirmAuth = prompt("🔒 SECURITY PROTOCOL ACTIVATED\nEnter 'Y' to confirm theme change:");
    if (confirmAuth?.toUpperCase() === 'Y') {
      setCurrentTheme(newTheme);
      setNotifications(prev => [...prev, {
        id: 'theme_changed',
        type: 'success',
        title: '✅ THEME PROTOCOL UPDATED',
        message: `SWITCHED TO: ${themes[newTheme].name}`,
        timestamp: new Date().toISOString()
      }]);
    } else {
      setNotifications(prev => [...prev, {
        id: 'theme_denied',
        type: 'error',
        title: '🚫 ACCESS DENIED',
        message: 'INVALID AUTHORIZATION CODE',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  // Terminal authorization
  const requestTerminalAccess = () => {
    const authCode = prompt("🔐 RESTRICTED SYSTEM ACCESS\nEnter 'Y' to proceed with terminal authorization:");
    if (authCode?.toUpperCase() === 'Y') {
      setTerminalAccess(true);
      setSecurityLevel('AUTHORIZED');
      setNotifications(prev => [...prev, {
        id: 'terminal_access',
        type: 'success',
        title: '🔓 TERMINAL ACCESS GRANTED',
        message: 'CLASSIFIED SYSTEMS NOW AVAILABLE',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  // Network portal applications
  const portalApplications = [
    { id: 'network_scanner', name: 'Network Scanner', icon: '🌐', component: 'NetworkScanner', classified: false },
    { id: 'job_hunter', name: 'Remote Jobs Portal', icon: '💼', component: 'JobHunter', classified: false },
    { id: 'relocation_matrix', name: 'Relocation Matrix', icon: '🏡', component: 'RelocationMatrix', classified: false },
    { id: 'financial_tracker', name: 'Financial Tracker', icon: '💰', component: 'FinancialTracker', classified: false },
    { id: 'task_commander', name: 'Task Commander', icon: '⚡', component: 'TaskCommander', classified: false },
    { id: 'learning_vault', name: 'Learning Vault', icon: '🎓', component: 'LearningVault', classified: false },
    { id: 'system_terminal', name: 'System Terminal', icon: '💻', component: 'SystemTerminal', classified: true },
    { id: 'data_analyzer', name: 'Data Analyzer', icon: '📊', component: 'DataAnalyzer', classified: true },
    { id: 'network_games', name: 'Network Games', icon: '🎮', component: 'NetworkGames', classified: false },
    { id: 'settings_vault', name: 'Settings Vault', icon: '⚙️', component: 'SettingsVault', classified: true },
    { id: 'achievement_hunter', name: 'Achievement Hunter', icon: '🏆', component: 'AchievementHunter', classified: false },
    { id: 'system_monitor', name: 'System Monitor', icon: '📈', component: 'SystemMonitor', classified: true }
  ];

  // Fetch real data
  useEffect(() => {
    if (!systemInitialized) return;

    const fetchLiveData = async () => {
      try {
        // Fetch real remote jobs
        const jobsResponse = await fetch(`${BACKEND_URL}/api/jobs/live`);
        if (jobsResponse.ok) {
          const jobData = await jobsResponse.json();
          setJobs(jobData.jobs || []);
        }

        // Fetch user statistics
        const statsResponse = await fetch(`${BACKEND_URL}/api/dashboard/stats`);
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setDashboardStats(stats);
        }

        // Update user points and streaks
        setUserStats(prev => ({
          ...prev,
          totalPoints: prev.totalPoints + Math.floor(Math.random() * 10),
          streakDays: Math.max(1, prev.streakDays + (Math.random() > 0.8 ? 1 : 0))
        }));

      } catch (error) {
        console.error('Error fetching live data:', error);
      }
    };

    fetchLiveData();
    const dataInterval = setInterval(fetchLiveData, 60000); // Update every minute

    return () => clearInterval(dataInterval);
  }, [systemInitialized]);

  // Update time
  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Auto-dismiss notifications
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(prev => prev.filter(n => {
        const age = new Date() - new Date(n.timestamp);
        return age < 10000; // 10 seconds
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Matrix Loading Screen
  const MatrixLoadingScreen = () => (
    <div className="matrix-loading">
      <div className="matrix-rain">
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} className="matrix-column" style={{ left: `${i * 2}%` }}>
            {Array.from({ length: 30 }, (_, j) => (
              <span key={j} className="matrix-char">
                {String.fromCharCode(0x30A0 + Math.random() * 96)}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="loading-content">
        <div className="loading-title">THRIVEREMOTE NETWORK PORTAL</div>
        <div className="loading-subtitle">INITIALIZING SECURE CONNECTION...</div>
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
        <div className="loading-status">
          <div>█ ESTABLISHING ENCRYPTED TUNNEL</div>
          <div>█ VERIFYING NETWORK CREDENTIALS</div>
          <div>█ LOADING REMOTE WORK PROTOCOLS</div>
          <div>█ SCANNING RELOCATION DATABASES</div>
          <div>█ ACTIVATING FINANCIAL TRACKERS</div>
          <div className="blinking">█ READY FOR INFILTRATION</div>
        </div>
      </div>
    </div>
  );

  // Window Components
  const NetworkScanner = () => (
    <div className="network-interface">
      <div className="network-header">
        <span className="network-prompt">admin@thriveremote:~$</span> network-scan --live --remote-jobs
      </div>
      <div className="scan-results">
        <div className="scan-line">
          <span className="scan-status success">●</span> ARIZONA NETWORKS: 127 ACTIVE CONNECTIONS
        </div>
        <div className="scan-line">
          <span className="scan-status success">●</span> PEAK DISTRICT LAN: 89 NODES DETECTED
        </div>
        <div className="scan-line">
          <span className="scan-status warning">●</span> REMOTE WORK PORTALS: 1,247 OPPORTUNITIES
        </div>
        <div className="scan-line">
          <span className="scan-status error">●</span> CLASSIFIED SERVERS: ACCESS RESTRICTED
        </div>
      </div>
      
      <div className="network-tools">
        <div className="tools-section">
          <h3>🌐 NETWORK ANALYSIS TOOLS</h3>
          <div className="tool-links">
            <a href="https://speedtest.net/" target="_blank" rel="noopener noreferrer" className="tool-link">
              📡 Internet Speed Test
            </a>
            <a href="https://downdetector.com/" target="_blank" rel="noopener noreferrer" className="tool-link">
              🔍 Service Status Checker
            </a>
            <a href="https://whatismyipaddress.com/" target="_blank" rel="noopener noreferrer" className="tool-link">
              🌍 IP Address Lookup
            </a>
            <a href="https://mxtoolbox.com/" target="_blank" rel="noopener noreferrer" className="tool-link">
              🛠️ MX Toolbox Network Tools
            </a>
          </div>
        </div>

        <div className="tools-section">
          <h3>🚗 REMOTE WORK TRAVEL TOOLS</h3>
          <div className="tool-links">
            <a href="https://makemydrivefun.com" target="_blank" rel="noopener noreferrer" className="tool-link">
              🚗 Make My Drive Fun
            </a>
            <a href="https://waze.com/" target="_blank" rel="noopener noreferrer" className="tool-link">
              🗺️ Waze Navigation
            </a>
            <a href="https://maps.google.com/" target="_blank" rel="noopener noreferrer" className="tool-link">
              📍 Google Maps
            </a>
            <a href="https://gasbuddy.com/" target="_blank" rel="noopener noreferrer" className="tool-link">
              ⛽ GasBuddy Fuel Prices
            </a>
          </div>
        </div>

        <div className="tools-section">
          <h3>💼 PROFESSIONAL NETWORKING</h3>
          <div className="tool-links">
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="tool-link">
              💼 LinkedIn Professional
            </a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="tool-link">
              💻 GitHub Developer Hub
            </a>
            <a href="https://stackoverflow.com/" target="_blank" rel="noopener noreferrer" className="tool-link">
              ❓ Stack Overflow
            </a>
            <a href="https://dev.to/" target="_blank" rel="noopener noreferrer" className="tool-link">
              📝 Dev.to Community
            </a>
          </div>
        </div>
      </div>

      <div className="network-map">
        <div className="map-title">LIVE NETWORK TOPOLOGY</div>
        <div className="network-grid">
          {Array.from({ length: 64 }, (_, i) => (
            <div key={i} className={`network-node ${Math.random() > 0.7 ? 'active' : ''}`}></div>
          ))}
        </div>
      </div>
    </div>
  );

  const JobHunter = () => (
    <div className="job-hunter-interface">
      <div className="job-header">
        <span className="job-prompt">jobs@remote:~$</span> scan-opportunities --arizona-to-peak-district
      </div>
      <div className="job-controls">
        <button className="cyber-button" onClick={() => window.open('https://aiapply.co/', '_blank')}>
          🤖 AI APPLY PORTAL
        </button>
        <button className="cyber-button" onClick={() => window.open('https://remote.co/', '_blank')}>
          🌍 REMOTE.CO GATEWAY
        </button>
        <button className="cyber-button" onClick={() => window.open('https://weworkremotely.com/', '_blank')}>
          💼 WEWORK REMOTELY
        </button>
        <button className="cyber-button" onClick={() => window.open('https://makemydrivefun.com', '_blank')}>
          🚗 DRIVE OPTIMIZER
        </button>
        <button className="cyber-button" onClick={() => window.open('https://remotive.io/', '_blank')}>
          ⚡ REMOTIVE JOBS
        </button>
        <button className="cyber-button" onClick={() => window.open('https://angel.co/jobs', '_blank')}>
          🚀 ANGELLIST STARTUP JOBS
        </button>
        <button className="cyber-button" onClick={() => window.open('https://nomadjobs.io/', '_blank')}>
          🏔️ NOMAD JOBS
        </button>
        <button className="cyber-button" onClick={() => window.open('https://justremote.co/', '_blank')}>
          🎯 JUST REMOTE
        </button>
      </div>
      
      <div className="job-categories">
        <div className="category-section">
          <h3>🍽️ WAITRESS & SERVICE JOBS</h3>
          <div className="job-item">
            <div className="job-title">Remote Customer Service Representative</div>
            <div className="job-company">Hospitality Solutions Inc.</div>
            <div className="job-details">
              <span className="salary">$35,000 - $45,000/year</span>
              <span className="benefits">Health, Dental, Vision, 401k</span>
            </div>
            <div className="job-description">
              Handle customer inquiries, manage reservations, provide exceptional service support
            </div>
            <div className="job-links">
              <a href="https://aiapply.co/" target="_blank" rel="noopener noreferrer" className="job-link">Apply with AI</a>
              <a href="https://indeed.com/jobs?q=remote+customer+service" target="_blank" rel="noopener noreferrer" className="job-link">View on Indeed</a>
              <a href="https://glassdoor.com/Jobs/remote-customer-service-jobs-SRCH_KO0,23.htm" target="_blank" rel="noopener noreferrer" className="job-link">Glassdoor Reviews</a>
            </div>
          </div>
          
          <div className="job-item">
            <div className="job-title">Virtual Restaurant Coordinator</div>
            <div className="job-company">Peak District Hospitality Network</div>
            <div className="job-details">
              <span className="salary">£28,000 - £35,000/year</span>
              <span className="benefits">NHS, Pension, Flexible Hours</span>
            </div>
            <div className="job-description">
              Coordinate online orders, manage staff schedules, customer relations
            </div>
            <div className="job-links">
              <a href="https://uk.indeed.com/jobs?q=remote+hospitality" target="_blank" rel="noopener noreferrer" className="job-link">UK Indeed</a>
              <a href="https://totaljobs.com/jobs/remote" target="_blank" rel="noopener noreferrer" className="job-link">Total Jobs</a>
              <a href="https://reed.co.uk/jobs/remote" target="_blank" rel="noopener noreferrer" className="job-link">Reed.co.uk</a>
            </div>
          </div>
        </div>

        <div className="category-section">
          <h3>💻 TECH & REMOTE WORK</h3>
          <div className="job-item">
            <div className="job-title">Full Stack Developer</div>
            <div className="job-company">Arizona Tech Solutions</div>
            <div className="job-details">
              <span className="salary">$75,000 - $95,000/year</span>
              <span className="benefits">Remote First, Stock Options, Learning Budget</span>
            </div>
            <div className="job-links">
              <a href="https://stackoverflow.com/jobs?r=true" target="_blank" rel="noopener noreferrer" className="job-link">Stack Overflow Jobs</a>
              <a href="https://github.com/jobs" target="_blank" rel="noopener noreferrer" className="job-link">GitHub Jobs</a>
              <a href="https://dice.com/jobs?q=remote%20developer" target="_blank" rel="noopener noreferrer" className="job-link">Dice Tech Jobs</a>
              <a href="https://toptal.com/developers" target="_blank" rel="noopener noreferrer" className="job-link">Toptal Freelance</a>
            </div>
          </div>
          
          <div className="job-item">
            <div className="job-title">Digital Marketing Specialist</div>
            <div className="job-company">Peak District Digital</div>
            <div className="job-details">
              <span className="salary">£35,000 - £45,000/year</span>
              <span className="benefits">Work From Home, Training, Career Growth</span>
            </div>
            <div className="job-links">
              <a href="https://marketingjobs.com/" target="_blank" rel="noopener noreferrer" className="job-link">Marketing Jobs</a>
              <a href="https://hubspot.com/jobs" target="_blank" rel="noopener noreferrer" className="job-link">HubSpot Careers</a>
              <a href="https://workable.com/jobs" target="_blank" rel="noopener noreferrer" className="job-link">Workable Jobs</a>
            </div>
          </div>
        </div>

        <div className="category-section">
          <h3>🌐 FREELANCE & GIG ECONOMY</h3>
          <div className="job-item">
            <div className="job-title">Freelance Opportunities</div>
            <div className="job-company">Multiple Platforms</div>
            <div className="job-details">
              <span className="salary">$25 - $150/hour</span>
              <span className="benefits">Flexible Schedule, Choose Projects</span>
            </div>
            <div className="job-links">
              <a href="https://upwork.com/" target="_blank" rel="noopener noreferrer" className="job-link">Upwork</a>
              <a href="https://fiverr.com/" target="_blank" rel="noopener noreferrer" className="job-link">Fiverr</a>
              <a href="https://freelancer.com/" target="_blank" rel="noopener noreferrer" className="job-link">Freelancer.com</a>
              <a href="https://guru.com/" target="_blank" rel="noopener noreferrer" className="job-link">Guru</a>
              <a href="https://99designs.com/" target="_blank" rel="noopener noreferrer" className="job-link">99designs</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TaskCommander = () => {
    const [newTask, setNewTask] = useState('');
    
    const uploadTasks = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,.csv,.txt';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = JSON.parse(e.target.result);
              setTasks(prev => [...prev, ...data]);
              setNotifications(prev => [...prev, {
                id: 'tasks_uploaded',
                type: 'success',
                title: '📤 TASKS UPLOADED',
                message: `${data.length} tasks imported successfully`,
                timestamp: new Date().toISOString()
              }]);
            } catch (error) {
              console.error('Error parsing task file:', error);
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    };

    const downloadTasks = () => {
      const dataStr = JSON.stringify(tasks, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `thriveremote-tasks-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setNotifications(prev => [...prev, {
        id: 'tasks_downloaded',
        type: 'success',
        title: '📥 TASKS DOWNLOADED',
        message: 'Task list exported successfully',
        timestamp: new Date().toISOString()
      }]);
    };

    return (
      <div className="task-commander">
        <div className="task-header">
          <span className="task-prompt">tasks@commander:~$</span> list-missions --priority-alpha
        </div>
        
        <div className="task-controls">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new mission directive..."
            className="task-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTask.trim()) {
                setTasks(prev => [...prev, {
                  id: Date.now(),
                  title: newTask,
                  status: 'active',
                  priority: 'high',
                  created: new Date().toISOString()
                }]);
                setNewTask('');
              }
            }}
          />
          <button className="cyber-button" onClick={uploadTasks}>
            📤 UPLOAD MISSIONS
          </button>
          <button className="cyber-button" onClick={downloadTasks}>
            📥 DOWNLOAD MISSIONS
          </button>
        </div>

        <div className="mission-list">
          {tasks.map((task, index) => (
            <div key={task.id || index} className="mission-item">
              <div className="mission-status">
                <span className={`status-indicator ${task.status || 'active'}`}>●</span>
              </div>
              <div className="mission-content">
                <div className="mission-title">{task.title}</div>
                <div className="mission-meta">
                  Priority: {task.priority || 'medium'} | Created: {task.created?.split('T')[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const LearningVault = () => (
    <div className="learning-vault">
      <div className="vault-header">
        <span className="vault-prompt">learning@vault:~$</span> access-knowledge-base --classified
      </div>
      
      <div className="learning-categories">
        <div className="learning-section">
          <h3>🍽️ HOSPITALITY & SERVICE SKILLS</h3>
          <div className="course-item">
            <div className="course-title">Advanced Customer Service Protocols</div>
            <div className="course-provider">Arizona Hospitality Institute</div>
            <div className="course-details">
              <span className="duration">40 hours</span>
              <span className="certification">Certificate Included</span>
            </div>
            <div className="course-benefits">
              💼 Salary Range: $30,000 - $45,000<br/>
              🏥 Benefits: Health insurance, paid time off, tips<br/>
              📈 Career Path: Service → Supervisor → Manager
            </div>
            <div className="course-links">
              <a href="https://coursera.org/courses?query=customer%20service" target="_blank" rel="noopener noreferrer" className="course-link">Coursera Courses</a>
              <a href="https://udemy.com/courses/search/?q=customer+service" target="_blank" rel="noopener noreferrer" className="course-link">Udemy Training</a>
              <a href="https://skillshare.com/browse/customer-service" target="_blank" rel="noopener noreferrer" className="course-link">Skillshare Classes</a>
              <a href="https://linkedin.com/learning/topics/customer-service" target="_blank" rel="noopener noreferrer" className="course-link">LinkedIn Learning</a>
            </div>
          </div>

          <div className="course-item">
            <div className="course-title">Food Safety & Hygiene Management</div>
            <div className="course-provider">Peak District Training Center</div>
            <div className="course-details">
              <span className="duration">20 hours</span>
              <span className="certification">Level 3 Certified</span>
            </div>
            <div className="course-benefits">
              💼 Salary Boost: +£5,000/year<br/>
              🏥 Benefits: NHS access, pension scheme<br/>
              📈 Required for: Restaurant management roles
            </div>
            <div className="course-links">
              <a href="https://foodsafety.gov/" target="_blank" rel="noopener noreferrer" className="course-link">FDA Food Safety</a>
              <a href="https://servsafe.com/" target="_blank" rel="noopener noreferrer" className="course-link">ServSafe Certification</a>
              <a href="https://food.gov.uk/business-guidance" target="_blank" rel="noopener noreferrer" className="course-link">UK Food Standards</a>
            </div>
          </div>
        </div>

        <div className="learning-section">
          <h3>💻 REMOTE WORK MASTERY</h3>
          <div className="course-item">
            <div className="course-title">Digital Nomad Success Framework</div>
            <div className="course-provider">Remote Work Academy</div>
            <div className="course-benefits">
              💼 Potential Earnings: $50,000 - $100,000<br/>
              🌍 Location: Work from anywhere<br/>
              📈 Skills: Communication, time management, digital tools
            </div>
            <div className="course-links">
              <a href="https://nomadlist.com/" target="_blank" rel="noopener noreferrer" className="course-link">Nomad List Community</a>
              <a href="https://remoteyear.com/" target="_blank" rel="noopener noreferrer" className="course-link">Remote Year Programs</a>
              <a href="https://udemy.com/course/digital-nomad-lifestyle/" target="_blank" rel="noopener noreferrer" className="course-link">Nomad Lifestyle Course</a>
              <a href="https://makemydrivefun.com" target="_blank" rel="noopener noreferrer" className="course-link">Drive Optimization</a>
            </div>
          </div>

          <div className="course-item">
            <div className="course-title">Full Stack Web Development</div>
            <div className="course-provider">Arizona State University Online</div>
            <div className="course-benefits">
              💼 Average Salary: $75,000 - $120,000<br/>
              🏥 Benefits: Premium health, stock options<br/>
              📈 Growth: High demand, constant learning
            </div>
            <div className="course-links">
              <a href="https://freecodecamp.org/" target="_blank" rel="noopener noreferrer" className="course-link">FreeCodeCamp</a>
              <a href="https://codecademy.com/" target="_blank" rel="noopener noreferrer" className="course-link">Codecademy</a>
              <a href="https://theodinproject.com/" target="_blank" rel="noopener noreferrer" className="course-link">The Odin Project</a>
              <a href="https://github.com/microsoft/Web-Dev-For-Beginners" target="_blank" rel="noopener noreferrer" className="course-link">Microsoft Web Dev</a>
              <a href="https://developer.mozilla.org/en-US/docs/Learn" target="_blank" rel="noopener noreferrer" className="course-link">MDN Web Docs</a>
            </div>
          </div>

          <div className="course-item">
            <div className="course-title">Remote Team Management</div>
            <div className="course-provider">Virtual Leadership Institute</div>
            <div className="course-benefits">
              💼 Manager Salary: $80,000 - $150,000<br/>
              🎯 Skills: Leadership, communication, project management<br/>
              📈 Demand: Critical for distributed teams
            </div>
            <div className="course-links">
              <a href="https://slack.com/resources/articles/remote-work" target="_blank" rel="noopener noreferrer" className="course-link">Slack Remote Guide</a>
              <a href="https://zapier.com/learn/remote-work/" target="_blank" rel="noopener noreferrer" className="course-link">Zapier Remote Resources</a>
              <a href="https://buffer.com/resources/remote-work/" target="_blank" rel="noopener noreferrer" className="course-link">Buffer Remote Guide</a>
              <a href="https://trello.com/remote-work-guide" target="_blank" rel="noopener noreferrer" className="course-link">Trello Remote Guide</a>
            </div>
          </div>
        </div>

        <div className="learning-section">
          <h3>🌍 RELOCATION PREPARATION</h3>
          <div className="course-item">
            <div className="course-title">UK Immigration & Work Permits</div>
            <div className="course-provider">Peak District Immigration Services</div>
            <div className="course-benefits">
              📋 Visa Types: Skilled Worker, Global Talent<br/>
              💰 Processing Cost: £1,200 - £3,000<br/>
              ⏱️ Timeline: 3-8 weeks processing
            </div>
            <div className="course-links">
              <a href="https://gov.uk/government/organisations/uk-visas-and-immigration" target="_blank" rel="noopener noreferrer" className="course-link">UK Visas & Immigration</a>
              <a href="https://gov.uk/skilled-worker-visa" target="_blank" rel="noopener noreferrer" className="course-link">Skilled Worker Visa</a>
              <a href="https://gov.uk/global-talent-visa" target="_blank" rel="noopener noreferrer" className="course-link">Global Talent Visa</a>
              <a href="https://britishcouncil.org/exam/ielts" target="_blank" rel="noopener noreferrer" className="course-link">IELTS English Test</a>
            </div>
          </div>

          <div className="course-item">
            <div className="course-title">International Moving & Logistics</div>
            <div className="course-provider">Global Relocation Network</div>
            <div className="course-benefits">
              📦 Services: Shipping, customs, storage<br/>
              💰 Cost Range: £5,000 - £15,000<br/>
              ⏱️ Timeline: 6-12 weeks door-to-door
            </div>
            <div className="course-links">
              <a href="https://sevencorners.com/international-moving" target="_blank" rel="noopener noreferrer" className="course-link">Seven Corners Moving</a>
              <a href="https://alliedvanlines.com/moving-tips/international" target="_blank" rel="noopener noreferrer" className="course-link">Allied International</a>
              <a href="https://sirelo.com/international-moving/" target="_blank" rel="noopener noreferrer" className="course-link">Sirelo Moving Guide</a>
              <a href="https://expatfocus.com/moving-abroad" target="_blank" rel="noopener noreferrer" className="course-link">Expat Focus Guide</a>
            </div>
          </div>
        </div>

        <div className="learning-section">
          <h3>🎯 PRODUCTIVITY & TOOLS</h3>
          <div className="course-item">
            <div className="course-title">Remote Work Productivity Stack</div>
            <div className="course-provider">Productivity Professionals Network</div>
            <div className="course-benefits">
              🛠️ Tools: Slack, Zoom, Notion, Asana<br/>
              📈 Efficiency: +40% productivity increase<br/>
              💡 Skills: Time management, focus techniques
            </div>
            <div className="course-links">
              <a href="https://notion.so/product" target="_blank" rel="noopener noreferrer" className="course-link">Notion Workspace</a>
              <a href="https://asana.com/" target="_blank" rel="noopener noreferrer" className="course-link">Asana Project Management</a>
              <a href="https://zoom.us/" target="_blank" rel="noopener noreferrer" className="course-link">Zoom Video Meetings</a>
              <a href="https://slack.com/" target="_blank" rel="noopener noreferrer" className="course-link">Slack Communication</a>
              <a href="https://toggl.com/" target="_blank" rel="noopener noreferrer" className="course-link">Toggl Time Tracking</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const RelocationMatrix = () => (
    <div className="relocation-matrix">
      <div className="relocation-header">
        <span className="relocation-prompt">relocation@matrix:~$</span> analyze-route --arizona-to-peak-district
      </div>
      
      <div className="relocation-tools">
        <div className="relocation-section">
          <h3>🏡 PROPERTY SEARCH & ANALYSIS</h3>
          <div className="relocation-links">
            <a href="https://rightmove.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🏠 Rightmove UK Properties
            </a>
            <a href="https://zoopla.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🏘️ Zoopla Property Portal
            </a>
            <a href="https://onthemarket.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📍 OnTheMarket
            </a>
            <a href="https://primelocation.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              ⭐ Prime Location
            </a>
            <a href="https://spareroom.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🛏️ SpareRoom Rentals
            </a>
            <a href="https://openrent.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🔑 OpenRent
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>📊 COST OF LIVING COMPARISON</h3>
          <div className="relocation-links">
            <a href="https://numbeo.com/cost-of-living/compare_cities.jsp?country1=United+States&city1=Phoenix%2C+AZ&country2=United+Kingdom&city2=Sheffield" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📊 Numbeo Cost Compare
            </a>
            <a href="https://expatistan.com/cost-of-living/comparison/phoenix/sheffield" target="_blank" rel="noopener noreferrer" className="relocation-link">
              💰 Expatistan Compare
            </a>
            <a href="https://teleport.org/compare/phoenix-vs-sheffield/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🌍 Teleport Cities
            </a>
            <a href="https://livingcost.org/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              💡 Living Cost Calculator
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>🛂 VISA & IMMIGRATION</h3>
          <div className="relocation-links">
            <a href="https://gov.uk/government/organisations/uk-visas-and-immigration" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🇬🇧 UK Visas & Immigration
            </a>
            <a href="https://gov.uk/skilled-worker-visa" target="_blank" rel="noopener noreferrer" className="relocation-link">
              💼 Skilled Worker Visa
            </a>
            <a href="https://gov.uk/global-talent-visa" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🌟 Global Talent Visa
            </a>
            <a href="https://britishcouncil.org/exam/ielts" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📝 IELTS English Test
            </a>
            <a href="https://oisc.gov.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              ⚖️ Immigration Advisers
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>📦 INTERNATIONAL MOVING</h3>
          <div className="relocation-links">
            <a href="https://sevencorners.com/international-moving" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📦 Seven Corners Moving
            </a>
            <a href="https://alliedvanlines.com/moving-tips/international" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🚚 Allied International
            </a>
            <a href="https://sirelo.com/international-moving/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🌍 Sirelo Moving Guide
            </a>
            <a href="https://expatfocus.com/moving-abroad" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🎯 Expat Focus Guide
            </a>
            <a href="https://makemydrivefun.com" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🚗 Drive Route Optimizer
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>🏥 HEALTHCARE & SERVICES</h3>
          <div className="relocation-links">
            <a href="https://nhs.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🏥 NHS Healthcare
            </a>
            <a href="https://gov.uk/nhs-entitlements-costs" target="_blank" rel="noopener noreferrer" className="relocation-link">
              💷 NHS Costs & Entitlements
            </a>
            <a href="https://bupa.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🏥 Bupa Private Health
            </a>
            <a href="https://axa-health.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🩺 AXA Health Insurance
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>🚌 TRANSPORT & TRAVEL</h3>
          <div className="relocation-links">
            <a href="https://nationalrail.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🚂 National Rail
            </a>
            <a href="https://traveline.info/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🚌 Traveline Public Transport
            </a>
            <a href="https://aa.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🚗 AA Route Planner
            </a>
            <a href="https://google.com/maps" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🗺️ Google Maps
            </a>
            <a href="https://citymapper.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📱 Citymapper
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>🎓 EDUCATION & SCHOOLS</h3>
          <div className="relocation-links">
            <a href="https://gov.uk/school-admissions" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🏫 UK School Admissions
            </a>
            <a href="https://compare-school-performance.service.gov.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📊 School Performance Data
            </a>
            <a href="https://ucas.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🎓 UCAS Universities
            </a>
            <a href="https://sheffield.ac.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🏛️ University of Sheffield
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>🏦 BANKING & FINANCE</h3>
          <div className="relocation-links">
            <a href="https://lloydsbank.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🏦 Lloyds Bank
            </a>
            <a href="https://hsbc.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🌍 HSBC International
            </a>
            <a href="https://barclays.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              💳 Barclays Banking
            </a>
            <a href="https://monzo.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📱 Monzo Digital Bank
            </a>
            <a href="https://xe.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              💱 XE Currency Exchange
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>📱 UK LIFESTYLE & UTILITIES</h3>
          <div className="relocation-links">
            <a href="https://ofcom.org.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📡 Ofcom Communications
            </a>
            <a href="https://bt.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📞 BT Broadband & Phone
            </a>
            <a href="https://sky.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📺 Sky TV & Internet
            </a>
            <a href="https://uswitch.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              ⚡ uSwitch Utilities
            </a>
            <a href="https://comparethemarket.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🔍 Compare the Market
            </a>
          </div>
        </div>
      </div>

      <div className="relocation-summary">
        <h3>📈 ARIZONA → PEAK DISTRICT SUMMARY</h3>
        <div className="summary-stats">
          <div className="summary-item">
            <span className="summary-label">💰 Living Costs:</span>
            <span className="summary-value">-20% cheaper</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">🏠 Housing:</span>
            <span className="summary-value">+15% more expensive</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">🚌 Transport:</span>
            <span className="summary-value">+40% savings</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">🏥 Healthcare:</span>
            <span className="summary-value">FREE NHS</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">💸 Moving Cost:</span>
            <span className="summary-value">£8,000-£12,000</span>
          </div>
        </div>
      </div>
    </div>
  );

  const FinancialTracker = () => {
    const [newAmount, setNewAmount] = useState('');
    
    const updateSavings = async () => {
      if (!newAmount || isNaN(newAmount)) return;
      
      try {
        const response = await fetch(`${BACKEND_URL}/api/savings/update?amount=${parseFloat(newAmount)}`, {
          method: 'POST'
        });
        const result = await response.json();
        
        setNotifications(prev => [...prev, {
          id: 'savings_update',
          type: 'success',
          title: '💰 Financial Data Updated!',
          message: `${result.message || 'Savings updated successfully'} (+10 points)`,
          timestamp: new Date().toISOString()
        }]);
        
        setNewAmount('');
        
        // Refresh to show updated data
        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        console.error('Error updating savings:', error);
      }
    };

    const defaultSavings = savings || {
      current_amount: 1847.50,
      progress_percentage: 36.95,
      monthly_target: 500,
      months_to_goal: 7,
      streak_bonus: 347.50,
      daily_streak: 14
    };

    return (
      <div className="financial-tracker">
        <div className="financial-header">
          <span className="financial-prompt">financial@tracker:~$</span> analyze-savings --goal=5000 --relocation-fund
        </div>
        
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="Enter new savings amount"
              className="terminal-input flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-600"
            />
            <button onClick={updateSavings} className="cyber-button">
              💰 UPDATE SAVINGS
            </button>
          </div>
          <span className="text-gray-400 text-sm">Track your relocation fund progress & earn streak bonuses</span>
        </div>

        <div className="mt-4">
          <div className="savings-progress-container achievement-glow">
            <div className="flex justify-between text-white mb-2">
              <span>Progress to $5,000 Relocation Goal</span>
              <span>${defaultSavings.current_amount.toFixed(2)}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${defaultSavings.progress_percentage}%` }}
              ></div>
            </div>
            <div className="text-center mt-2 text-green-400 font-bold">
              {defaultSavings.progress_percentage.toFixed(1)}% Complete
            </div>
            {defaultSavings.streak_bonus > 0 && (
              <div className="text-center mt-1 text-orange-400 text-sm">
                🔥 Streak Bonus: +${defaultSavings.streak_bonus} ({defaultSavings.daily_streak} days)
              </div>
            )}
          </div>
          
          <div className="financial-tools mt-6">
            <h3 className="text-cyan-400 mb-4">💰 FINANCIAL PLANNING TOOLS</h3>
            <div className="tool-links grid grid-cols-2 gap-2">
              <a href="https://mint.com/" target="_blank" rel="noopener noreferrer" className="financial-link">
                💳 Mint Budget Tracking
              </a>
              <a href="https://ynab.com/" target="_blank" rel="noopener noreferrer" className="financial-link">
                📊 YNAB Budgeting
              </a>
              <a href="https://personalcapital.com/" target="_blank" rel="noopener noreferrer" className="financial-link">
                📈 Personal Capital
              </a>
              <a href="https://nerdwallet.com/" target="_blank" rel="noopener noreferrer" className="financial-link">
                🎯 NerdWallet Advice
              </a>
              <a href="https://bankrate.com/" target="_blank" rel="noopener noreferrer" className="financial-link">
                🏦 Bankrate Calculator
              </a>
              <a href="https://xe.com/" target="_blank" rel="noopener noreferrer" className="financial-link">
                💱 XE Currency Exchange
              </a>
            </div>
            
            <h3 className="text-cyan-400 mb-4 mt-6">🏠 RELOCATION FINANCIAL TOOLS</h3>
            <div className="tool-links grid grid-cols-2 gap-2">
              <a href="https://numbeo.com/cost-of-living/" target="_blank" rel="noopener noreferrer" className="financial-link">
                📊 Cost of Living Compare
              </a>
              <a href="https://taxcalculator.uk/" target="_blank" rel="noopener noreferrer" className="financial-link">
                🇬🇧 UK Tax Calculator
              </a>
              <a href="https://smartasset.com/taxes/income-taxes" target="_blank" rel="noopener noreferrer" className="financial-link">
                🇺🇸 US Tax Calculator
              </a>
              <a href="https://rightmove.co.uk/" target="_blank" rel="noopener noreferrer" className="financial-link">
                🏡 UK Property Prices
              </a>
              <a href="https://zoopla.co.uk/" target="_blank" rel="noopener noreferrer" className="financial-link">
                🏘️ UK Property Search
              </a>
              <a href="https://makemydrivefun.com" target="_blank" rel="noopener noreferrer" className="financial-link">
                🚗 Travel Cost Optimizer
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="stat-card">
              <div className="stat-value">${defaultSavings.monthly_target}</div>
              <div className="stat-label">Monthly Target</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{defaultSavings.months_to_goal}</div>
              <div className="stat-label">Months to Goal</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">${(5000 - defaultSavings.current_amount).toFixed(0)}</div>
              <div className="stat-label">Remaining</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NetworkGames = () => (
    <div className="network-games">
      <div className="games-header">
        <span className="games-prompt">games@network:~$</span> load-entertainment-protocols
      </div>
      
      <div className="games-grid">
        <div className="game-card" onClick={() => openWindow('pong_terminal', 'RETRO PONG', 'PongGame')}>
          <div className="game-icon">🏓</div>
          <div className="game-title">RETRO PONG</div>
          <div className="game-desc">Classic arcade action</div>
          <div className="high-score">High Score: {userStats.totalPoints}</div>
        </div>
        
        <div className="game-card" onClick={() => openWindow('snake_protocol', 'SNAKE PROTOCOL', 'SnakeGame')}>
          <div className="game-icon">🐍</div>
          <div className="game-title">SNAKE PROTOCOL</div>
          <div className="game-desc">Terminal snake game</div>
        </div>

        <div className="game-card" onClick={() => openWindow('matrix_rain', 'MATRIX RAIN', 'MatrixRain')}>
          <div className="game-icon">🌧️</div>
          <div className="game-title">MATRIX RAIN</div>
          <div className="game-desc">Digital meditation</div>
        </div>
      </div>
    </div>
  );

  const RelocationMatrix = () => (
    <div className="relocation-matrix">
      <div className="relocation-header">
        <span className="relocation-prompt">relocation@matrix:~$</span> analyze-route --arizona-to-peak-district
      </div>
      
      <div className="relocation-tools">
        <div className="relocation-section">
          <h3>🏡 PROPERTY SEARCH & ANALYSIS</h3>
          <div className="relocation-links">
            <a href="https://rightmove.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🏠 Rightmove UK Properties
            </a>
            <a href="https://zoopla.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🏘️ Zoopla Property Portal
            </a>
            <a href="https://onthemarket.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📍 OnTheMarket
            </a>
            <a href="https://primelocation.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              ⭐ Prime Location
            </a>
            <a href="https://spareroom.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🛏️ SpareRoom Rentals
            </a>
            <a href="https://openrent.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🔑 OpenRent
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>📊 COST OF LIVING COMPARISON</h3>
          <div className="relocation-links">
            <a href="https://numbeo.com/cost-of-living/compare_cities.jsp?country1=United+States&city1=Phoenix%2C+AZ&country2=United+Kingdom&city2=Sheffield" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📊 Numbeo Cost Compare
            </a>
            <a href="https://expatistan.com/cost-of-living/comparison/phoenix/sheffield" target="_blank" rel="noopener noreferrer" className="relocation-link">
              💰 Expatistan Compare
            </a>
            <a href="https://teleport.org/compare/phoenix-vs-sheffield/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🌍 Teleport Cities
            </a>
            <a href="https://livingcost.org/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              💡 Living Cost Calculator
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>🛂 VISA & IMMIGRATION</h3>
          <div className="relocation-links">
            <a href="https://gov.uk/government/organisations/uk-visas-and-immigration" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🇬🇧 UK Visas & Immigration
            </a>
            <a href="https://gov.uk/skilled-worker-visa" target="_blank" rel="noopener noreferrer" className="relocation-link">
              💼 Skilled Worker Visa
            </a>
            <a href="https://gov.uk/global-talent-visa" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🌟 Global Talent Visa
            </a>
            <a href="https://britishcouncil.org/exam/ielts" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📝 IELTS English Test
            </a>
            <a href="https://oisc.gov.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              ⚖️ Immigration Advisers
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>📦 INTERNATIONAL MOVING</h3>
          <div className="relocation-links">
            <a href="https://sevencorners.com/international-moving" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📦 Seven Corners Moving
            </a>
            <a href="https://alliedvanlines.com/moving-tips/international" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🚚 Allied International
            </a>
            <a href="https://sirelo.com/international-moving/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🌍 Sirelo Moving Guide
            </a>
            <a href="https://expatfocus.com/moving-abroad" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🎯 Expat Focus Guide
            </a>
            <a href="https://makemydrivefun.com" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🚗 Drive Route Optimizer
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>🏥 HEALTHCARE & SERVICES</h3>
          <div className="relocation-links">
            <a href="https://nhs.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🏥 NHS Healthcare
            </a>
            <a href="https://gov.uk/nhs-entitlements-costs" target="_blank" rel="noopener noreferrer" className="relocation-link">
              💷 NHS Costs & Entitlements
            </a>
            <a href="https://bupa.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🏥 Bupa Private Health
            </a>
            <a href="https://axa-health.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🩺 AXA Health Insurance
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>🚌 TRANSPORT & TRAVEL</h3>
          <div className="relocation-links">
            <a href="https://nationalrail.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🚂 National Rail
            </a>
            <a href="https://traveline.info/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🚌 Traveline Public Transport
            </a>
            <a href="https://aa.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🚗 AA Route Planner
            </a>
            <a href="https://google.com/maps" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🗺️ Google Maps
            </a>
            <a href="https://citymapper.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📱 Citymapper
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>🎓 EDUCATION & SCHOOLS</h3>
          <div className="relocation-links">
            <a href="https://gov.uk/school-admissions" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🏫 UK School Admissions
            </a>
            <a href="https://compare-school-performance.service.gov.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📊 School Performance Data
            </a>
            <a href="https://ucas.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🎓 UCAS Universities
            </a>
            <a href="https://sheffield.ac.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🏛️ University of Sheffield
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>🏦 BANKING & FINANCE</h3>
          <div className="relocation-links">
            <a href="https://lloydsbank.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🏦 Lloyds Bank
            </a>
            <a href="https://hsbc.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🌍 HSBC International
            </a>
            <a href="https://barclays.co.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              💳 Barclays Banking
            </a>
            <a href="https://monzo.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📱 Monzo Digital Bank
            </a>
            <a href="https://xe.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              💱 XE Currency Exchange
            </a>
          </div>
        </div>

        <div className="relocation-section">
          <h3>📱 UK LIFESTYLE & UTILITIES</h3>
          <div className="relocation-links">
            <a href="https://ofcom.org.uk/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📡 Ofcom Communications
            </a>
            <a href="https://bt.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📞 BT Broadband & Phone
            </a>
            <a href="https://sky.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              📺 Sky TV & Internet
            </a>
            <a href="https://uswitch.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              ⚡ uSwitch Utilities
            </a>
            <a href="https://comparethemarket.com/" target="_blank" rel="noopener noreferrer" className="relocation-link">
              🔍 Compare the Market
            </a>
          </div>
        </div>
      </div>

      <div className="relocation-summary">
        <h3>📈 ARIZONA → PEAK DISTRICT SUMMARY</h3>
        <div className="summary-stats">
          <div className="summary-item">
            <span className="summary-label">💰 Living Costs:</span>
            <span className="summary-value">-20% cheaper</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">🏠 Housing:</span>
            <span className="summary-value">+15% more expensive</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">🚌 Transport:</span>
            <span className="summary-value">+40% savings</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">🏥 Healthcare:</span>
            <span className="summary-value">FREE NHS</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">💸 Moving Cost:</span>
            <span className="summary-value">£8,000-£12,000</span>
          </div>
        </div>
      </div>
    </div>
  );

  const PongGame = () => {
    const [gameScore, setGameScore] = useState(0);
    const [gameActive, setGameActive] = useState(false);

    useEffect(() => {
      let gameLoop;
      if (gameActive) {
        gameLoop = setInterval(() => {
          setGameScore(prev => prev + 1);
        }, 100);
      }
      return () => clearInterval(gameLoop);
    }, [gameActive]);

    return (
      <div className="pong-game">
        <div className="game-controls">
          <button 
            className="cyber-button"
            onClick={() => setGameActive(!gameActive)}
          >
            {gameActive ? 'PAUSE' : 'START'} PROTOCOL
          </button>
          <div className="score-display">SCORE: {gameScore}</div>
        </div>
        <div className="pong-arena">
          <div className="pong-paddle left"></div>
          <div className="pong-ball"></div>
          <div className="pong-paddle right"></div>
        </div>
      </div>
    );
  };

  const renderWindowContent = (component) => {
    switch (component) {
      case 'NetworkScanner': return <NetworkScanner />;
      case 'JobHunter': return <JobHunter />;
      case 'RelocationMatrix': return <RelocationMatrix />;
      case 'FinancialTracker': return <FinancialTracker />;
      case 'TaskCommander': return <TaskCommander />;
      case 'LearningVault': return <LearningVault />;
      case 'NetworkGames': return <NetworkGames />;
      case 'PongGame': return <PongGame />;
      default: return <div className="loading-content">LOADING CLASSIFIED DATA...</div>;
    }
  };

  // Show matrix loading screen
  if (matrixLoading) {
    return <MatrixLoadingScreen />;
  }

  const currentThemeData = themes[currentTheme];

  return (
    <div 
      className={`network-portal ${currentTheme}-theme`}
      style={{
        background: currentThemeData.background,
        cursor: dotLock ? 'wait' : 'default'
      }}
    >
      {/* Dot matrix background */}
      <div className="dot-matrix">
        {Array.from({ length: 2000 }, (_, i) => (
          <div key={i} className="matrix-dot"></div>
        ))}
      </div>

      {/* Network background overlay */}
      <div 
        className="network-background"
        style={{
          backgroundImage: `
            linear-gradient(${currentThemeData.background.replace('linear-gradient', '').replace('(', '').replace(')', '')}, rgba(0,0,0,0.9)),
            url('${networkBackgrounds[backgroundIndex]}')
          `
        }}
      ></div>

      {/* Notifications */}
      <div className="notification-matrix">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`matrix-notification ${notification.type}`}
            style={{ borderColor: currentThemeData.primary }}
          >
            <div className="notification-title">{notification.title}</div>
            <div className="notification-message">{notification.message}</div>
            <div className="notification-time">{new Date(notification.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      {/* Top Control Panel */}
      <div className="control-panel" style={{ backgroundColor: currentThemeData.windowBg }}>
        <div className="panel-left">
          <div className="system-logo" style={{ color: currentThemeData.primary }}>
            ◉ THRIVEREMOTE NETWORK v4.0
          </div>
          <div className="network-status">
            <span className="status-indicator success">●</span> 
            NETWORK: {networkConnected ? 'CONNECTED' : 'OFFLINE'} | 
            SECURITY: {securityLevel} |
            STREAK: {userStats.streakDays} DAYS |
            POINTS: {userStats.totalPoints}
          </div>
        </div>
        
        <div className="panel-right">
          <div className="theme-selector">
            {Object.keys(themes).map(theme => (
              <button
                key={theme}
                className={`theme-btn ${currentTheme === theme ? 'active' : ''}`}
                onClick={() => changeTheme(theme)}
                style={{ 
                  borderColor: currentTheme === theme ? currentThemeData.primary : 'transparent',
                  color: currentTheme === theme ? currentThemeData.primary : '#666'
                }}
              >
                {themes[theme].name}
              </button>
            ))}
          </div>
          
          <div className="system-time" style={{ color: currentThemeData.primary }}>
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Application Grid */}
      <div className="application-grid">
        {portalApplications.map((app, index) => (
          <div
            key={app.id}
            className={`portal-app ${app.classified ? 'classified' : ''}`}
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
            <div className="app-icon" style={{ color: currentThemeData.primary }}>
              {app.icon}
            </div>
            <div className="app-name" style={{ color: currentThemeData.textColor }}>
              {app.name}
            </div>
            {app.classified && !terminalAccess && (
              <div className="classified-badge">🔒 CLASSIFIED</div>
            )}
          </div>
        ))}
      </div>

      {/* Active Windows */}
      {activeWindows.map(window => (
        <div
          key={window.id}
          className={`network-window ${window.minimized ? 'minimized' : ''} ${window.opening ? 'opening' : ''} ${window.closing ? 'closing' : ''}`}
          style={{
            left: window.position.x,
            top: window.position.y,
            zIndex: window.zIndex,
            width: window.size.width,
            height: window.size.height,
            backgroundColor: currentThemeData.windowBg,
            borderColor: window.classified ? '#ff0000' : currentThemeData.primary
          }}
        >
          <div 
            className="window-header"
            style={{ 
              backgroundColor: currentThemeData.windowBg,
              borderBottomColor: currentThemeData.primary 
            }}
          >
            <div className="window-title" style={{ color: currentThemeData.primary }}>
              {window.classified && '🔒 '}{window.title}
            </div>
            <div className="window-controls">
              <button
                className="window-control minimize"
                onClick={() => minimizeWindow(window.id)}
                style={{ color: currentThemeData.primary }}
              >
                −
              </button>
              <button
                className="window-control close"
                onClick={() => closeWindow(window.id)}
                style={{ color: '#ff0000' }}
              >
                ×
              </button>
            </div>
          </div>
          {!window.minimized && (
            <div className="window-content" style={{ color: currentThemeData.textColor }}>
              {renderWindowContent(window.component)}
            </div>
          )}
        </div>
      ))}

      {/* Bottom Status Bar */}
      <div className="status-bar" style={{ backgroundColor: currentThemeData.windowBg }}>
        <div className="status-left">
          <span style={{ color: currentThemeData.primary }}>◉</span> 
          NETWORK PORTAL ACTIVE | 
          PENETRATIONS: {userStats.networkPenetrations} | 
          DATA: {userStats.dataExtracted}
        </div>
        <div className="status-center">
          {activeWindows.map(window => (
            <div
              key={window.id}
              className={`status-window ${window.minimized ? 'minimized' : ''}`}
              onClick={() => minimizeWindow(window.id)}
              style={{ 
                backgroundColor: window.minimized ? 'transparent' : currentThemeData.primary,
                color: window.minimized ? currentThemeData.primary : '#000'
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