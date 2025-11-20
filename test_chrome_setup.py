"""
Script de diagnóstico para verificar la configuración de Chrome y ChromeDriver
Ejecuta este script primero si tienes problemas con test_e2e.py
"""

import sys

def check_chrome():
    """Verificar que Chrome está instalado"""
    print("=" * 60)
    print("DIAGNÓSTICO DE CONFIGURACIÓN DE SELENIUM")
    print("=" * 60)
    print()
    
    # 1. Verificar Python
    print("[1] Verificando Python...")
    print(f"    Versión: {sys.version}")
    print("    ✓ Python OK")
    print()
    
    # 2. Verificar Selenium
    print("[2] Verificando Selenium...")
    try:
        import selenium
        print(f"    Versión: {selenium.__version__}")
        print("    ✓ Selenium instalado")
    except ImportError:
        print("    ✗ Selenium NO está instalado")
        print("    Instala con: pip install selenium")
        return False
    print()
    
    # 3. Verificar webdriver-manager
    print("[3] Verificando webdriver-manager...")
    try:
        from webdriver_manager.chrome import ChromeDriverManager
        print("    ✓ webdriver-manager instalado")
        print("    (Se usará para descargar ChromeDriver automáticamente)")
    except ImportError:
        print("    ⚠ webdriver-manager NO está instalado")
        print("    (Se intentará usar ChromeDriver del PATH)")
        print("    Recomendado: pip install webdriver-manager")
    print()
    
    # 4. Verificar Chrome
    print("[4] Verificando Chrome...")
    import subprocess
    import platform
    
    try:
        if platform.system() == "Windows":
            result = subprocess.run(
                ['reg', 'query', 'HKEY_CURRENT_USER\\Software\\Google\\Chrome\\BLBeacon', '/v', 'version'],
                capture_output=True, text=True, timeout=5
            )
            if result.returncode == 0:
                version = result.stdout.split()[-1] if result.stdout else "Desconocida"
                print(f"    Versión encontrada: {version}")
                print("    ✓ Chrome está instalado")
            else:
                # Intentar otra forma
                import winreg
                try:
                    key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, 
                                       r"SOFTWARE\Google\Chrome\BLBeacon")
                    version = winreg.QueryValueEx(key, "version")[0]
                    print(f"    Versión: {version}")
                    print("    ✓ Chrome está instalado")
                except:
                    print("    ⚠ No se pudo verificar la versión de Chrome")
                    print("    Asegúrate de que Chrome esté instalado")
        else:
            # Linux/Mac
            result = subprocess.run(
                ['google-chrome', '--version'],
                capture_output=True, text=True, timeout=5
            )
            if result.returncode == 0:
                print(f"    {result.stdout.strip()}")
                print("    ✓ Chrome está instalado")
            else:
                print("    ⚠ No se pudo verificar Chrome")
                print("    Asegúrate de que Chrome esté instalado")
    except Exception as e:
        print(f"    ⚠ Error al verificar Chrome: {e}")
    print()
    
    # 5. Probar ChromeDriver
    print("[5] Probando ChromeDriver...")
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from selenium.webdriver.chrome.service import Service
        
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        
        # Intentar con webdriver-manager primero
        try:
            from webdriver_manager.chrome import ChromeDriverManager
            print("    Intentando con webdriver-manager...")
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=chrome_options)
            print("    ✓ ChromeDriver funciona con webdriver-manager")
            driver.quit()
        except ImportError:
            print("    Intentando con ChromeDriver del PATH...")
            driver = webdriver.Chrome(options=chrome_options)
            print("    ✓ ChromeDriver funciona desde PATH")
            driver.quit()
        
        print("    ✓ ChromeDriver está funcionando correctamente")
        
    except Exception as e:
        print(f"    ✗ ERROR con ChromeDriver: {e}")
        print()
        print("    SOLUCIONES:")
        print("    1. Instala webdriver-manager: pip install webdriver-manager")
        print("    2. O descarga ChromeDriver manualmente desde:")
        print("       https://chromedriver.chromium.org/downloads")
        print("    3. Asegúrate de que la versión coincida con tu Chrome")
        return False
    
    print()
    print("=" * 60)
    print("✓ TODAS LAS VERIFICACIONES PASARON")
    print("  Puedes ejecutar test_e2e.py ahora")
    print("=" * 60)
    return True

if __name__ == "__main__":
    try:
        success = check_chrome()
        if not success:
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n\nDiagnóstico interrumpido por el usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\n\nError durante el diagnóstico: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

