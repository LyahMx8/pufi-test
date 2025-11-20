@echo off
echo ========================================
echo Ejecutando Tests E2E de Bright Bogota
echo ========================================
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no esta instalado o no esta en el PATH
    echo Por favor instala Python desde https://www.python.org/
    pause
    exit /b 1
)

REM Verificar si las dependencias están instaladas
echo Verificando dependencias...
pip show selenium >nul 2>&1
if errorlevel 1 (
    echo Instalando dependencias...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

echo.
echo Ejecutando tests...
echo.

REM Ejecutar los tests
python test_e2e.py

pause

