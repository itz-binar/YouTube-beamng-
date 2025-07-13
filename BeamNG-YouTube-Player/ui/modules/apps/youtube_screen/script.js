// YouTube Player Script for BeamNG.drive
// Advanced YouTube integration with full controls

class YouTubePlayer {
  constructor() {
    this.player = null;
    this.isReady = false;
    this.currentVideoId = null;
    this.volume = 50;
    this.isPlaying = false;
    this.isMuted = false;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadYouTubeAPI();
    this.updateStatus('Initializing YouTube Player...');
  }

  loadYouTubeAPI() {
    // Load YouTube IFrame API
    if (typeof YT === 'undefined') {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Setup API ready callback
    window.onYouTubeIframeAPIReady = () => {
      this.initPlayer();
    };
  }

  initPlayer() {
    const iframe = document.getElementById('ytplayer');
    
    this.player = new YT.Player('ytplayer', {
      events: {
        'onReady': (event) => this.onPlayerReady(event),
        'onStateChange': (event) => this.onPlayerStateChange(event),
        'onError': (event) => this.onPlayerError(event)
      }
    });
  }

  onPlayerReady(event) {
    this.isReady = true;
    this.updateStatus('YouTube Player Ready! 🎵');
    console.log('YouTube Player Ready');
    
    // Set initial volume
    this.setVolume(this.volume);
  }

  onPlayerStateChange(event) {
    const states = {
      [-1]: 'unstarted',
      [0]: 'ended',
      [1]: 'playing',
      [2]: 'paused',
      [3]: 'buffering',
      [5]: 'video cued'
    };

    const state = states[event.data] || 'unknown';
    this.isPlaying = event.data === 1;
    
    console.log('Player state changed:', state);
    this.updateStatus(`Status: ${state}`);
    
    // Update play/pause button
    this.updatePlayPauseButton();
  }

  onPlayerError(event) {
    const errorMessages = {
      2: 'Invalid video ID',
      5: 'HTML5 player error',
      100: 'Video not found',
      101: 'Video not allowed in embedded players',
      150: 'Video not allowed in embedded players'
    };

    const errorMsg = errorMessages[event.data] || 'Unknown error';
    this.updateStatus(`Error: ${errorMsg}`);
    console.error('YouTube Player Error:', errorMsg);
  }

  setupEventListeners() {
    // Load video button
    document.getElementById('load-video').addEventListener('click', () => {
      this.loadVideoFromInput();
    });

    // Enter key on input
    document.getElementById('video-url').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.loadVideoFromInput();
      }
    });

    // Preset video buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const videoId = btn.getAttribute('data-video');
        this.loadVideo(videoId);
      });
    });

    // Player controls
    document.getElementById('play-pause').addEventListener('click', () => {
      this.togglePlayPause();
    });

    document.getElementById('stop').addEventListener('click', () => {
      this.stopVideo();
    });

    document.getElementById('mute').addEventListener('click', () => {
      this.toggleMute();
    });

    // Volume control
    const volumeSlider = document.getElementById('volume');
    volumeSlider.addEventListener('input', (e) => {
      this.setVolume(e.target.value);
    });

    // Connection status check
    this.checkConnectionStatus();
    setInterval(() => this.checkConnectionStatus(), 5000);
  }

  loadVideoFromInput() {
    const input = document.getElementById('video-url');
    const url = input.value.trim();
    
    if (!url) {
      this.updateStatus('Please enter a YouTube URL or video ID');
      return;
    }

    const videoId = this.extractVideoId(url);
    if (videoId) {
      this.loadVideo(videoId);
      input.value = '';
    } else {
      this.updateStatus('Invalid YouTube URL or video ID');
    }
  }

  extractVideoId(url) {
    // Handle various YouTube URL formats
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

  loadVideo(videoId) {
    if (!this.isReady) {
      this.updateStatus('Player not ready yet...');
      return;
    }

    this.showLoading();
    this.currentVideoId = videoId;
    
    try {
      this.player.loadVideoById(videoId);
      this.updateStatus(`Loading video: ${videoId}`);
      
      // Hide loading after a delay
      setTimeout(() => {
        this.hideLoading();
      }, 2000);
      
    } catch (error) {
      this.hideLoading();
      this.updateStatus('Error loading video');
      console.error('Error loading video:', error);
    }
  }

  togglePlayPause() {
    if (!this.isReady) return;

    try {
      if (this.isPlaying) {
        this.player.pauseVideo();
      } else {
        this.player.playVideo();
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  }

  stopVideo() {
    if (!this.isReady) return;

    try {
      this.player.stopVideo();
      this.updateStatus('Video stopped');
    } catch (error) {
      console.error('Error stopping video:', error);
    }
  }

  toggleMute() {
    if (!this.isReady) return;

    try {
      if (this.isMuted) {
        this.player.unMute();
        this.isMuted = false;
        this.updateStatus('Unmuted');
      } else {
        this.player.mute();
        this.isMuted = true;
        this.updateStatus('Muted');
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  }

  setVolume(volume) {
    this.volume = volume;
    document.getElementById('volume-display').textContent = `${volume}%`;
    
    if (this.isReady) {
      try {
        this.player.setVolume(volume);
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  }

  updatePlayPauseButton() {
    const button = document.getElementById('play-pause');
    if (this.isPlaying) {
      button.innerHTML = '⏸️ Pause';
    } else {
      button.innerHTML = '▶️ Play';
    }
  }

  showLoading() {
    document.getElementById('loading-overlay').classList.remove('hidden');
  }

  hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
  }

  updateStatus(message) {
    document.querySelector('.status-text').textContent = message;
  }

  checkConnectionStatus() {
    const statusElement = document.querySelector('.connection-status');
    
    if (navigator.onLine) {
      statusElement.textContent = '🟢 Online';
      statusElement.className = 'connection-status online';
    } else {
      statusElement.textContent = '🔴 Offline';
      statusElement.className = 'connection-status offline';
    }
  }
}

// BeamNG.drive Integration
class BeamNGIntegration {
  constructor(player) {
    this.player = player;
    this.initBeamNGBindings();
  }

  initBeamNGBindings() {
    // BeamNG UI communication
    if (typeof angular !== 'undefined') {
      this.setupAngularBindings();
    }
    
    // Listen for BeamNG events
    this.setupBeamNGEvents();
  }

  setupAngularBindings() {
    // BeamNG uses AngularJS for UI
    try {
      const app = angular.module('beamng.apps');
      
      app.controller('YouTubePlayerController', ['$scope', ($scope) => {
        $scope.player = this.player;
        
        $scope.loadVideo = (videoId) => {
          this.player.loadVideo(videoId);
        };
        
        $scope.togglePlayPause = () => {
          this.player.togglePlayPause();
        };
        
        $scope.setVolume = (volume) => {
          this.player.setVolume(volume);
        };
      }]);
    } catch (error) {
      console.log('Angular not available, using vanilla JS');
    }
  }

  setupBeamNGEvents() {
    // Listen for vehicle events
    window.addEventListener('message', (event) => {
      if (event.data.type === 'beamng') {
        this.handleBeamNGEvent(event.data);
      }
    });
  }

  handleBeamNGEvent(data) {
    switch (data.action) {
      case 'vehicleStarted':
        this.player.updateStatus('Vehicle started - YouTube ready!');
        break;
      case 'vehicleStopped':
        this.player.stopVideo();
        break;
      case 'emergencyStop':
        this.player.stopVideo();
        this.player.updateStatus('Emergency stop - Media paused');
        break;
    }
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  const youtubePlayer = new YouTubePlayer();
  const beamngIntegration = new BeamNGIntegration(youtubePlayer);
  
  // Make player globally accessible
  window.YouTubePlayerInstance = youtubePlayer;
  
  console.log('YouTube Player for BeamNG.drive initialized!');
});

// Fallback for immediate execution
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('YouTube Player loaded via fallback');
  });
} else {
  console.log('YouTube Player loaded immediately');
}