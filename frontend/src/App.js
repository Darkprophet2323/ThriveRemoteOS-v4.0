import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const App = () => {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionToken, setSessionToken] = useState(localStorage.getItem('session_token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', email: '' });

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
  const [konamiSequence, setKonamiSequence] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [relocateData, setRelocateData] = useState(null);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [transparency, setTransparency] = useState(85);
  const [focusMode, setFocusMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Professional remote work background images
  const backgroundImages = [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c', // Modern tech office
    'https://images.unsplash.com/photo-1497366216548-37526070297c', // Remote workspace
    'https://images.unsplash.com/photo-1531482615713-2afd69097998', // Modern city skyline
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa', // Tech/Digital theme
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176'  // Minimalist workspace
  ];

  // Konami code sequence
  const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

  // Authentication functions with enhanced security
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.username.trim() || !loginData.password.trim()) {
      setNotifications(prev => [...prev, {
        id: 'validation_error',
        type: 'error',
        title: '❌ Validation Error',
        message: 'Username and password are required',
        timestamp: new Date().toISOString()
      }]);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const result = await response.json();
        setSessionToken(result.session_token);
        localStorage.setItem('session_token', result.session_token);
        setCurrentUser({ user_id: result.user_id, username: result.username });
        setIsLoggedIn(true);
        
        setNotifications(prev => [...prev, {
          id: 'login_success',
          type: 'success',
          title: '🎉 Welcome Back!',
          message: `Welcome back, ${result.username}!`,
          timestamp: new Date().toISOString()
        }]);
      } else {
        const error = await response.json();
        setNotifications(prev => [...prev, {
          id: 'login_error',
          type: 'error',
          title: '❌ Login Failed',
          message: error.detail || 'Invalid credentials',
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Login error:', error);
      setNotifications(prev => [...prev, {
        id: 'network_error',
        type: 'error',
        title: '🌐 Connection Error',
        message: 'Unable to connect to server',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerData.username.trim() || !registerData.password.trim()) {
      setNotifications(prev => [...prev, {
        id: 'validation_error',
        type: 'error',
        title: '❌ Validation Error',
        message: 'Username and password are required',
        timestamp: new Date().toISOString()
      }]);
      return;
    }

    if (registerData.password.length < 6) {
      setNotifications(prev => [...prev, {
        id: 'password_error',
        type: 'error',
        title: '🔒 Password Too Short',
        message: 'Password must be at least 6 characters long',
        timestamp: new Date().toISOString()
      }]);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });

      if (response.ok) {
        const result = await response.json();
        setSessionToken(result.session_token);
        localStorage.setItem('session_token', result.session_token);
        setCurrentUser({ user_id: result.user_id, username: result.username });
        setIsLoggedIn(true);
        
        setNotifications(prev => [...prev, {
          id: 'register_success',
          type: 'success',
          title: '🎉 Account Created!',
          message: `Welcome to ThriveRemote, ${result.username}!`,
          timestamp: new Date().toISOString()
        }]);
      } else {
        const error = await response.json();
        setNotifications(prev => [...prev, {
          id: 'register_error',
          type: 'error',
          title: '❌ Registration Failed',
          message: error.detail || 'Registration failed',
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setNotifications(prev => [...prev, {
        id: 'network_error',
        type: 'error',
        title: '🌐 Connection Error',
        message: 'Unable to connect to server',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: sessionToken })
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('session_token');
    setSessionToken(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveWindows([]);
    
    setNotifications(prev => [...prev, {
      id: 'logout_success',
      type: 'info',
      title: '👋 Logged Out',
      message: 'Your session has been securely ended',
      timestamp: new Date().toISOString()
    }]);
  };

  // Check session on load
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('session_token');
      if (token) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/user/current?session_token=${token}`);
          if (response.ok) {
            const user = await response.json();
            setCurrentUser(user);
            setSessionToken(token);
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem('session_token');
          }
        } catch (error) {
          localStorage.removeItem('session_token');
        }
      }
    };

    checkSession();
  }, []);

  // Focus Mode Toggle
  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
    if (!focusMode) {
      // Enable focus mode
      setActiveWindows(windows => windows.map(w => ({...w, minimized: true})));
      setNotifications(prev => [...prev, {
        id: 'focus_mode',
        type: 'info',
        title: '🎯 Focus Mode Enabled',
        message: 'Distractions minimized. Stay productive!',
        timestamp: new Date().toISOString()
      }]);
    } else {
      setNotifications(prev => [...prev, {
        id: 'focus_mode_off',
        type: 'info',
        title: '🎯 Focus Mode Disabled',
        message: 'Welcome back to full productivity mode!',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  // Handle Konami code
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKonamiSequence(prev => {
        const newSequence = [...prev, e.code].slice(-10);
        if (JSON.stringify(newSequence) === JSON.stringify(KONAMI_CODE)) {
          triggerKonamiEasterEgg();
          return [];
        }
        return newSequence;
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sessionToken]);

  const triggerKonamiEasterEgg = async () => {
    if (!sessionToken) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/terminal/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'konami', session_token: sessionToken })
      });
      const result = await response.json();
      
      setNotifications(prev => [...prev, {
        id: 'konami',
        type: 'achievement',
        title: '🎮 Konami Code Activated!',
        message: 'Ultimate productivity boost! +100 points',
        timestamp: new Date().toISOString()
      }]);
      
      // Enhanced visual effect
      document.body.style.animation = 'rainbow 3s ease-in-out';
      setTimeout(() => {
        document.body.style.animation = '';
      }, 3000);
      
      console.log('Konami code activated!', result);
    } catch (error) {
      console.error('Konami easter egg failed:', error);
    }
  };

  // Enhanced window management
  const openWindow = (windowId, title, component) => {
    if (!activeWindows.find(w => w.id === windowId)) {
      const newWindow = {
        id: windowId,
        title,
        component,
        minimized: false,
        position: { 
          x: Math.max(50, 50 + (activeWindows.length * 40)), 
          y: Math.max(50, 50 + (activeWindows.length * 40)) 
        },
        zIndex: 1000 + activeWindows.length,
        size: { width: 900, height: 650 },
        opening: true
      };
      
      setActiveWindows(prev => [...prev, newWindow]);
      
      setTimeout(() => {
        setActiveWindows(windows => windows.map(w => 
          w.id === windowId ? { ...w, opening: false } : w
        ));
      }, 300);
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

  // Background switcher
  const switchBackground = () => {
    setBackgroundIndex((prev) => (prev + 1) % backgroundImages.length);
    
    setNotifications(prev => [...prev, {
      id: 'background_switch',
      type: 'info',
      title: '🖼️ Background Updated',
      message: 'Switched to new professional theme',
      timestamp: new Date().toISOString()
    }]);
  };

  // Drag functionality
  const handleMouseDown = (e, windowId) => {
    if (e.target.classList.contains('window-header') || e.target.classList.contains('window-title')) {
      const window = activeWindows.find(w => w.id === windowId);
      if (window) {
        setDragging({
          windowId,
          startX: e.clientX - window.position.x,
          startY: e.clientY - window.position.y
        });
        bringToFront(windowId);
        e.preventDefault();
      }
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (dragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragging.startX));
      const newY = Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragging.startY));
      
      setActiveWindows(windows => windows.map(w => 
        w.id === dragging.windowId 
          ? { ...w, position: { x: newX, y: newY } }
          : w
      ));
    }
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  // Fetch data and setup real-time updates
  useEffect(() => {
    if (!isLoggedIn || !sessionToken) return;

    const fetchData = async () => {
      try {
        const [jobsRes, appsRes, savingsRes, tasksRes, statsRes, achievementsRes, notificationsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/jobs?session_token=${sessionToken}`),
          fetch(`${BACKEND_URL}/api/applications?session_token=${sessionToken}`),
          fetch(`${BACKEND_URL}/api/savings?session_token=${sessionToken}`),
          fetch(`${BACKEND_URL}/api/tasks?session_token=${sessionToken}`),
          fetch(`${BACKEND_URL}/api/dashboard/stats?session_token=${sessionToken}`),
          fetch(`${BACKEND_URL}/api/achievements?session_token=${sessionToken}`),
          fetch(`${BACKEND_URL}/api/realtime/notifications?session_token=${sessionToken}`)
        ]);

        if (jobsRes.ok) setJobs((await jobsRes.json()).jobs);
        if (appsRes.ok) setApplications((await appsRes.json()).applications);
        if (savingsRes.ok) setSavings(await savingsRes.json());
        if (tasksRes.ok) setTasks((await tasksRes.json()).tasks);
        if (statsRes.ok) setDashboardStats(await statsRes.json());
        if (achievementsRes.ok) setAchievements((await achievementsRes.json()).achievements);
        if (notificationsRes.ok) {
          const notificationData = await notificationsRes.json();
          setNotifications(prev => [...prev, ...notificationData.notifications]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    
    // Real-time updates every 30 seconds
    const dataInterval = setInterval(fetchData, 30000);
    
    return () => {
      clearInterval(dataInterval);
    };
  }, [isLoggedIn, sessionToken]);

  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Enhanced Desktop Applications
  const applications_list = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', component: 'Dashboard' },
    { id: 'jobs', name: 'Job Search', icon: '💼', component: 'JobSearch' },
    { id: 'savings', name: 'Financial Goals', icon: '💰', component: 'SavingsTracker' },
    { id: 'tasks', name: 'Task Manager', icon: '✅', component: 'TaskManager' },
    { id: 'calendar', name: 'Calendar', icon: '📅', component: 'Calendar' },
    { id: 'notes', name: 'Notes', icon: '📝', component: 'Notes' },
    { id: 'network', name: 'Network', icon: '🌐', component: 'Network' },
    { id: 'learning', name: 'Learning Hub', icon: '🎓', component: 'LearningHub' },
    { id: 'terminal', name: 'Terminal', icon: '⚡', component: 'Terminal' },
    { id: 'settings', name: 'Settings', icon: '⚙️', component: 'Settings' },
    { id: 'achievements', name: 'Achievements', icon: '🏆', component: 'Achievements' },
    { id: 'analytics', name: 'Analytics', icon: '📈', component: 'Analytics' }
  ];

  // Notification system
  const dismissNotification = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  // Auto-dismiss notifications after 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(prev => prev.filter(n => {
        const age = new Date() - new Date(n.timestamp);
        return age < 7000; // 7 seconds
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Enhanced Login/Register Form Component
  const LoginForm = () => (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h1 className="login-title">ThriveRemote OS v4.0</h1>
          <p className="login-subtitle">The Ultimate Remote Work Operating System</p>
          <p className="login-description">Boost productivity, track goals, and thrive in remote work</p>
        </div>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${showLogin ? 'active' : ''}`}
            onClick={() => setShowLogin(true)}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab ${!showLogin ? 'active' : ''}`}
            onClick={() => setShowLogin(false)}
          >
            Create Account
          </button>
        </div>

        {showLogin ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="auth-button">
              🚀 Access ThriveRemote
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={registerData.username}
                onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                placeholder="Choose a unique username"
                required
                minLength="3"
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label>Email (Optional)</label>
              <input
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                placeholder="Create a strong password (min 6 chars)"
                required
                minLength="6"
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="auth-button">
              ✨ Start Your Journey
            </button>
          </form>
        )}

        <div className="login-footer">
          <p>🎯 Professional remote work platform with advanced productivity tools</p>
          <p>🏆 Track achievements, manage finances, and grow your career</p>
        </div>
      </div>
    </div>
  );

  // Window Components would go here...
  // [Due to length limits, I'll continue with the component definitions in the next part]

  const renderWindowContent = (component) => {
    // This function will render different components based on the component name
    switch (component) {
      case 'Dashboard': return <div className="terminal-content"><div className="text-cyan-400">Dashboard Coming Soon - Advanced Analytics & Real-time Metrics</div></div>;
      case 'JobSearch': return <div className="terminal-content"><div className="text-cyan-400">Job Search - Live Remote Opportunities</div></div>;
      case 'SavingsTracker': return <div className="terminal-content"><div className="text-cyan-400">Financial Goals - Smart Savings Tracking</div></div>;
      case 'TaskManager': return <div className="terminal-content"><div className="text-cyan-400">Task Manager - AI-Powered Productivity</div></div>;
      case 'Calendar': return <div className="terminal-content"><div className="text-cyan-400">Smart Calendar - Schedule Optimization</div></div>;
      case 'Notes': return <div className="terminal-content"><div className="text-cyan-400">Intelligent Notes - AI-Enhanced Note Taking</div></div>;
      case 'Network': return <div className="terminal-content"><div className="text-cyan-400">Professional Network - Connect & Grow</div></div>;
      case 'LearningHub': return <div className="terminal-content"><div className="text-cyan-400">Learning Hub - Skill Development & Courses</div></div>;
      case 'Terminal': return <div className="terminal-content"><div className="text-cyan-400">Advanced Terminal - Power User Commands</div></div>;
      case 'Settings': return <div className="terminal-content"><div className="text-cyan-400">System Settings - Customize Your Experience</div></div>;
      case 'Achievements': return <div className="terminal-content"><div className="text-cyan-400">Achievement System - Track Your Progress</div></div>;
      case 'Analytics': return <div className="terminal-content"><div className="text-cyan-400">Analytics Dashboard - Productivity Insights</div></div>;
      default: return <div className="terminal-content"><div className="text-cyan-400">Application Loading...</div></div>;
    }
  };

  // Show login form if not logged in
  if (!isLoggedIn) {
    return <LoginForm />;
  }

  return (
    <div className={`os-desktop ${darkMode ? 'dark' : 'light'} ${focusMode ? 'focus-mode' : ''}`}>
      {/* Dynamic Desktop Background */}
      <div 
        className="desktop-bg"
        style={{
          backgroundImage: `
            linear-gradient(rgba(15, 23, 42, ${focusMode ? 0.9 : 0.8}), rgba(30, 41, 59, ${focusMode ? 0.9 : 0.8})),
            url('${backgroundImages[backgroundIndex]}'),
            radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, #06b6d4 0%, transparent 50%)
          `
        }}
      ></div>
      
      {/* Enhanced Notification System */}
      <div className="notification-container">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification ${notification.type} slide-in enhanced`}
            onClick={() => dismissNotification(notification.id)}
          >
            <div className="notification-title">{notification.title}</div>
            <div className="notification-message">{notification.message}</div>
            <div className="notification-time">{new Date(notification.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
      
      {/* Enhanced Top Panel */}
      <div className="top-panel enhanced">
        <div className="flex items-center">
          <div className="os-logo">ThriveRemote OS v4.0</div>
          <div className="ml-4 text-xs text-green-400">
            👤 {currentUser?.username} | 🔥 {dashboardStats?.daily_streak || 0} day streak | 📈 {dashboardStats?.productivity_score || 0} points
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <button 
              onClick={toggleFocusMode}
              className={`focus-btn ${focusMode ? 'active' : ''}`}
              title="Toggle Focus Mode"
            >
              🎯 {focusMode ? 'Exit' : 'Focus'}
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-300">Opacity:</span>
              <input
                type="range"
                min="30"
                max="100"
                value={transparency}
                onChange={(e) => setTransparency(e.target.value)}
                className="transparency-slider"
                title="Adjust window transparency"
              />
              <span className="text-xs text-cyan-400">{transparency}%</span>
            </div>
            <button 
              onClick={switchBackground}
              className="control-btn"
              title="Switch Background Theme"
            >
              🖼️ Theme
            </button>
            <button 
              onClick={handleLogout}
              className="control-btn logout"
            >
              Logout
            </button>
            <div className="system-stats">
              CPU: {Math.floor(Math.random() * 30 + 10)}% | RAM: {(Math.random() * 4 + 4).toFixed(1)}GB
            </div>
            <div className="system-time">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Desktop Applications Grid */}
      <div className={`desktop-apps ${focusMode ? 'focus-mode' : ''}`}>
        {applications_list.map((app, index) => (
          <div
            key={app.id}
            className="desktop-app enhanced fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => openWindow(app.id, app.name, app.component)}
          >
            <div className="app-icon">{app.icon}</div>
            <div className="app-name">{app.name}</div>
            <div className="app-description">Professional Tools</div>
          </div>
        ))}
      </div>

      {/* Enhanced Active Windows */}
      {activeWindows.map(window => (
        <div
          key={window.id}
          className={`window enhanced ${window.minimized ? 'minimized' : ''} ${window.opening ? 'opening' : ''} ${window.closing ? 'closing' : ''}`}
          style={{
            left: window.position.x,
            top: window.position.y,
            zIndex: window.zIndex,
            width: window.size.width,
            height: window.size.height,
            backgroundColor: `rgba(17, 24, 39, ${transparency / 100})`,
            backdropFilter: `blur(${Math.max(8, (100 - transparency) / 8)}px)`
          }}
          onMouseDown={(e) => handleMouseDown(e, window.id)}
        >
          <div 
            className="window-header enhanced"
            style={{
              backgroundColor: `rgba(31, 41, 55, ${Math.min(0.95, transparency / 100 + 0.15)})`
            }}
          >
            <div className="window-title">{window.title}</div>
            <div className="window-controls">
              <button
                className="window-control minimize"
                onClick={() => minimizeWindow(window.id)}
                title="Minimize"
              >
                −
              </button>
              <button
                className="window-control close"
                onClick={() => closeWindow(window.id)}
                title="Close"
              >
                ×
              </button>
            </div>
          </div>
          {!window.minimized && (
            <div className="window-content">
              {renderWindowContent(window.component)}
            </div>
          )}
        </div>
      ))}

      {/* Enhanced Taskbar */}
      <div className="taskbar enhanced">
        <div className="taskbar-left">
          <div className="start-menu">
            <span className="text-cyan-400">⚡</span> ThriveRemote v4.0
          </div>
        </div>
        <div className="taskbar-center">
          {activeWindows.map(window => (
            <div
              key={window.id}
              className={`taskbar-item ${window.minimized ? 'minimized' : ''}`}
              onClick={() => minimizeWindow(window.id)}
            >
              {window.title}
            </div>
          ))}
        </div>
        <div className="taskbar-right">
          <div className="system-tray">
            <span className="text-green-400">●</span> Online
            <span className="ml-2">{currentTime.toLocaleDateString()}</span>
            <span className="ml-2">{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;