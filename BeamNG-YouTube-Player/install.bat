@echo off
title YouTube Player for BeamNG.drive - Installer
color 0a

echo.
echo =====================================
echo  YouTube Player for BeamNG.drive
echo     Easy Installation Script
echo =====================================
echo.

echo [INFO] Starting installation...
echo.

REM Check if BeamNG.drive documents folder exists
set "BEAMNG_DOCS=%USERPROFILE%\Documents\BeamNG.drive"
set "BEAMNG_MODS=%BEAMNG_DOCS%\mods\unpacked"

if not exist "%BEAMNG_DOCS%" (
    echo [ERROR] BeamNG.drive documents folder not found!
    echo Please make sure BeamNG.drive is installed and has been run at least once.
    pause
    exit /b 1
)

echo [INFO] BeamNG.drive folder found: %BEAMNG_DOCS%

REM Create mods folder if it doesn't exist
if not exist "%BEAMNG_MODS%" (
    echo [INFO] Creating mods folder...
    mkdir "%BEAMNG_MODS%"
)

REM Copy mod files
echo [INFO] Copying YouTube Player mod files...
robocopy "." "%BEAMNG_MODS%\BeamNG-YouTube-Player" /E /XD .git screenshots /XF install.bat install.sh README.md LICENSE

if %errorlevel% leq 1 (
    echo.
    echo [SUCCESS] YouTube Player mod installed successfully!
    echo.
    echo Installation location: %BEAMNG_MODS%\BeamNG-YouTube-Player
    echo.
    echo Next steps:
    echo 1. Start BeamNG.drive
    echo 2. Go to Main Menu ^> Mods ^> Enable "YouTube Player"
    echo 3. In-game, press F11 to open Apps menu
    echo 4. Select "YouTube Player" from Entertainment category
    echo.
    echo Enjoy your YouTube experience in BeamNG.drive!
) else (
    echo.
    echo [ERROR] Installation failed!
    echo Please check permissions and try again.
)

echo.
pause