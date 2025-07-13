-- YouTube Player App for BeamNG.drive
-- Integration with BeamNG's UI system

local M = {}

-- App configuration
M.name = "YouTube Player"
M.author = "BeamNG YouTube Integration"
M.version = "1.0.0"
M.description = "Advanced YouTube player for vehicle entertainment systems"

-- App properties
M.windowName = "YouTube Player"
M.defaultSize = { width = 800, height = 600 }
M.minSize = { width = 400, height = 300 }
M.maxSize = { width = 1200, height = 900 }
M.resizable = true
M.closable = true
M.alwaysOnTop = false

-- State management
local appState = {
  isInitialized = false,
  currentVideo = nil,
  isPlaying = false,
  volume = 50,
  position = { x = 100, y = 100 },
  size = { width = 800, height = 600 }
}

-- Initialize the app
function M.init()
  print("YouTube Player: Initializing...")
  
  -- Set up event listeners
  M.setupEventListeners()
  
  -- Load saved settings
  M.loadSettings()
  
  appState.isInitialized = true
  print("YouTube Player: Initialization complete")
end

-- Setup event listeners for BeamNG events
function M.setupEventListeners()
  -- Vehicle events
  if extensions and extensions.core_vehicle then
    extensions.core_vehicle.addVehicleEventListener("vehicleStarted", M.onVehicleStarted)
    extensions.core_vehicle.addVehicleEventListener("vehicleStopped", M.onVehicleStopped)
    extensions.core_vehicle.addVehicleEventListener("vehicleReset", M.onVehicleReset)
  end
  
  -- UI events
  if ui_apps then
    ui_apps.addAppEventListener("appOpened", M.onAppOpened)
    ui_apps.addAppEventListener("appClosed", M.onAppClosed)
  end
  
  -- Game events
  if extensions and extensions.core_gamestate then
    extensions.core_gamestate.addGameStateListener("paused", M.onGamePaused)
    extensions.core_gamestate.addGameStateListener("resumed", M.onGameResumed)
  end
end

-- Vehicle event handlers
function M.onVehicleStarted(vehicleData)
  print("YouTube Player: Vehicle started")
  M.sendMessageToUI({
    type = "beamng",
    action = "vehicleStarted",
    data = vehicleData
  })
end

function M.onVehicleStopped(vehicleData)
  print("YouTube Player: Vehicle stopped")
  M.sendMessageToUI({
    type = "beamng",
    action = "vehicleStopped",
    data = vehicleData
  })
end

function M.onVehicleReset(vehicleData)
  print("YouTube Player: Vehicle reset")
  M.sendMessageToUI({
    type = "beamng",
    action = "vehicleReset",
    data = vehicleData
  })
end

-- App event handlers
function M.onAppOpened(appName)
  if appName == "YouTube Player" then
    print("YouTube Player: App opened")
    M.sendMessageToUI({
      type = "beamng",
      action = "appOpened"
    })
  end
end

function M.onAppClosed(appName)
  if appName == "YouTube Player" then
    print("YouTube Player: App closed")
    M.saveSettings()
  end
end

-- Game state handlers
function M.onGamePaused()
  print("YouTube Player: Game paused")
  M.sendMessageToUI({
    type = "beamng",
    action = "gamePaused"
  })
end

function M.onGameResumed()
  print("YouTube Player: Game resumed")
  M.sendMessageToUI({
    type = "beamng",
    action = "gameResumed"
  })
end

-- Send message to UI
function M.sendMessageToUI(message)
  if ui_apps and ui_apps.sendMessageToApp then
    ui_apps.sendMessageToApp("YouTube Player", message)
  end
end

-- Handle messages from UI
function M.onMessageFromUI(message)
  if not message or not message.type then
    return
  end
  
  if message.type == "youtube" then
    M.handleYouTubeMessage(message)
  elseif message.type == "app" then
    M.handleAppMessage(message)
  end
end

-- Handle YouTube-specific messages
function M.handleYouTubeMessage(message)
  local action = message.action
  
  if action == "videoLoaded" then
    appState.currentVideo = message.data.videoId
    print("YouTube Player: Video loaded - " .. appState.currentVideo)
    
  elseif action == "playStateChanged" then
    appState.isPlaying = message.data.isPlaying
    print("YouTube Player: Play state changed - " .. tostring(appState.isPlaying))
    
  elseif action == "volumeChanged" then
    appState.volume = message.data.volume
    print("YouTube Player: Volume changed - " .. appState.volume)
    
  elseif action == "error" then
    print("YouTube Player Error: " .. (message.data.error or "Unknown error"))
    
  end
end

-- Handle app-specific messages
function M.handleAppMessage(message)
  local action = message.action
  
  if action == "saveSettings" then
    M.saveSettings()
    
  elseif action == "loadSettings" then
    M.loadSettings()
    
  elseif action == "resetSettings" then
    M.resetSettings()
    
  end
end

-- Settings management
function M.loadSettings()
  local settings = settings_manager and settings_manager.getSettings("youtube_player")
  
  if settings then
    appState.volume = settings.volume or 50
    appState.position = settings.position or { x = 100, y = 100 }
    appState.size = settings.size or { width = 800, height = 600 }
    
    print("YouTube Player: Settings loaded")
  else
    print("YouTube Player: No saved settings found, using defaults")
  end
end

function M.saveSettings()
  if settings_manager then
    local settings = {
      volume = appState.volume,
      position = appState.position,
      size = appState.size,
      currentVideo = appState.currentVideo
    }
    
    settings_manager.saveSettings("youtube_player", settings)
    print("YouTube Player: Settings saved")
  end
end

function M.resetSettings()
  appState.volume = 50
  appState.position = { x = 100, y = 100 }
  appState.size = { width = 800, height = 600 }
  appState.currentVideo = nil
  
  M.saveSettings()
  print("YouTube Player: Settings reset to defaults")
end

-- App lifecycle
function M.onUpdate(dt)
  -- Update logic if needed
  if appState.isInitialized then
    -- Periodic updates can go here
  end
end

function M.onDraw()
  -- Draw logic if needed
  if appState.isInitialized then
    -- Custom drawing can go here
  end
end

function M.onDestroy()
  print("YouTube Player: Shutting down...")
  
  -- Save settings before exit
  M.saveSettings()
  
  -- Clean up event listeners
  if extensions and extensions.core_vehicle then
    extensions.core_vehicle.removeVehicleEventListener("vehicleStarted", M.onVehicleStarted)
    extensions.core_vehicle.removeVehicleEventListener("vehicleStopped", M.onVehicleStopped)
    extensions.core_vehicle.removeVehicleEventListener("vehicleReset", M.onVehicleReset)
  end
  
  appState.isInitialized = false
  print("YouTube Player: Shutdown complete")
end

-- Utility functions
function M.getAppState()
  return appState
end

function M.isReady()
  return appState.isInitialized
end

-- Export the module
return M