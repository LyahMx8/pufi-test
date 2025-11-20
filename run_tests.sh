#!/bin/bash

echo "========================================"
echo "Ejecutando Tests E2E de Bright Bogota"
echo "========================================"
echo ""

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 no está instalado"
    echo "Por favor instala Python desde https://www.python.org/"
    exit 1
fi

# Verificar si las dependencias están instaladas
echo "Verificando dependencias..."
if ! python3 -c "import selenium" 2>/dev/null; then
    echo "Instalando dependencias..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "ERROR: No se pudieron instalar las dependencias"
        exit 1
    fi
fi

echo ""
echo "Ejecutando tests..."
echo ""

# Ejecutar los tests
python3 test_e2e.py

