# BeamNG Drive Android Auto Integration

A comprehensive Android Auto app that integrates with BeamNG Drive, supporting all vehicle types in the game.

## Features

- **Universal Vehicle Support**: Works with any vehicle in BeamNG Drive
- **Real-time Data Display**: Speed, RPM, fuel level, temperature, and more
- **Vehicle Control**: Steering, throttle, brake, and gear control via Android Auto
- **Modern UI**: Beautiful, responsive interface optimized for Android Auto
- **Custom Protocol**: Efficient UDP communication between Android Auto and BeamNG Drive
- **Multi-vehicle Support**: Automatically detects and adapts to different vehicle types
- **Safety Features**: Emergency stop, automatic disconnect, and failsafe mechanisms

## Project Structure

```
beamng-android-auto/
├── android-auto-app/          # Android Auto application
│   ├── app/                   # Main Android app module
│   ├── automotive/            # Android Auto specific module
│   └── shared/               # Shared utilities and models
├── beamng-mod/               # BeamNG Drive mod
│   ├── lua/                  # Lua scripts for vehicle integration
│   ├── ui/                   # BeamNG Drive UI components
│   └── protocols/            # Custom UDP protocol implementation
├── protocol-spec/            # Communication protocol documentation
└── docs/                     # Documentation and setup guides
```

## Quick Start

### Prerequisites

- Android Studio 4.0+
- Android Auto compatible device
- BeamNG Drive installed
- Network connectivity between Android device and PC

### Installation

1. **Install BeamNG Drive Mod**:
   - Copy the `beamng-mod` folder to your BeamNG Drive mods directory
   - Enable the mod in BeamNG Drive's mod manager

2. **Build Android Auto App**:
   - Open `android-auto-app` in Android Studio
   - Build and install on your Android Auto compatible device

3. **Configure Network**:
   - Ensure both devices are on the same network
   - Configure firewall to allow UDP traffic on ports 4444-4446

### Usage

1. Start BeamNG Drive and load any vehicle
2. Enable the Android Auto protocol in BeamNG Drive settings
3. Connect your Android Auto device
4. Launch the BeamNG Drive app from Android Auto interface
5. Enjoy seamless integration!

## Technical Details

### Communication Protocol

The app uses a custom UDP protocol optimized for real-time vehicle data:

- **Discovery**: Port 4444 (broadcast discovery)
- **Control**: Port 4445 (vehicle control commands)
- **Data**: Port 4446 (vehicle telemetry data)

### Vehicle Compatibility

The mod automatically detects and adapts to:
- All official BeamNG Drive vehicles
- Community-created vehicles
- Automation-imported vehicles
- Custom vehicle configurations

## Development

### Building the Android App

```bash
cd android-auto-app
./gradlew assembleDebug
```

### Testing the BeamNG Mod

1. Copy mod files to BeamNG Drive
2. Enable developer mode in BeamNG Drive
3. Use Ctrl+R to reload the mod during development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and support:
- Check the troubleshooting guide in `/docs/troubleshooting.md`
- Submit issues on GitHub
- Join our Discord community

## Acknowledgments

- BeamNG GmbH for the amazing BeamNG Drive platform
- Android Auto team for the development framework
- Community contributors and testers