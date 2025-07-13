// Professional YouTube Player for BeamNG.drive
// Real vehicle system integration with advanced features

class ProfessionalYouTubePlayer {
  constructor() {
    this.version = "2.0.0";
    this.initialized = false;
    this.beamngConnected = false;
    
    // System state
    this.systemState = {
      vehicle: null,
      audio: null,
      network: null,
      ecu: null,
      safety: null
    };
    
    // Player state
    this.playerState = {
      currentVideo: null,
      isPlaying: false,
      volume: 0.5,
      muted: false,
      progress: 0,
      duration: 0,
      quality: 'auto',
      playlist: [],
      currentIndex: 0,
      repeat: false,
      shuffle: false
    };
    
    // Vehicle data
    this.vehicleData = {
      speed: 0,
      rpm: 0,
      gear: 'N',
      fuel: 0,
      battery: 12.0,
      engineRunning: false,
      electricalActive: false,
      model: 'Unknown Vehicle',
      type: 'car'
    };
    
    // Audio settings
    this.audioSettings = {
      masterVolume: 0.5,
      bass: 0,
      treble: 0,
      balance: 0,
      fade: 0,
      equalizerEnabled: false,
      rpmVolumeAdjust: true,
      speedRestriction: true
    };
    
    // YouTube API
    this.ytPlayer = null;
    this.ytPlayerReady = false;
    
    // Event handlers
    this.eventHandlers = new Map();
    
    // Initialize
    this.init();
  }
  
  // Initialize the player system
  async init() {
    console.log('🚀 Professional YouTube Player v' + this.version + ' initializing...');
    
    try {
      // Initialize core systems
      await this.initializeCore();
      
      // Setup BeamNG integration
      await this.setupBeamNGIntegration();
      
      // Initialize YouTube API
      await this.initializeYouTubeAPI();
      
      // Setup UI event handlers
      this.setupUIEventHandlers();
      
      // Setup vehicle system integration
      this.setupVehicleIntegration();
      
      // Setup safety systems
      this.setupSafetySystem();
      
      // Load user preferences
      this.loadUserPreferences();
      
      // Start periodic updates
      this.startPeriodicUpdates();
      
      this.initialized = true;
      console.log('✅ Professional YouTube Player initialized successfully');
      
      // Update UI
      this.updateSystemStatus();
      
    } catch (error) {
      console.error('❌ Failed to initialize YouTube Player:', error);
      this.showError('System initialization failed: ' + error.message);
    }
  }
  
  // Initialize core systems
  async initializeCore() {
    // Check if we're running in BeamNG.drive
    this.beamngConnected = typeof bngApi !== 'undefined' || typeof lua !== 'undefined';
    
    if (this.beamngConnected) {
      console.log('🔧 BeamNG.drive environment detected');
      
      // Initialize BeamNG Lua communication
      if (typeof lua !== 'undefined') {
        // Setup Lua communication
        this.setupLuaCommunication();
      }
    } else {
      console.log('🌐 Running in browser environment');
    }
    
    // Initialize audio system
    this.initializeAudioSystem();
    
    // Initialize network monitoring
    this.initializeNetworkMonitoring();
  }
  
  // Setup BeamNG integration
  async setupBeamNGIntegration() {
    if (!this.beamngConnected) {
      console.log('⚠️ BeamNG.drive not detected, running in standalone mode');
      return;
    }
    
    // Setup message handlers for BeamNG communication
    this.setupBeamNGMessageHandlers();
    
    // Request initial vehicle data
    this.requestVehicleData();
    
    // Setup periodic vehicle data updates
    this.setupVehicleDataUpdates();
    
    console.log('🚗 BeamNG.drive integration active');
  }
  
  // Setup Lua communication
  setupLuaCommunication() {
    // Register message handlers
    if (typeof bngApi !== 'undefined') {
      bngApi.activeObjectLua('extensions.tech_youtubePlayerVehicle.getVehicleState()', (result) => {
        if (result) {
          this.handleVehicleStateUpdate(result);
        }
      });
    }
    
    // Setup periodic communication
    setInterval(() => {
      this.sendHeartbeatToBeamNG();
    }, 1000);
  }
  
