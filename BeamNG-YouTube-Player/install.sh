#!/bin/bash

# YouTube Player for BeamNG.drive - Linux/Mac Installation Script
# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "====================================="
echo " YouTube Player for BeamNG.drive"
echo "    Easy Installation Script"
echo "====================================="
echo -e "${NC}"

echo -e "${BLUE}[INFO]${NC} Starting installation..."
echo

# Detect OS and set BeamNG path
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    BEAMNG_DOCS="$HOME/.local/share/BeamNG.drive"
    OS="Linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    BEAMNG_DOCS="$HOME/Library/Application Support/BeamNG.drive"
    OS="macOS"
else
    echo -e "${RED}[ERROR]${NC} Unsupported operating system!"
    exit 1
fi

BEAMNG_MODS="$BEAMNG_DOCS/mods/unpacked"

echo -e "${BLUE}[INFO]${NC} Detected OS: $OS"
echo -e "${BLUE}[INFO]${NC} BeamNG.drive path: $BEAMNG_DOCS"

# Check if BeamNG.drive folder exists
if [ ! -d "$BEAMNG_DOCS" ]; then
    echo -e "${RED}[ERROR]${NC} BeamNG.drive folder not found!"
    echo "Please make sure BeamNG.drive is installed and has been run at least once."
    echo "Expected location: $BEAMNG_DOCS"
    exit 1
fi

echo -e "${GREEN}[INFO]${NC} BeamNG.drive folder found!"

# Create mods folder if it doesn't exist
if [ ! -d "$BEAMNG_MODS" ]; then
    echo -e "${YELLOW}[INFO]${NC} Creating mods folder..."
    mkdir -p "$BEAMNG_MODS"
fi

# Copy mod files
echo -e "${BLUE}[INFO]${NC} Copying YouTube Player mod files..."

# Remove existing installation if it exists
if [ -d "$BEAMNG_MODS/BeamNG-YouTube-Player" ]; then
    echo -e "${YELLOW}[INFO]${NC} Removing existing installation..."
    rm -rf "$BEAMNG_MODS/BeamNG-YouTube-Player"
fi

# Copy files (excluding installation scripts and documentation)
cp -r . "$BEAMNG_MODS/BeamNG-YouTube-Player"

# Remove installation files from the copied directory
rm -f "$BEAMNG_MODS/BeamNG-YouTube-Player/install.sh"
rm -f "$BEAMNG_MODS/BeamNG-YouTube-Player/install.bat"
rm -f "$BEAMNG_MODS/BeamNG-YouTube-Player/README.md"
rm -f "$BEAMNG_MODS/BeamNG-YouTube-Player/LICENSE"
rm -rf "$BEAMNG_MODS/BeamNG-YouTube-Player/.git"
rm -rf "$BEAMNG_MODS/BeamNG-YouTube-Player/screenshots"

if [ $? -eq 0 ]; then
    echo
    echo -e "${GREEN}[SUCCESS]${NC} YouTube Player mod installed successfully!"
    echo
    echo -e "${BLUE}Installation location:${NC} $BEAMNG_MODS/BeamNG-YouTube-Player"
    echo
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Start BeamNG.drive"
    echo "2. Go to Main Menu → Mods → Enable \"YouTube Player\""
    echo "3. In-game, press F11 to open Apps menu"
    echo "4. Select \"YouTube Player\" from Entertainment category"
    echo
    echo -e "${GREEN}Enjoy your YouTube experience in BeamNG.drive!${NC}"
else
    echo
    echo -e "${RED}[ERROR]${NC} Installation failed!"
    echo "Please check permissions and try again."
    exit 1
fi

echo
echo -e "${BLUE}[INFO]${NC} Installation complete. Press any key to exit..."
read -n 1 -s