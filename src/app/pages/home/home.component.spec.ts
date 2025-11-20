import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CartService } from '@core/_services/cart.service';
import { CartUiService } from '@core/_services/cart-ui.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: jasmine.SpyObj<Router>;
  let meta: jasmine.SpyObj<Meta>;
  let title: jasmine.SpyObj<Title>;
  let cartService: jasmine.SpyObj<CartService>;
  let cartUiService: jasmine.SpyObj<CartUiService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      url: '/home'
    });
    const metaSpy = jasmine.createSpyObj('Meta', ['addTags']);
    const titleSpy = jasmine.createSpyObj('Title', ['setTitle']);
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['addItem']);
    const cartUiServiceSpy = jasmine.createSpyObj('CartUiService', ['open']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Meta, useValue: metaSpy },
        { provide: Title, useValue: titleSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: CartUiService, useValue: cartUiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    meta = TestBed.inject(Meta) as jasmine.SpyObj<Meta>;
    title = TestBed.inject(Title) as jasmine.SpyObj<Title>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    cartUiService = TestBed.inject(CartUiService) as jasmine.SpyObj<CartUiService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      expect(component.titleTxt).toBe('Home - bright-bogota Test');
      expect(component.description).toBe('En bright-bogota nos encargamos de brindarle la mejor atención a nuestros clientes');
      expect(component.featureImg).toBe('/assets/images/media/men-chatting.jpg');
      expect(component.slideIndex).toBe(1);
      expect(component.sizes).toEqual([34, 33, 32]);
      expect(component.selectedSize).toBeNull();
      expect(component.quantity).toBe(1);
    });

    it('should have slides array with correct structure', () => {
      expect(component.slides.length).toBe(5);
      expect(component.slides[0]).toEqual({
        src: '/assets/images/media/products/heel-01/front.webp',
        alt: 'Vista frontal'
      });
    });

    it('should set title and meta tags in constructor', () => {
      expect(title.setTitle).toHaveBeenCalledWith('Home - bright-bogota Test');
      expect(meta.addTags).toHaveBeenCalled();
    });

    it('should add correct meta tags', () => {
      const metaTags = meta.addTags.calls.mostRecent().args[0];
      expect(metaTags).toContain(jasmine.objectContaining({
        name: 'description',
        content: component.description
      }));
      expect(metaTags).toContain(jasmine.objectContaining({
        name: 'og:title',
        content: component.titleTxt
      }));
    });
  });

  describe('plusSlides', () => {
    it('should increment slide index by step', () => {
      component.slideIndex = 1;
      component.plusSlides(1);
      expect(component.slideIndex).toBe(2);
    });

    it('should decrement slide index by step', () => {
      component.slideIndex = 2;
      component.plusSlides(-1);
      expect(component.slideIndex).toBe(1);
    });

    it('should wrap to last slide when going before first', () => {
      component.slideIndex = 1;
      component.plusSlides(-1);
      expect(component.slideIndex).toBe(5);
    });

    it('should wrap to first slide when going after last', () => {
      component.slideIndex = 5;
      component.plusSlides(1);
      expect(component.slideIndex).toBe(1);
    });

    it('should handle multiple steps forward', () => {
      component.slideIndex = 1;
      component.plusSlides(3);
      expect(component.slideIndex).toBe(4);
    });
  });

  describe('currentSlide', () => {
    it('should set slide index to specified value', () => {
      component.currentSlide(3);
      expect(component.slideIndex).toBe(3);
    });

    it('should handle index 1', () => {
      component.currentSlide(1);
      expect(component.slideIndex).toBe(1);
    });

    it('should handle last slide index', () => {
      component.currentSlide(5);
      expect(component.slideIndex).toBe(5);
    });

    it('should wrap to last slide when index is greater than total', () => {
      component.currentSlide(10);
      expect(component.slideIndex).toBe(5);
    });

    it('should wrap to first slide when index is less than 1', () => {
      component.currentSlide(0);
      expect(component.slideIndex).toBe(5);
    });
  });

  describe('addToCart', () => {
    it('should add item to cart when size and quantity are valid', () => {
      component.selectedSize = 34;
      component.quantity = 2;
      
      component.addToCart();
      
      expect(cartService.addItem).toHaveBeenCalledWith({
        sku: '123456',
        name: 'Stiletto Essential 90',
        size: 34,
        price: 189900,
        quantity: 2,
        image: '/assets/images/media/products/heel-01/front.webp'
      });
      expect(cartUiService.open).toHaveBeenCalled();
    });

    it('should not add to cart when size is not selected', () => {
      component.selectedSize = null;
      component.quantity = 1;
      
      component.addToCart();
      
      expect(cartService.addItem).not.toHaveBeenCalled();
      expect(cartUiService.open).not.toHaveBeenCalled();
    });

    it('should not add to cart when quantity is less than 1', () => {
      component.selectedSize = 34;
      component.quantity = 0;
      
      component.addToCart();
      
      expect(cartService.addItem).not.toHaveBeenCalled();
      expect(cartUiService.open).not.toHaveBeenCalled();
    });

    it('should use first slide image when adding to cart', () => {
      component.selectedSize = 33;
      component.quantity = 1;
      
      component.addToCart();
      
      const callArgs = cartService.addItem.calls.mostRecent().args[0];
      expect(callArgs.image).toBe('/assets/images/media/products/heel-01/front.webp');
    });

    it('should use empty string for image if slides array is empty', () => {
      component.slides = [];
      component.selectedSize = 34;
      component.quantity = 1;
      
      component.addToCart();
      
      const callArgs = cartService.addItem.calls.mostRecent().args[0];
      expect(callArgs.image).toBe('');
    });
  });

  describe('onSizeChange', () => {
    it('should set selectedSize to parsed number', () => {
      const event = {
        target: { value: '34' }
      } as unknown as Event;
      
      component.onSizeChange(event);
      
      expect(component.selectedSize).toBe(34);
    });

    it('should set selectedSize to null when value is empty', () => {
      const event = {
        target: { value: '' }
      } as unknown as Event;
      
      component.onSizeChange(event);
      
      expect(component.selectedSize).toBeNull();
    });

    it('should handle different size values', () => {
      const event = {
        target: { value: '33' }
      } as unknown as Event;
      
      component.onSizeChange(event);
      
      expect(component.selectedSize).toBe(33);
    });
  });

  describe('onQuantityInput', () => {
    it('should update quantity with valid positive number', () => {
      const event = {
        target: { value: '5' }
      } as unknown as Event;
      
      component.onQuantityInput(event);
      
      expect(component.quantity).toBe(5);
    });

    it('should floor decimal numbers', () => {
      const event = {
        target: { value: '3.7' }
      } as unknown as Event;
      
      component.onQuantityInput(event);
      
      expect(component.quantity).toBe(3);
    });

    it('should set quantity to 1 for invalid input', () => {
      const event = {
        target: { value: 'abc' }
      } as unknown as Event;
      
      component.onQuantityInput(event);
      
      expect(component.quantity).toBe(1);
    });

    it('should set quantity to 1 for zero', () => {
      const event = {
        target: { value: '0' }
      } as unknown as Event;
      
      component.onQuantityInput(event);
      
      expect(component.quantity).toBe(1);
    });

    it('should set quantity to 1 for negative numbers', () => {
      const event = {
        target: { value: '-5' }
      } as unknown as Event;
      
      component.onQuantityInput(event);
      
      expect(component.quantity).toBe(1);
    });

    it('should ensure quantity is at least 1', () => {
      component.quantity = 0;
      const event = {
        target: { value: '0' }
      } as unknown as Event;
      
      component.onQuantityInput(event);
      
      expect(component.quantity).toBe(1);
    });

    it('should handle Infinity values', () => {
      const event = {
        target: { value: 'Infinity' }
      } as unknown as Event;
      
      component.onQuantityInput(event);
      
      expect(component.quantity).toBe(1);
    });
  });
});

