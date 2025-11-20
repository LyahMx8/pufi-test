# Guía de Ejecución de Tests E2E

## ⚠️ IMPORTANTE: Diferencia entre tipos de tests

El mensaje **"Incomplete: No specs found"** aparece cuando ejecutas `ng test` (tests unitarios de Angular), **NO** cuando ejecutas los tests de Selenium.

### Tipos de tests en este proyecto:

1. **Tests Unitarios de Angular** (`ng test`)
   - Archivos: `*.spec.ts` (ej: `cart.spec.ts`, `home.component.spec.ts`)
   - Framework: Jasmine/Karma
   - Ejecutar: `ng test`
   - Propósito: Probar componentes individuales

2. **Tests E2E con Selenium** (`python test_e2e.py`) ⭐ **ESTE ES EL QUE CREAMOS**
   - Archivo: `test_e2e.py`
   - Framework: Selenium WebDriver
   - Ejecutar: `python test_e2e.py` o usar los scripts `run_tests.bat` / `run_tests.sh`
   - Propósito: Probar la aplicación completa en el navegador

---

## 🚀 Ejecutar Tests E2E de Selenium

### Opción 1: Usando scripts (Recomendado)

**Windows:**
```bash
run_tests.bat
```

**Linux/Mac:**
```bash
chmod +x run_tests.sh
./run_tests.sh
```

### Opción 2: Manualmente

1. **Instalar dependencias de Python:**
   ```bash
   pip install -r requirements.txt
   ```
   
   Esto instalará:
   - `selenium` (framework de automatización)
   - `webdriver-manager` (gestiona ChromeDriver automáticamente)

2. **Ejecutar el test:**
   ```bash
   python test_e2e.py
   ```
   
   O en Windows:
   ```bash
   py test_e2e.py
   ```

### ¿Qué hace el test?

El test `test_e2e.py`:
- ✅ Abre el navegador Chrome
- ✅ Navega a `https://steelblue-nightingale-206388.hostingersite.com`
- ✅ Prueba 13 funcionalidades diferentes:
  - Carga de página
  - Banner superior
  - Búsqueda
  - Menú hamburguesa (móvil)
  - Menú principal (desktop)
  - Slideshow
  - Detalles del producto
  - Agregar al carrito
  - Funcionalidad del carrito
  - Formulario de contacto
  - Validación del formulario
  - Diseño responsive

### Solución de problemas

**Error: "Message: ... Stacktrace: ..." (Error al inicializar ChromeDriver)**
1. **Ejecuta el script de diagnóstico primero:**
   ```bash
   python test_chrome_setup.py
   ```
   Este script verificará tu configuración y te dirá qué está mal.

2. **Instala webdriver-manager (recomendado):**
   ```bash
   pip install webdriver-manager
   ```
   Esto descargará automáticamente la versión correcta de ChromeDriver.

3. **Verifica que Chrome esté instalado:**
   - Abre Chrome y verifica la versión en `chrome://version/`
   - Asegúrate de tener Chrome actualizado

4. **Si webdriver-manager no funciona, descarga ChromeDriver manualmente:**
   - Ve a: https://chromedriver.chromium.org/downloads
   - Descarga la versión que coincida con tu Chrome
   - Colócalo en una carpeta que esté en tu PATH
   - O colócalo en la misma carpeta que `test_e2e.py`

**Error: "No module named 'selenium'"**
- Ejecuta: `pip install -r requirements.txt`

**El navegador no se abre**
- Verifica que Chrome esté instalado
- En Windows, asegúrate de usar `python` o `py` según tu instalación
- Ejecuta `test_chrome_setup.py` para diagnosticar el problema

**Timeout al cargar la página**
- Verifica tu conexión a internet
- Verifica que la URL sea accesible: https://steelblue-nightingale-206388.hostingersite.com
- El sitio puede estar cargando lentamente, los timeouts están configurados a 15 segundos

---

## 📋 Tests Unitarios de Angular

Si quieres ejecutar los tests unitarios de Angular (los `.spec.ts`):

```bash
ng test
```

Estos tests verifican los componentes individuales, no la aplicación completa en el navegador.

