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
          </div>
          
          <div className="job-item">
            <div className="job-title">Digital Marketing Specialist</div>
            <div className="job-company">Peak District Digital</div>
            <div className="job-details">
              <span className="salary">£35,000 - £45,000/year</span>
              <span className="benefits">Work From Home, Training, Career Growth</span>
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
          </div>

          <div className="course-item">
            <div className="course-title">Full Stack Web Development</div>
            <div className="course-provider">Arizona State University Online</div>
            <div className="course-benefits">
              💼 Average Salary: $75,000 - $120,000<br/>
              🏥 Benefits: Premium health, stock options<br/>
              📈 Growth: High demand, constant learning
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
          </div>
        </div>
      </div>
    </div>
  );

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