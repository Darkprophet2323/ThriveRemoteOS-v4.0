import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const App = () => {
  // Application state (no authentication needed)
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

  // Default user for demo purposes
  const defaultUser = {
    user_id: 'demo_user',
    username: 'RemoteWorker',
    email: 'demo@thriveremote.com'
  };

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
  }, []);

  const triggerKonamiEasterEgg = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/terminal/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'konami' })
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

  // Fetch data on startup (no authentication needed)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes, savingsRes, tasksRes, statsRes, achievementsRes, notificationsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/jobs`),
          fetch(`${BACKEND_URL}/api/applications`),
          fetch(`${BACKEND_URL}/api/savings`),
          fetch(`${BACKEND_URL}/api/tasks`),
          fetch(`${BACKEND_URL}/api/dashboard/stats`),
          fetch(`${BACKEND_URL}/api/achievements`),
          fetch(`${BACKEND_URL}/api/realtime/notifications`)
        ]);

        if (jobsRes.ok) {
          const jobData = await jobsRes.json();
          setJobs(jobData.jobs || []);
        }
        if (appsRes.ok) {
          const appData = await appsRes.json();
          setApplications(appData.applications || []);
        }
        if (savingsRes.ok) setSavings(await savingsRes.json());
        if (tasksRes.ok) {
          const taskData = await tasksRes.json();
          setTasks(taskData.tasks || []);
        }
        if (statsRes.ok) setDashboardStats(await statsRes.json());
        if (achievementsRes.ok) {
          const achievementData = await achievementsRes.json();
          setAchievements(achievementData.achievements || []);
        }
        if (notificationsRes.ok) {
          const notificationData = await notificationsRes.json();
          setNotifications(prev => [...prev, ...(notificationData.notifications || [])]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Add welcome notification on startup
        setNotifications([{
          id: 'welcome',
          type: 'success',
          title: '🎉 Welcome to ThriveRemote OS v4.0!',
          message: 'Your productivity workspace is ready. Start exploring!',
          timestamp: new Date().toISOString()
        }]);
      }
    };

    fetchData();
    
    // Real-time updates every 30 seconds
    const dataInterval = setInterval(fetchData, 30000);
    
    return () => {
      clearInterval(dataInterval);
    };
  }, []);

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

  // Window Components
  const Dashboard = () => (
    <div className="terminal-content">
      <div className="terminal-header">
        <span className="text-cyan-400">thriveremote@system:~$</span> dashboard --stats --realtime --demo-mode
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="stat-card pulse-glow">
          <div className="stat-value">{applications.length}</div>
          <div className="stat-label">Applications</div>
        </div>
        <div className="stat-card pulse-glow">
          <div className="stat-value">{Math.floor(Math.random() * 5)}</div>
          <div className="stat-label">Interviews</div>
        </div>
        <div className="stat-card pulse-glow">
          <div className="stat-value">{savings ? (savings.progress_percentage || 25).toFixed(1) : '25.0'}%</div>
          <div className="stat-label">Savings Goal</div>
        </div>
        <div className="stat-card pulse-glow">
          <div className="stat-value">{tasks.filter(t => t.status === 'completed').length}</div>
          <div className="stat-label">Tasks Completed</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="stat-card achievement-glow">
          <div className="stat-value text-orange-400">7</div>
          <div className="stat-label">🔥 Daily Streak</div>
        </div>
        <div className="stat-card achievement-glow">
          <div className="stat-value text-purple-400">250</div>
          <div className="stat-label">📈 Productivity</div>
        </div>
        <div className="stat-card achievement-glow">
          <div className="stat-value text-yellow-400">{achievements.filter(a => a.unlocked).length}/9</div>
          <div className="stat-label">🏆 Achievements</div>
        </div>
        <div className="stat-card achievement-glow">
          <div className="stat-value text-green-400">150</div>
          <div className="stat-label">🎮 Pong Score</div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="terminal-line">
          <span className="text-green-400">●</span> System Status: OPTIMAL
        </div>
        <div className="terminal-line">
          <span className="text-blue-400">●</span> Remote Jobs Monitored: {jobs.length}
        </div>
        <div className="terminal-line">
          <span className="text-purple-400">●</span> Skill Development: 25h
        </div>
        <div className="terminal-line">
          <span className="text-orange-400">🔥</span> Streak Bonus: $175
        </div>
        <div className="terminal-line">
          <span className="text-cyan-400">👤</span> User: {defaultUser.username}
        </div>
      </div>
    </div>
  );

  const JobSearch = () => (
    <div className="terminal-content">
      <div className="terminal-header">
        <span className="text-cyan-400">thriveremote@system:~$</span> jobs --list --remote --live-data
      </div>
      
      <div className="mb-4">
        <button 
          className="apply-btn mr-2"
          onClick={async () => {
            try {
              const response = await fetch(`${BACKEND_URL}/api/jobs/refresh`, {
                method: 'POST'
              });
              const result = await response.json();
              
              setNotifications(prev => [...prev, {
                id: 'jobs_refresh',
                type: 'success',
                title: '🔄 Jobs Refreshed!',
                message: `${result.message || 'Jobs updated successfully'} (+5 points)`,
                timestamp: new Date().toISOString()
              }]);
              
              // Refresh page to show new jobs
              setTimeout(() => window.location.reload(), 2000);
            } catch (error) {
              console.error('Error refreshing jobs:', error);
            }
          }}
        >
          🔄 Refresh Live Jobs
        </button>
        <span className="text-gray-400 text-sm">Get latest remote opportunities</span>
      </div>
      
      <div className="space-y-3 mt-4 max-h-96 overflow-y-auto">
        {jobs.length > 0 ? jobs.slice(0, 10).map((job, index) => (
          <div key={job.id || index} className="job-card fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-white font-bold">{job.title}</h3>
                <p className="text-gray-300">{job.company} • {job.location}</p>
                <p className="text-green-400 font-semibold">{job.salary}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(job.skills || []).slice(0, 3).map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
                {job.source && (
                  <div className="text-xs text-blue-400 mt-1">Source: {job.source}</div>
                )}
              </div>
              <div className="text-right">
                <span className="status-badge not-applied">
                  Available
                </span>
                <button 
                  className="apply-btn mt-2"
                  onClick={() => {
                    setNotifications(prev => [...prev, {
                      id: `apply_${job.id || index}`,
                      type: 'success',
                      title: '🎯 Demo Application!',
                      message: `Application to ${job.company} recorded (+15 points)`,
                      timestamp: new Date().toISOString()
                    }]);
                  }}
                >
                  Apply Now ⚡
                </button>
                {job.url && (
                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block mt-1 text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    View Original →
                  </a>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-8">
            <div className="text-cyan-400">🔄 Loading remote job opportunities...</div>
            <div className="text-gray-400 text-sm mt-2">Click "Refresh Live Jobs" to load data</div>
          </div>
        )}
      </div>
    </div>
  );

  const SavingsTracker = () => {
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
          title: '💰 Savings Updated!',
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
      current_amount: 1250,
      progress_percentage: 25,
      monthly_target: 500,
      months_to_goal: 8,
      streak_bonus: 175,
      daily_streak: 7
    };

    return (
      <div className="terminal-content">
        <div className="terminal-header">
          <span className="text-cyan-400">thriveremote@system:~$</span> savings --progress --goal=5000 --demo-mode
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
            <button onClick={updateSavings} className="apply-btn">
              💰 Update Savings
            </button>
          </div>
          <span className="text-gray-400 text-sm">Track your savings progress & earn streak bonuses</span>
        </div>

        <div className="mt-4">
          <div className="savings-progress-container achievement-glow">
            <div className="flex justify-between text-white mb-2">
              <span>Progress to $5,000 Goal</span>
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

  const TaskManager = () => (
    <div className="terminal-content">
      <div className="terminal-header">
        <span className="text-cyan-400">thriveremote@system:~$</span> tasks --status --priority --demo-mode
      </div>
      
      <div className="flex gap-2 mb-4">
        <button className="apply-btn">
          📤 Upload Tasks
        </button>
        <button className="apply-btn">
          📥 Download Tasks
        </button>
        <button 
          className="apply-btn"
          onClick={() => {
            setNotifications(prev => [...prev, {
              id: 'task_created',
              type: 'success',
              title: '📋 Demo Task Created!',
              message: 'New task added to your list (+5 points)',
              timestamp: new Date().toISOString()
            }]);
          }}
        >
          ➕ Add Task
        </button>
      </div>

      <div className="space-y-3 mt-4 max-h-96 overflow-y-auto">
        {tasks.length > 0 ? tasks.map((task, index) => (
          <div key={task.id || index} className="task-card fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-white font-semibold">{task.title}</h4>
                <p className="text-gray-300 text-sm">{task.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                  <span className="category-badge">{task.category}</span>
                  {task.due_date && (
                    <span className="text-yellow-400 text-xs">Due: {task.due_date}</span>
                  )}
                </div>
              </div>
              <span className={`status-badge ${(task.status || 'todo').replace('_', '-')}`}>
                {(task.status || 'todo').replace('_', ' ')}
              </span>
            </div>
          </div>
        )) : (
          <div className="text-center py-8">
            <div className="text-cyan-400">📋 No tasks yet</div>
            <div className="text-gray-400 text-sm mt-2">Click "Add Task" to create your first task</div>
          </div>
        )}
      </div>
    </div>
  );

  const Terminal = () => {
    const [terminalInput, setTerminalInput] = useState('');
    const [terminalHistory, setTerminalHistory] = useState([
      { text: 'ThriveRemote Terminal v4.0 - Instant Access Productivity Center 🚀', type: 'title' },
      { text: 'No login required! Start being productive immediately!', type: 'subtitle' },
      { text: 'Type "help" for available commands', type: 'info' },
      { text: '', type: 'blank' }
    ]);

    const handleTerminalCommand = async (e) => {
      if (e.key === 'Enter' && terminalInput.trim()) {
        const command = terminalInput.trim();
        const newHistory = [...terminalHistory, { text: `thriveremote@system:~$ ${command}`, type: 'command' }];
        
        try {
          const response = await fetch(`${BACKEND_URL}/api/terminal/command`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command })
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.output && Array.isArray(result.output)) {
              result.output.forEach(line => {
                // Determine line type based on content for coloring
                let lineType = 'output';
                if (line.includes('✅') || line.includes('SUCCESS') || line.includes('Found')) lineType = 'success';
                else if (line.includes('❌') || line.includes('ERROR') || line.includes('Failed')) lineType = 'error';
                else if (line.includes('💰') || line.includes('🔥') || line.includes('📈')) lineType = 'highlight';
                else if (line.includes('🎯') || line.includes('PRODUCTIVITY') || line.includes('STATS')) lineType = 'stats';
                else if (line.includes('🏡') || line.includes('RELOCATION') || line.includes('PROPERTIES')) lineType = 'relocation';
                else if (line.includes('🎮') || line.includes('EASTER') || line.includes('KONAMI')) lineType = 'gaming';
                else if (line.startsWith('  ') && line.includes('-')) lineType = 'list';
                else if (line.includes('💡') || line.includes('TIP')) lineType = 'tip';
                
                newHistory.push({ text: line, type: lineType });
              });
            } else {
              newHistory.push({ text: 'Command executed successfully', type: 'success' });
            }
          } else {
            newHistory.push({ text: `Server error: ${response.status}`, type: 'error' });
          }
        } catch (error) {
          newHistory.push({ text: `Network error: Unable to connect to server`, type: 'error' });
          console.error('Terminal command error:', error);
        }
        
        setTerminalHistory(newHistory);
        setTerminalInput('');
      }
    };

    const getLineClassName = (type) => {
      switch (type) {
        case 'title': return 'terminal-line terminal-title';
        case 'subtitle': return 'terminal-line terminal-subtitle';
        case 'command': return 'terminal-line terminal-command';
        case 'success': return 'terminal-line terminal-success';
        case 'error': return 'terminal-line terminal-error';
        case 'highlight': return 'terminal-line terminal-highlight';
        case 'stats': return 'terminal-line terminal-stats';
        case 'relocation': return 'terminal-line terminal-relocation';
        case 'gaming': return 'terminal-line terminal-gaming';
        case 'list': return 'terminal-line terminal-list';
        case 'tip': return 'terminal-line terminal-tip';
        case 'info': return 'terminal-line terminal-info';
        case 'blank': return 'terminal-line';
        default: return 'terminal-line terminal-output';
      }
    };

    return (
      <div 
        className="terminal-content garuda-terminal"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${Math.max(0.7, transparency / 100)})`,
          backdropFilter: `blur(${Math.max(8, (100 - transparency) / 8)}px)`
        }}
      >
        <div className="terminal-header-enhanced">
          <span className="terminal-prompt">thriveremote@system:~$</span> terminal --instant-access --no-auth-required
        </div>
        <div className="terminal-output space-y-1 mb-4 max-h-64 overflow-y-auto">
          {terminalHistory.map((line, index) => (
            <div key={index} className={getLineClassName(line.type)}>
              {line.text}
            </div>
          ))}
        </div>
        <div className="terminal-input-line">
          <span className="terminal-prompt">thriveremote@system:~$</span>
          <input
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            onKeyDown={handleTerminalCommand}
            className="terminal-input ml-2 flex-1"
            placeholder="Enter command... (try 'help', 'stats', or 'motivate')"
            autoFocus
          />
        </div>
      </div>
    );
  };

  const Achievements = () => (
    <div className="terminal-content">
      <div className="terminal-header">
        <span className="text-cyan-400">thriveremote@system:~$</span> achievements --list --progress --instant-access
      </div>
      <div className="space-y-3 mt-4 max-h-96 overflow-y-auto">
        {achievements.length > 0 ? achievements.map((achievement, index) => (
          <div 
            key={achievement.id || index} 
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} fade-in-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="text-white font-bold">{achievement.title}</h4>
                <p className="text-gray-300 text-sm">{achievement.description}</p>
                {achievement.unlocked && achievement.unlock_date && (
                  <p className="text-green-400 text-xs">
                    Unlocked: {new Date(achievement.unlock_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className={`achievement-status ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                {achievement.unlocked ? '✓' : '🔒'}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-8">
            <div className="text-cyan-400">🏆 No achievements data loaded</div>
            <div className="text-gray-400 text-sm mt-2">Use the platform to unlock achievements!</div>
          </div>
        )}
      </div>
    </div>
  );

  const renderWindowContent = (component) => {
    switch (component) {
      case 'Dashboard': return <Dashboard />;
      case 'JobSearch': return <JobSearch />;
      case 'SavingsTracker': return <SavingsTracker />;
      case 'TaskManager': return <TaskManager />;
      case 'Calendar': return <div className="terminal-content"><div className="text-cyan-400">Smart Calendar - Schedule Optimization (Demo Mode)</div></div>;
      case 'Notes': return <div className="terminal-content"><div className="text-cyan-400">Intelligent Notes - AI-Enhanced Note Taking (Demo Mode)</div></div>;
      case 'Network': return <div className="terminal-content"><div className="text-cyan-400">Professional Network - Connect & Grow (Demo Mode)</div></div>;
      case 'LearningHub': return <div className="terminal-content"><div className="text-cyan-400">Learning Hub - Skill Development & Courses (Demo Mode)</div></div>;
      case 'Terminal': return <Terminal />;
      case 'Settings': return <div className="terminal-content"><div className="text-cyan-400">System Settings - Customize Your Experience (Demo Mode)</div></div>;
      case 'Achievements': return <Achievements />;
      case 'Analytics': return <div className="terminal-content"><div className="text-cyan-400">Analytics Dashboard - Productivity Insights (Demo Mode)</div></div>;
      default: return <div className="terminal-content"><div className="text-cyan-400">Application Loading...</div></div>;
    }
  };

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
            👤 {defaultUser.username} | 🔥 7 day streak | 📈 250 points | ⚡ Instant Access
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
            <div className="app-description">Instant Access</div>
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
            <span className="text-cyan-400">⚡</span> ThriveRemote v4.0 - Instant Access
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