  // Setup BeamNG message handlers
  setupBeamNGMessageHandlers() {
    // Vehicle state updates
    this.eventHandlers.set('vehicleStateUpdate', (data) => {
      this.handleVehicleStateUpdate(data);
    });
    
    // System status updates
    this.eventHandlers.set('systemStatusUpdate', (data) => {
      this.handleSystemStatusUpdate(data);
    });
    
    // Safety alerts
    this.eventHandlers.set('safetyAlert', (data) => {
      this.handleSafetyAlert(data);
    });
    
    // Audio system updates
    this.eventHandlers.set('audioSystemUpdate', (data) => {
      this.handleAudioSystemUpdate(data);
    });
  }
  
  // Initialize YouTube API
  async initializeYouTubeAPI() {
    return new Promise((resolve, reject) => {
      // Load YouTube IFrame API
      if (typeof YT === 'undefined') {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.onload = () => {
          console.log('📺 YouTube IFrame API loaded');
        };
        tag.onerror = (error) => {
          console.error('❌ Failed to load YouTube API:', error);
          reject(new Error('YouTube API failed to load'));
        };
        
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        // Setup global callback
        window.onYouTubeIframeAPIReady = () => {
          this.initializeYouTubePlayer();
          resolve();
        };
      } else {
        this.initializeYouTubePlayer();
        resolve();
      }
    });
  }
  
  // Initialize YouTube player
  initializeYouTubePlayer() {
    this.ytPlayer = new YT.Player('ytplayer', {
      width: '100%',
      height: '100%',
      videoId: '',
      playerVars: {
        'autoplay': 0,
        'controls': 1,
        'disablekb': 1,
        'enablejsapi': 1,
        'fs': 1,
        'modestbranding': 1,
        'playsinline': 1,
        'rel': 0
      },
      events: {
        'onReady': (event) => this.onYouTubePlayerReady(event),
        'onStateChange': (event) => this.onYouTubePlayerStateChange(event),
        'onError': (event) => this.onYouTubePlayerError(event)
      }
    });
  }
  
  // YouTube player ready handler
  onYouTubePlayerReady(event) {
    console.log('✅ YouTube player ready');
    this.ytPlayerReady = true;
    
    // Set initial volume
    this.ytPlayer.setVolume(this.playerState.volume * 100);
    
    // Hide video overlay
    this.hideVideoOverlay();
    
    // Update UI
    this.updatePlayerControls();
  }
  
  // YouTube player state change handler
  onYouTubePlayerStateChange(event) {
    const states = {
      [-1]: 'unstarted',
      [0]: 'ended',
      [1]: 'playing',
      [2]: 'paused',
      [3]: 'buffering',
      [5]: 'video cued'
    };
    
    const state = states[event.data] || 'unknown';
    const wasPlaying = this.playerState.isPlaying;
    
    this.playerState.isPlaying = event.data === 1;
    
    console.log('📺 YouTube player state:', state);
    
    // Handle state changes
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        this.onVideoStarted();
        break;
      case YT.PlayerState.PAUSED:
        this.onVideoPaused();
        break;
      case YT.PlayerState.ENDED:
        this.onVideoEnded();
        break;
      case YT.PlayerState.BUFFERING:
        this.showLoadingOverlay();
        break;
      case YT.PlayerState.CUED:
        this.hideVideoOverlay();
        break;
    }
    
    // Update UI
    this.updatePlayerControls();
    this.updateVehicleDisplay();
    
