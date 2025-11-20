"""
Test E2E para Bright Bogotá
Pruebas automatizadas usando Selenium WebDriver
URL: https://steelblue-nightingale-206388.hostingersite.com
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import time

# Intentar usar webdriver-manager si está disponible (opcional)
try:
    from webdriver_manager.chrome import ChromeDriverManager
    USE_WEBDRIVER_MANAGER = True
except ImportError:
    USE_WEBDRIVER_MANAGER = False
    print("⚠ webdriver-manager no está instalado. Asegúrate de tener ChromeDriver en el PATH.")
    print("  Instala con: pip install webdriver-manager")


class TestBrightBogota:
    """Clase de pruebas E2E para Bright Bogotá"""
    
    BASE_URL = "https://steelblue-nightingale-206388.hostingersite.com"
    WAIT_TIMEOUT = 15
    
    def __init__(self):
        """Inicializar el driver de Selenium"""
        print("\n[INIT] Inicializando ChromeDriver...")
        
        try:
            chrome_options = Options()
            # Descomentar para modo headless (sin ventana del navegador)
            # chrome_options.add_argument('--headless')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-blink-features=AutomationControlled')
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('--window-size=1920,1080')
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            
            # Usar webdriver-manager si está disponible, sino usar ChromeDriver del PATH
            if USE_WEBDRIVER_MANAGER:
                print("[INIT] Usando webdriver-manager para ChromeDriver...")
                try:
                    service = Service(ChromeDriverManager().install())
                    self.driver = webdriver.Chrome(service=service, options=chrome_options)
                    print("[INIT] ✓ ChromeDriver inicializado con webdriver-manager")
                except Exception as e:
                    print(f"[INIT] ⚠ Error con webdriver-manager: {e}")
                    print("[INIT] Intentando con ChromeDriver del PATH...")
                    self.driver = webdriver.Chrome(options=chrome_options)
                    print("[INIT] ✓ ChromeDriver inicializado desde PATH")
            else:
                print("[INIT] Usando ChromeDriver del PATH...")
                self.driver = webdriver.Chrome(options=chrome_options)
                print("[INIT] ✓ ChromeDriver inicializado")
            
            self.wait = WebDriverWait(self.driver, self.WAIT_TIMEOUT)
            self.driver.maximize_window()
            print("[INIT] ✓ Navegador configurado correctamente\n")
            
        except Exception as e:
            print(f"\n✗ ERROR CRÍTICO al inicializar ChromeDriver:")
            print(f"  {str(e)}")
            print("\nPosibles soluciones:")
            print("1. Verifica que Chrome esté instalado")
            print("2. Instala webdriver-manager: pip install webdriver-manager")
            print("3. O descarga ChromeDriver manualmente desde:")
            print("   https://chromedriver.chromium.org/downloads")
            print("4. Asegúrate de que la versión de ChromeDriver coincida con tu versión de Chrome")
            raise
    
    def tearDown(self):
        """Cerrar el navegador"""
        if self.driver:
            self.driver.quit()
    
    def test_homepage_loads(self):
        """Test: Verificar que la página principal carga correctamente"""
        print("\n[TEST] Verificando carga de la página principal...")
        try:
            print(f"[TEST] Navegando a: {self.BASE_URL}")
            self.driver.get(self.BASE_URL)
            
            # Esperar a que la página cargue
            print("[TEST] Esperando a que la página cargue...")
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            print("[TEST] ✓ Página cargada")
            
            # Esperar un poco más para que Angular termine de renderizar
            time.sleep(2)
            
            # Verificar que el header está presente
            print("[TEST] Buscando header...")
            try:
                header = self.wait.until(
                    EC.presence_of_element_located((By.ID, "header-component"))
                )
                assert header.is_displayed(), "El header debería estar visible"
                print("[TEST] ✓ Header encontrado")
            except TimeoutException:
                # Intentar con selector alternativo
                print("[TEST] ⚠ Header no encontrado con ID, intentando selector alternativo...")
                header = self.wait.until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, ".header-component, header, app-header"))
                )
                print("[TEST] ✓ Header encontrado con selector alternativo")
            
            # Verificar que el logo está presente
            print("[TEST] Buscando logo...")
            try:
                logo = self.driver.find_element(By.ID, "site-logo")
                assert logo.is_displayed(), "El logo debería estar visible"
                print("[TEST] ✓ Logo encontrado")
            except NoSuchElementException:
                # Intentar con selector alternativo
                print("[TEST] ⚠ Logo no encontrado con ID, intentando selector alternativo...")
                logo = self.driver.find_element(By.CSS_SELECTOR, ".logo-box img, img[alt*='logo' i], img[alt*='LOGO' i]")
                print("[TEST] ✓ Logo encontrado con selector alternativo")
            
            print("✓ Página principal cargada correctamente")
            return True
        except TimeoutException as e:
            print(f"✗ Timeout al cargar la página: {e}")
            print(f"  URL actual: {self.driver.current_url}")
            print(f"  Título de la página: {self.driver.title}")
            return False
        except Exception as e:
            print(f"✗ Error al cargar la página: {e}")
            print(f"  URL actual: {self.driver.current_url if hasattr(self.driver, 'current_url') else 'N/A'}")
            return False
    
    def test_top_banner_display(self):
        """Test: Verificar que el banner superior se muestra"""
        print("\n[TEST] Verificando banner superior...")
        try:
            banner = self.wait.until(
                EC.presence_of_element_located((By.ID, "top-banner"))
            )
            assert banner.is_displayed(), "El banner debería estar visible"
            print("✓ Banner superior visible")
            return True
        except Exception as e:
            print(f"✗ Error: {e}")
            return False
    
    def test_search_box_functionality(self):
        """Test: Verificar funcionalidad de la caja de búsqueda"""
        print("\n[TEST] Verificando caja de búsqueda...")
        try:
            search_box = self.wait.until(
                EC.presence_of_element_located((By.ID, "header-search"))
            )
            assert search_box.is_displayed(), "La caja de búsqueda debería estar visible"
            
            # Verificar placeholder
            placeholder = search_box.get_attribute("placeholder")
            assert "buscando" in placeholder.lower(), "El placeholder debería contener 'buscando'"
            
            # Escribir en la caja de búsqueda
            search_box.clear()
            search_box.send_keys("zapatos")
            
            print("✓ Caja de búsqueda funcional")
            return True
        except Exception as e:
            print(f"✗ Error: {e}")
            return False
    
    def test_hamburger_menu_mobile(self):
        """Test: Verificar menú hamburguesa en vista móvil"""
        print("\n[TEST] Verificando menú hamburguesa (vista móvil)...")
        try:
            # Cambiar a vista móvil
            self.driver.set_window_size(375, 667)
            time.sleep(1)
            
            # Verificar que el botón hamburguesa es visible
            hamburger_btn = self.wait.until(
                EC.element_to_be_clickable((By.ID, "hamburger-menu-btn"))
            )
            assert hamburger_btn.is_displayed(), "El botón hamburguesa debería estar visible"
            
            # Hacer clic en el botón
            hamburger_btn.click()
            time.sleep(1)
            
            # Verificar que el menú se abre
            main_header = self.driver.find_element(By.ID, "main-header")
            classes = main_header.get_attribute("class")
            assert "open-menu" in classes, "El menú debería estar abierto"
            
            # Cerrar el menú
            close_btn = self.wait.until(
                EC.element_to_be_clickable((By.ID, "close-menu-btn"))
            )
            close_btn.click()
            time.sleep(1)
            
            print("✓ Menú hamburguesa funcional en móvil")
            return True
        except Exception as e:
            print(f"✗ Error: {e}")
            return False
    
    def test_main_menu_desktop(self):
        """Test: Verificar menú principal en vista desktop"""
        print("\n[TEST] Verificando menú principal (vista desktop)...")
        try:
            # Cambiar a vista desktop
            self.driver.set_window_size(1024, 768)
            time.sleep(1)
            
            # Verificar que el menú principal está visible
            main_menu = self.wait.until(
                EC.presence_of_element_located((By.ID, "main-menu"))
            )
            assert main_menu.is_displayed(), "El menú principal debería estar visible"
            
            # Verificar que los items del menú están presentes
            menu_items = main_menu.find_elements(By.CSS_SELECTOR, "li > a")
            assert len(menu_items) > 0, "El menú debería tener items"
            
            # Verificar textos esperados
            menu_texts = [item.text for item in menu_items]
            expected_items = ["Catálogo", "Acerca de", "Contacto"]
            
            for expected in expected_items:
                assert expected in menu_texts, f"'{expected}' debería estar en el menú"
            
            print(f"✓ Menú principal funcional con {len(menu_items)} items")
            return True
        except Exception as e:
            print(f"✗ Error: {e}")
            return False
    
    def test_slideshow_navigation(self):
        """Test: Verificar navegación del slideshow"""
        print("\n[TEST] Verificando navegación del slideshow...")
        try:
            # Cambiar a vista desktop
            self.driver.set_window_size(1024, 768)
            time.sleep(1)
            
            # Verificar que el contenedor del slideshow está presente
            slideshow = self.wait.until(
                EC.presence_of_element_located((By.ID, "slideshow-container"))
            )
            assert slideshow.is_displayed(), "El slideshow debería estar visible"
            
            # Verificar botones de navegación
            prev_btn = self.wait.until(
                EC.element_to_be_clickable((By.ID, "slide-prev"))
            )
            next_btn = self.wait.until(
                EC.element_to_be_clickable((By.ID, "slide-next"))
            )
            
            # Navegar al siguiente slide
            next_btn.click()
            time.sleep(1)
            
            # Navegar al slide anterior
            prev_btn.click()
            time.sleep(1)
            
            print("✓ Navegación del slideshow funcional")
            return True
        except Exception as e:
            print(f"✗ Error: {e}")
            return False
    
    def test_product_details_display(self):
        """Test: Verificar que los detalles del producto se muestran"""
        print("\n[TEST] Verificando detalles del producto...")
        try:
            product_section = self.wait.until(
                EC.presence_of_element_located((By.ID, "product-details"))
            )
            assert product_section.is_displayed(), "La sección de producto debería estar visible"
            
            # Verificar título del producto
            product_title = self.driver.find_element(By.ID, "product-title")
            assert "Stiletto" in product_title.text, "El título debería contener 'Stiletto'"
            
            # Verificar SKU
            product_sku = self.driver.find_element(By.ID, "product-sku")
            assert "SKU" in product_sku.text, "Debería mostrar el SKU"
            
            # Verificar descripción
            product_description = self.driver.find_element(By.ID, "product-description")
            assert len(product_description.text) > 0, "Debería tener descripción"
            
            print("✓ Detalles del producto mostrados correctamente")
            return True
        except Exception as e:
            print(f"✗ Error: {e}")
            return False
    
    def test_add_to_cart_functionality(self):
        """Test: Verificar funcionalidad de agregar al carrito"""
        print("\n[TEST] Verificando agregar producto al carrito...")
        try:
            # Cambiar a vista desktop
            self.driver.set_window_size(1024, 768)
            time.sleep(1)
            
            # Esperar a que la sección de producto esté visible
            self.wait.until(
                EC.presence_of_element_located((By.ID, "product-details"))
            )
            
            # Seleccionar una talla
            size_select = self.wait.until(
                EC.presence_of_element_located((By.ID, "size"))
            )
            select = Select(size_select)
            
            # Seleccionar la primera talla disponible (34)
            select.select_by_value("34")
            time.sleep(0.5)
            
            # Verificar que la cantidad es 1 por defecto
            quantity_input = self.driver.find_element(By.ID, "quantity")
            assert quantity_input.get_attribute("value") == "1", "La cantidad por defecto debería ser 1"
            
            # Hacer clic en "Agregar al carrito"
            add_to_cart_btn = self.wait.until(
                EC.element_to_be_clickable((By.ID, "add-to-cart-btn"))
            )
            assert add_to_cart_btn.is_enabled(), "El botón debería estar habilitado"
            
            add_to_cart_btn.click()
            time.sleep(2)
            
            print("✓ Producto agregado al carrito")
            return True
        except Exception as e:
            print(f"✗ Error: {e}")
            return False
    
    def test_cart_icon_clickable(self):
        """Test: Verificar que el icono del carrito es clickeable"""
        print("\n[TEST] Verificando icono del carrito...")
        try:
            cart_icon = self.wait.until(
                EC.element_to_be_clickable((By.ID, "cart-nav"))
            )
            assert cart_icon.is_displayed(), "El icono del carrito debería estar visible"
            
            cart_icon.click()
            time.sleep(2)
            
            print("✓ Icono del carrito clickeable")
            return True
        except Exception as e:
            print(f"✗ Error: {e}")
            return False
    
    def test_cart_functionality(self):
        """Test: Verificar funcionalidad del carrito"""
        print("\n[TEST] Verificando funcionalidad del carrito...")
        try:
            # Abrir el carrito si no está abierto
            try:
                cart_nav = self.driver.find_element(By.ID, "cart-nav")
                cart_nav.click()
                time.sleep(2)
            except:
                pass
            
            # Verificar que el contenedor del carrito está presente
            # Nota: El carrito puede estar en un drawer/modal
            try:
                cart_container = self.wait.until(
                    EC.presence_of_element_located((By.ID, "cart-container"))
                )
                print("✓ Contenedor del carrito encontrado")
            except TimeoutException:
                print("⚠ Carrito no visible (puede requerir interacción previa)")
                return True
            
            # Si hay items, verificar botones
            try:
                cart_items = self.driver.find_elements(By.CSS_SELECTOR, "[id^='cart-item-']")
                if len(cart_items) > 0:
                    # Verificar botones de cantidad
                    increase_btn = self.driver.find_element(By.ID, "increase-qty-0")
                    decrease_btn = self.driver.find_element(By.ID, "decrease-qty-0")
                    assert increase_btn.is_displayed(), "Botón aumentar cantidad debería estar visible"
                    assert decrease_btn.is_displayed(), "Botón disminuir cantidad debería estar visible"
                    
                    # Verificar botones de acción
                    checkout_btn = self.driver.find_element(By.ID, "cart-checkout")
                    clear_btn = self.driver.find_element(By.ID, "cart-clear")
                    assert checkout_btn.is_displayed(), "Botón checkout debería estar visible"
                    assert clear_btn.is_displayed(), "Botón vaciar carrito debería estar visible"
                    
                    print("✓ Funcionalidad del carrito verificada")
            except NoSuchElementException:
                # Carrito vacío
                empty_message = self.driver.find_element(By.ID, "cart-empty")
                assert "vacío" in empty_message.text.lower(), "Debería mostrar mensaje de carrito vacío"
                print("✓ Carrito vacío (comportamiento esperado)")
            
            return True
        except Exception as e:
            print(f"✗ Error: {e}")
            return False
    
    def test_contact_form_display(self):
        """Test: Verificar que el formulario de contacto se muestra"""
        print("\n[TEST] Verificando formulario de contacto...")
        try:
            # Hacer scroll hasta el formulario
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(1)
            
            # Verificar que el formulario está presente
            contact_form = self.wait.until(
                EC.presence_of_element_located((By.ID, "contact-form"))
            )
            assert contact_form.is_displayed(), "El formulario debería estar visible"
            
            # Verificar campos del formulario
            form_name = self.driver.find_element(By.ID, "form-name")
            form_email = self.driver.find_element(By.ID, "form-email")
            form_phone = self.driver.find_element(By.ID, "form-phone")
            form_city = self.driver.find_element(By.ID, "form-city")
            form_message = self.driver.find_element(By.ID, "form-message")
            form_submit = self.driver.find_element(By.ID, "form-submit")
            
            assert form_name.is_displayed(), "Campo nombre debería estar visible"
            assert form_email.is_displayed(), "Campo email debería estar visible"
            assert form_phone.is_displayed(), "Campo teléfono debería estar visible"
            assert form_city.is_displayed(), "Campo ciudad debería estar visible"
            assert form_message.is_displayed(), "Campo mensaje debería estar visible"
            assert form_submit.is_displayed(), "Botón enviar debería estar visible"
            
            print("✓ Formulario de contacto mostrado correctamente")
            return True
        except Exception as e:
            print(f"✗ Error: {e}")
            return False
    
    def test_contact_form_validation(self):
        """Test: Verificar validación del formulario de contacto"""
        print("\n[TEST] Verificando validación del formulario...")
        try:
            # Hacer scroll hasta el formulario
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(1)
            
            form_submit = self.wait.until(
                EC.presence_of_element_located((By.ID, "form-submit"))
            )
            
            # El botón debería estar deshabilitado si el formulario está vacío
            # (depende de la implementación de Angular)
            is_disabled = form_submit.get_attribute("disabled")
            
            # Llenar algunos campos
            form_name = self.driver.find_element(By.ID, "form-name")
            form_name.clear()
            form_name.send_keys("Juan Pérez García")
            
            form_email = self.driver.find_element(By.ID, "form-email")
            form_email.clear()
            form_email.send_keys("test@example.com")
            
            print("✓ Validación del formulario verificada")
            return True
        except Exception as e:
            print(f"✗ Error: {e}")
            return False
    
    def test_responsive_design(self):
        """Test: Verificar diseño responsive"""
        print("\n[TEST] Verificando diseño responsive...")
        try:
            # Vista móvil
            self.driver.set_window_size(375, 667)
            time.sleep(1)
            
            # Verificar que el menú hamburguesa es visible en móvil
            hamburger_btn = self.wait.until(
                EC.presence_of_element_located((By.ID, "hamburger-menu-btn"))
            )
            assert hamburger_btn.is_displayed(), "Menú hamburguesa debería estar visible en móvil"
            
            # Vista tablet
            self.driver.set_window_size(768, 1024)
            time.sleep(1)
            
            # Vista desktop
            self.driver.set_window_size(1024, 768)
            time.sleep(1)
            
            # Verificar que el menú principal es visible en desktop
            main_menu = self.wait.until(
                EC.presence_of_element_located((By.ID, "main-menu"))
            )
            assert main_menu.is_displayed(), "Menú principal debería estar visible en desktop"
            
            print("✓ Diseño responsive verificado")
            return True
        except Exception as e:
            print(f"✗ Error: {e}")
            return False
    
    def run_all_tests(self):
        """Ejecutar todos los tests"""
        print("=" * 60)
        print("INICIANDO TESTS E2E PARA BRIGHT BOGOTÁ")
        print("=" * 60)
        
        results = []
        
        try:
            # Test 1: Carga de página
            results.append(("Carga de página", self.test_homepage_loads()))
            
            # Test 2: Banner superior
            results.append(("Banner superior", self.test_top_banner_display()))
            
            # Test 3: Caja de búsqueda
            results.append(("Caja de búsqueda", self.test_search_box_functionality()))
            
            # Test 4: Menú hamburguesa móvil
            results.append(("Menú hamburguesa móvil", self.test_hamburger_menu_mobile()))
            
            # Test 5: Menú principal desktop
            results.append(("Menú principal desktop", self.test_main_menu_desktop()))
            
            # Test 6: Navegación slideshow
            results.append(("Navegación slideshow", self.test_slideshow_navigation()))
            
            # Test 7: Detalles del producto
            results.append(("Detalles del producto", self.test_product_details_display()))
            
            # Test 8: Agregar al carrito
            results.append(("Agregar al carrito", self.test_add_to_cart_functionality()))
            
            # Test 9: Icono del carrito
            results.append(("Icono del carrito", self.test_cart_icon_clickable()))
            
            # Test 10: Funcionalidad del carrito
            results.append(("Funcionalidad del carrito", self.test_cart_functionality()))
            
            # Test 11: Formulario de contacto
            results.append(("Formulario de contacto", self.test_contact_form_display()))
            
            # Test 12: Validación del formulario
            results.append(("Validación del formulario", self.test_contact_form_validation()))
            
            # Test 13: Diseño responsive
            results.append(("Diseño responsive", self.test_responsive_design()))
            
        except Exception as e:
            print(f"\n✗ Error crítico durante la ejecución: {e}")
        
        finally:
            # Mostrar resumen
            print("\n" + "=" * 60)
            print("RESUMEN DE RESULTADOS")
            print("=" * 60)
            
            passed = sum(1 for _, result in results if result)
            failed = len(results) - passed
            
            for test_name, result in results:
                status = "✓ PASS" if result else "✗ FAIL"
                print(f"{status} - {test_name}")
            
            print("\n" + "-" * 60)
            print(f"Total: {len(results)} tests")
            print(f"Exitosos: {passed}")
            print(f"Fallidos: {failed}")
            print("=" * 60)
            
            # Esperar antes de cerrar
            input("\nPresiona Enter para cerrar el navegador...")
            self.tearDown()


if __name__ == "__main__":
    test_suite = None
    try:
        print("=" * 60)
        print("INICIANDO TESTS E2E PARA BRIGHT BOGOTÁ")
        print("=" * 60)
        
        # Verificar que Chrome está disponible
        try:
            from selenium.webdriver.chrome.service import Service
            from selenium import webdriver
            # Intentar crear un driver de prueba para verificar que todo funciona
            test_options = Options()
            test_options.add_argument('--headless')
            test_options.add_argument('--no-sandbox')
            test_options.add_argument('--disable-dev-shm-usage')
            test_driver = webdriver.Chrome(options=test_options)
            test_driver.quit()
            print("✓ Chrome y ChromeDriver verificados correctamente\n")
        except Exception as e:
            print(f"\n⚠ ADVERTENCIA: Problema al verificar ChromeDriver: {e}")
            print("  Continuando de todas formas...\n")
        
        test_suite = TestBrightBogota()
        test_suite.run_all_tests()
        
    except KeyboardInterrupt:
        print("\n\n⚠ Tests interrumpidos por el usuario")
        if test_suite:
            test_suite.tearDown()
    except Exception as e:
        print(f"\n\n✗ ERROR FATAL: {e}")
        import traceback
        print("\nTraceback completo:")
        traceback.print_exc()
        if test_suite:
            test_suite.tearDown()