    // Send to BeamNG
    if (this.beamngConnected) {
      this.sendToBeamNG('playerStateChanged', {
        state: state,
        isPlaying: this.playerState.isPlaying,
        currentVideo: this.playerState.currentVideo
      });
    }
  }
  
  // YouTube player error handler
  onYouTubePlayerError(event) {
    const errorMessages = {
      2: 'Invalid video ID',
      5: 'HTML5 player error',
      100: 'Video not found',
      101: 'Video not allowed in embedded players',
      150: 'Video not allowed in embedded players'
    };
    
    const errorMsg = errorMessages[event.data] || 'Unknown error';
    console.error('❌ YouTube player error:', errorMsg);
    
    this.showError('YouTube Error: ' + errorMsg);
    this.hideVideoOverlay();
  }
  
  // Setup UI event handlers
  setupUIEventHandlers() {
    // Video loading
    document.getElementById('load-video').addEventListener('click', () => {
      this.loadVideoFromInput();
    });
    
    document.getElementById('video-url').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.loadVideoFromInput();
      }
    });
    
    document.getElementById('search-video').addEventListener('click', () => {
      this.searchVideo();
    });
    
    // Playback controls
    document.getElementById('play-pause').addEventListener('click', () => {
      this.togglePlayPause();
    });
    
    document.getElementById('stop').addEventListener('click', () => {
      this.stopVideo();
    });
    
    document.getElementById('prev-track').addEventListener('click', () => {
      this.previousTrack();
    });
    
    document.getElementById('next-track').addEventListener('click', () => {
      this.nextTrack();
    });
    
    document.getElementById('repeat').addEventListener('click', () => {
      this.toggleRepeat();
    });
    
    document.getElementById('shuffle').addEventListener('click', () => {
      this.toggleShuffle();
    });
    
    // Audio controls
    document.getElementById('mute').addEventListener('click', () => {
      this.toggleMute();
    });
    
    document.getElementById('volume').addEventListener('input', (e) => {
      this.setVolume(e.target.value / 100);
    });
    
    document.getElementById('audio-settings').addEventListener('click', () => {
      this.showAudioSettings();
    });
    
    document.getElementById('equalizer').addEventListener('click', () => {
      this.showEqualizer();
    });
    
    // Progress bar
    const progressBar = document.getElementById('progress-bar');
    progressBar.addEventListener('click', (e) => {
      this.seekTo(e);
    });
    
    // Quick access buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const videoId = btn.getAttribute('data-video');
        this.loadVideo(videoId);
      });
    });
    
    // Settings
    document.getElementById('settings-btn').addEventListener('click', () => {
      this.showSettings();
    });
    
    document.getElementById('close-settings').addEventListener('click', () => {
      this.hideSettings();
    });
    
    // Help
    document.getElementById('help-btn').addEventListener('click', () => {
      this.showHelp();
    });
    
    // Fullscreen
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
      this.toggleFullscreen();
    });
    
    // Emergency acknowledgment
    document.getElementById('emergency-acknowledge').addEventListener('click', () => {
      this.acknowledgeEmergency();
    });
    
    console.log('🎮 UI event handlers setup complete');
  }
  
  // Setup vehicle integration
  setupVehicleIntegration() {
    if (!this.beamngConnected) {
      // Mock vehicle data for testing
      this.vehicleData = {
        speed: 0,
        rpm: 0,
        gear: 'N',
        fuel: 85,
        battery: 12.4,
        engineRunning: false,
        electricalActive: true,
        model: 'Test Vehicle',
        type: 'car'
      };
      
      // Simulate vehicle data updates
      setInterval(() => {
        this.vehicleData.speed = Math.random() * 60;
        this.vehicleData.rpm = Math.random() * 3000;
        this.vehicleData.gear = ['R', 'N', '1', '2', '3', '4', '5'][Math.floor(Math.random() * 7)];
        this.updateVehicleDisplay();
      }, 2000);
      
      return;
    }
    
    // Real BeamNG vehicle integration
    this.requestVehicleData();
    
    // Setup periodic vehicle updates
    setInterval(() => {
      this.requestVehicleData();
    }, 100); // 10Hz update rate
  }
  
  // Setup safety system
  setupSafetySystem() {
    // Speed-based restrictions
    this.setupSpeedRestrictions();
    
    // Crash detection
    this.setupCrashDetection();
    
    // Driver distraction prevention
    this.setupDriverDistractionPrevention();
    
    console.log('🛡️ Safety system active');
  }
  
  // Setup speed restrictions
  setupSpeedRestrictions() {
    if (!this.audioSettings.speedRestriction) {
      return;
    }
    
    // Monitor speed and restrict functionality
    setInterval(() => {
      const speed = this.vehicleData.speed;
      
      if (speed > 50) { // 50 mph absolute limit
        this.triggerEmergencyStop('Speed limit exceeded');
      } else if (speed > 30) { // 30 mph warning limit
        this.enableDriverMode();
      } else {
        this.disableDriverMode();
      }
    }, 1000);
  }
  
  // Video loading methods
  loadVideoFromInput() {
    const input = document.getElementById('video-url');
    const url = input.value.trim();
    
    if (!url) {
      this.showError('Please enter a YouTube URL or video ID');
      return;
    }
    
    const videoId = this.extractVideoId(url);
    if (videoId) {
      this.loadVideo(videoId);
      input.value = '';
    } else {
      this.showError('Invalid YouTube URL or video ID');
    }
  }
  
  // Extract video ID from various YouTube URL formats
  extractVideoId(url) {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return null;
  }
  
  // Load video by ID
  loadVideo(videoId) {
    if (!this.ytPlayerReady) {
      this.showError('YouTube player not ready');
      return;
    }
    
    // Check safety permissions
    if (!this.checkPlaybackPermission()) {
      this.showError('Playback restricted due to safety settings');
      return;
    }
    
    console.log('📺 Loading video:', videoId);
    
    this.showLoadingOverlay();
    this.playerState.currentVideo = videoId;
    
    try {
      this.ytPlayer.loadVideoById(videoId);
      this.updateVideoInfo(videoId);
      
      // Send to BeamNG
      if (this.beamngConnected) {
        this.sendToBeamNG('videoLoaded', { videoId: videoId });
      }
      
    } catch (error) {
      console.error('❌ Failed to load video:', error);
      this.showError('Failed to load video: ' + error.message);
      this.hideVideoOverlay();
    }
  }
  
  // Playback control methods
  togglePlayPause() {
    if (!this.ytPlayerReady) return;
    
    if (!this.checkPlaybackPermission()) {
      this.showError('Playback restricted due to safety settings');
      return;
    }
    
    try {
      if (this.playerState.isPlaying) {
        this.ytPlayer.pauseVideo();
      } else {
        this.ytPlayer.playVideo();
      }
    } catch (error) {
      console.error('❌ Error toggling play/pause:', error);
    }
  }
  
  stopVideo() {
    if (!this.ytPlayerReady) return;
    
    try {
      this.ytPlayer.stopVideo();
      this.playerState.isPlaying = false;
      this.playerState.progress = 0;
      this.updatePlayerControls();
      
      // Send to BeamNG
      if (this.beamngConnected) {
        this.sendToBeamNG('videoStopped', {});
      }
      
    } catch (error) {
      console.error('❌ Error stopping video:', error);
    }
  }
  
  // Audio control methods
  toggleMute() {
    if (!this.ytPlayerReady) return;
    
    try {
      if (this.playerState.muted) {
        this.ytPlayer.unMute();
        this.playerState.muted = false;
      } else {
        this.ytPlayer.mute();
        this.playerState.muted = true;
      }
      
      this.updateVolumeDisplay();
      
      // Send to BeamNG
      if (this.beamngConnected) {
        this.sendToBeamNG('muteToggled', { muted: this.playerState.muted });
      }
      
    } catch (error) {
      console.error('❌ Error toggling mute:', error);
    }
  }
  
  setVolume(volume) {
    volume = Math.max(0, Math.min(1, volume));
    this.playerState.volume = volume;
    
    if (this.ytPlayerReady) {
      try {
        this.ytPlayer.setVolume(volume * 100);
      } catch (error) {
        console.error('❌ Error setting volume:', error);
      }
    }
    
    this.updateVolumeDisplay();
    
    // Send to BeamNG
    if (this.beamngConnected) {
      this.sendToBeamNG('volumeChanged', { volume: volume });
    }
  }
  
  // Vehicle data handlers
  handleVehicleStateUpdate(data) {
    if (!data) return;
    
    this.vehicleData = { ...this.vehicleData, ...data };
    this.updateVehicleDisplay();
    this.updateSystemStatus();
    
    // Handle RPM-based volume adjustment
    if (this.audioSettings.rpmVolumeAdjust && this.vehicleData.engineRunning) {
      const rpmFactor = Math.min(this.vehicleData.rpm / 3000, 1.0);
      const adjustedVolume = this.playerState.volume * (1.0 + rpmFactor * 0.2);
      this.setSystemVolume(adjustedVolume);
    }
  }
  
  // UI update methods
  updatePlayerControls() {
    const playPauseBtn = document.getElementById('play-pause');
    const playIcon = playPauseBtn.querySelector('.btn-icon');
    
    if (this.playerState.isPlaying) {
      playIcon.textContent = '⏸️';
      playPauseBtn.classList.add('active');
    } else {
      playIcon.textContent = '▶️';
      playPauseBtn.classList.remove('active');
    }
    
    // Update repeat and shuffle buttons
    document.getElementById('repeat').classList.toggle('active', this.playerState.repeat);
    document.getElementById('shuffle').classList.toggle('active', this.playerState.shuffle);
  }
  
  updateVolumeDisplay() {
    const volumeDisplay = document.getElementById('volume-display');
    const volumeSlider = document.getElementById('volume');
    const muteBtn = document.getElementById('mute');
    const muteIcon = muteBtn.querySelector('.btn-icon');
    
    if (this.playerState.muted) {
      volumeDisplay.textContent = 'Muted';
      muteIcon.textContent = '🔇';
      muteBtn.classList.add('active');
    } else {
      volumeDisplay.textContent = Math.round(this.playerState.volume * 100) + '%';
      muteIcon.textContent = '🔊';
      muteBtn.classList.remove('active');
    }
    
    volumeSlider.value = this.playerState.volume * 100;
  }
  
  updateVehicleDisplay() {
    document.getElementById('vehicle-speed').textContent = Math.round(this.vehicleData.speed) + ' mph';
    document.getElementById('vehicle-rpm').textContent = Math.round(this.vehicleData.rpm);
    document.getElementById('vehicle-gear').textContent = this.vehicleData.gear;
    document.getElementById('vehicle-fuel').textContent = Math.round(this.vehicleData.fuel) + '%';
    document.getElementById('vehicle-model').textContent = this.vehicleData.model;
    
    // Update vehicle status
    const status = this.vehicleData.engineRunning ? 'Engine Running' : 'Engine Off';
    document.getElementById('vehicle-status').textContent = status;
  }
  
  updateSystemStatus() {
    // ECU status
    const ecuStatus = document.getElementById('ecu-status');
    if (this.beamngConnected) {
      ecuStatus.classList.add('online');
      ecuStatus.classList.remove('offline');
    } else {
      ecuStatus.classList.add('offline');
      ecuStatus.classList.remove('online');
    }
    
    // Audio status
    const audioStatus = document.getElementById('audio-status');
    if (this.vehicleData.electricalActive) {
      audioStatus.classList.add('online');
      audioStatus.classList.remove('offline');
    } else {
      audioStatus.classList.add('offline');
      audioStatus.classList.remove('online');
    }
    
    // Network status
    const networkStatus = document.getElementById('network-status');
    if (navigator.onLine) {
      networkStatus.classList.add('online');
      networkStatus.classList.remove('offline');
    } else {
      networkStatus.classList.add('offline');
      networkStatus.classList.remove('online');
    }
  }
  
  // Overlay methods
  showLoadingOverlay() {
    const overlay = document.getElementById('video-overlay');
    const message = document.getElementById('overlay-message');
    message.textContent = 'Loading video...';
    overlay.classList.remove('hidden');
  }
  
  hideVideoOverlay() {
    const overlay = document.getElementById('video-overlay');
    overlay.classList.add('hidden');
  }
  
  showError(message) {
    const overlay = document.getElementById('video-overlay');
    const overlayMessage = document.getElementById('overlay-message');
    overlayMessage.textContent = message;
    overlay.classList.remove('hidden');
    
    // Hide after 3 seconds
    setTimeout(() => {
      this.hideVideoOverlay();
    }, 3000);
  }
  
  // Safety system methods
  checkPlaybackPermission() {
    // Check electrical system
    if (!this.vehicleData.electricalActive) {
      return false;
    }
    
    // Check speed restrictions
    if (this.audioSettings.speedRestriction && this.vehicleData.speed > 50) {
      return false;
    }
    
    return true;
  }
  
  triggerEmergencyStop(reason) {
    console.log('🚨 Emergency stop triggered:', reason);
    
    // Stop playback immediately
    this.stopVideo();
    
    // Show emergency overlay
    const overlay = document.getElementById('emergency-overlay');
    const speedDisplay = document.getElementById('emergency-speed');
    speedDisplay.textContent = Math.round(this.vehicleData.speed);
    overlay.classList.remove('hidden');
    
    // Send to BeamNG
    if (this.beamngConnected) {
      this.sendToBeamNG('emergencyStop', { reason: reason });
    }
  }
  
  acknowledgeEmergency() {
    const overlay = document.getElementById('emergency-overlay');
    overlay.classList.add('hidden');
  }
  
  // BeamNG communication methods
  sendToBeamNG(action, data) {
    if (!this.beamngConnected) return;
    
    try {
      if (typeof bngApi !== 'undefined') {
        bngApi.engineLua(`extensions.tech_youtubePlayerSystem.onUIMessage('${action}', ${JSON.stringify(data)})`);
      }
    } catch (error) {
      console.error('❌ Failed to send to BeamNG:', error);
    }
  }
  
  requestVehicleData() {
    if (!this.beamngConnected) return;
    
    try {
      if (typeof bngApi !== 'undefined') {
        bngApi.activeObjectLua('extensions.tech_youtubePlayerVehicle.getVehicleData()', (result) => {
          if (result) {
            this.handleVehicleStateUpdate(result);
          }
        });
      }
    } catch (error) {
      console.error('❌ Failed to request vehicle data:', error);
    }
  }
  
  sendHeartbeatToBeamNG() {
    if (!this.beamngConnected) return;
    
    const heartbeat = {
      timestamp: Date.now(),
      version: this.version,
      playerState: this.playerState,
      initialized: this.initialized
    };
    
    this.sendToBeamNG('heartbeat', heartbeat);
  }
  
  // Settings methods
  showSettings() {
    document.getElementById('settings-panel').classList.remove('hidden');
  }
  
  hideSettings() {
    document.getElementById('settings-panel').classList.add('hidden');
  }
  
  // Periodic updates
  startPeriodicUpdates() {
    // Update progress bar
    setInterval(() => {
      if (this.ytPlayerReady && this.playerState.isPlaying) {
        try {
          const currentTime = this.ytPlayer.getCurrentTime();
          const duration = this.ytPlayer.getDuration();
          
          if (duration > 0) {
            this.playerState.progress = currentTime / duration;
            this.playerState.duration = duration;
            this.updateProgressBar();
          }
        } catch (error) {
          // Ignore errors during progress updates
        }
      }
    }, 1000);
    
    // Update system status
    setInterval(() => {
      this.updateSystemStatus();
    }, 5000);
  }
  
  updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    const progressHandle = document.getElementById('progress-handle');
    const currentTime = document.getElementById('current-time');
    const totalTime = document.getElementById('total-time');
    
    const progress = this.playerState.progress * 100;
    progressFill.style.width = progress + '%';
    progressHandle.style.left = progress + '%';
    
    currentTime.textContent = this.formatTime(this.playerState.progress * this.playerState.duration);
    totalTime.textContent = this.formatTime(this.playerState.duration);
  }
  
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  // User preferences
  saveUserPreferences() {
    const preferences = {
      volume: this.playerState.volume,
      muted: this.playerState.muted,
      repeat: this.playerState.repeat,
      shuffle: this.playerState.shuffle,
      audioSettings: this.audioSettings
    };
    
    localStorage.setItem('youtubeplayer_preferences', JSON.stringify(preferences));
    
    // Send to BeamNG
    if (this.beamngConnected) {
      this.sendToBeamNG('savePreferences', preferences);
    }
  }
  
  loadUserPreferences() {
    try {
      const saved = localStorage.getItem('youtubeplayer_preferences');
      if (saved) {
        const preferences = JSON.parse(saved);
        
        this.playerState.volume = preferences.volume || 0.5;
        this.playerState.muted = preferences.muted || false;
        this.playerState.repeat = preferences.repeat || false;
        this.playerState.shuffle = preferences.shuffle || false;
        this.audioSettings = { ...this.audioSettings, ...preferences.audioSettings };
        
        // Update UI
        this.updateVolumeDisplay();
        this.updatePlayerControls();
      }
    } catch (error) {
      console.error('❌ Failed to load user preferences:', error);
    }
  }
  
  // Utility methods
  initializeAudioSystem() {
    // Initialize Web Audio API if available
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
      try {
        this.audioContext = new (AudioContext || webkitAudioContext)();
        console.log('🔊 Web Audio API initialized');
      } catch (error) {
        console.log('⚠️ Web Audio API not available');
      }
    }
  }
  
  initializeNetworkMonitoring() {
    // Monitor network status
    window.addEventListener('online', () => {
      console.log('🌐 Network connection restored');
      this.updateSystemStatus();
    });
    
    window.addEventListener('offline', () => {
      console.log('📡 Network connection lost');
      this.updateSystemStatus();
    });
  }
  
  // Placeholder methods for future implementation
  searchVideo() {
    this.showError('Video search feature coming soon!');
  }
  
  previousTrack() {
    this.showError('Previous track feature coming soon!');
  }
  
  nextTrack() {
    this.showError('Next track feature coming soon!');
  }
  
  toggleRepeat() {
    this.playerState.repeat = !this.playerState.repeat;
    this.updatePlayerControls();
  }
  
  toggleShuffle() {
    this.playerState.shuffle = !this.playerState.shuffle;
    this.updatePlayerControls();
  }
  
  showAudioSettings() {
    this.showError('Audio settings feature coming soon!');
  }
  
  showEqualizer() {
    this.showError('Equalizer feature coming soon!');
  }
  
  showHelp() {
    this.showError('Help system coming soon!');
  }
  
  toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }
  
  updateVideoInfo(videoId) {
    // Update video title and metadata
    document.getElementById('video-title').textContent = `Loading video ${videoId}...`;
    document.getElementById('video-duration').textContent = '--:--';
    document.getElementById('video-quality').textContent = 'Auto';
    document.getElementById('video-views').textContent = '--';
  }
  
  // Event handlers for vehicle integration
  onVideoStarted() {
    console.log('▶️ Video started');
  }
  
  onVideoPaused() {
    console.log('⏸️ Video paused');
  }
  
  onVideoEnded() {
    console.log('⏹️ Video ended');
    
    if (this.playerState.repeat) {
      this.ytPlayer.playVideo();
    } else {
      this.nextTrack();
    }
  }
  
  enableDriverMode() {
    console.log('🚗 Driver mode enabled - limited functionality');
  }
  
  disableDriverMode() {
    console.log('🚗 Driver mode disabled - full functionality');
  }
  
  setupCrashDetection() {
    // Will be implemented with real BeamNG crash detection
  }
  
  setupDriverDistractionPrevention() {
    // Will be implemented with real BeamNG driver monitoring
  }
  
  setupVehicleDataUpdates() {
    // Will be implemented with real BeamNG vehicle data streaming
  }
  
  handleSystemStatusUpdate(data) {
    this.systemState = { ...this.systemState, ...data };
    this.updateSystemStatus();
  }
  
  handleSafetyAlert(data) {
    this.triggerEmergencyStop(data.reason || 'Safety alert');
  }
  
  handleAudioSystemUpdate(data) {
    // Handle audio system updates from BeamNG
    if (data.volume !== undefined) {
      this.setVolume(data.volume);
    }
  }
  
  setSystemVolume(volume) {
    // Set system-level volume (different from user volume)
    if (this.ytPlayerReady) {
      try {
        this.ytPlayer.setVolume(volume * 100);
      } catch (error) {
        console.error('❌ Error setting system volume:', error);
      }
    }
  }
  
  seekTo(event) {
    if (!this.ytPlayerReady || !this.playerState.duration) return;
    
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = percentage * this.playerState.duration;
    
    try {
      this.ytPlayer.seekTo(seekTime);
    } catch (error) {
      console.error('❌ Error seeking video:', error);
    }
  }
}

// Initialize the player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.professionalYouTubePlayer = new ProfessionalYouTubePlayer();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (window.professionalYouTubePlayer) {
    window.professionalYouTubePlayer.saveUserPreferences();
  }
});

// Export for BeamNG integration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProfessionalYouTubePlayer;
}