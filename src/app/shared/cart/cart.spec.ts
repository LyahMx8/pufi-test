import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart';
import { CartService, CartItem } from '../../_services/cart.service';
import { BehaviorSubject } from 'rxjs';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: jasmine.SpyObj<CartService>;
  let itemsSubject: BehaviorSubject<CartItem[]>;

  const mockItems: CartItem[] = [
    {
      sku: '123456',
      name: 'Stiletto Essential 90',
      size: 34,
      price: 189900,
      quantity: 2,
      image: '/assets/images/media/products/heel-01/front.webp'
    }
  ];

  beforeEach(async () => {
    itemsSubject = new BehaviorSubject<CartItem[]>([]);
    
    const cartServiceSpy = jasmine.createSpyObj('CartService', [
      'increase',
      'decrease',
      'updateQuantity',
      'remove',
      'clear'
    ], {
      items$: itemsSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: CartService, useValue: cartServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with empty items array', () => {
      expect(component.items).toEqual([]);
    });

    it('should subscribe to cart service items$', () => {
      itemsSubject.next(mockItems);
      fixture.detectChanges();
      expect(component.items).toEqual(mockItems);
    });
  });

  describe('increase', () => {
    it('should call cart service increase with correct item', () => {
      itemsSubject.next(mockItems);
      fixture.detectChanges();
      
      component.increase(0);
      
      expect(cartService.increase).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should not call increase if index is out of bounds', () => {
      itemsSubject.next(mockItems);
      fixture.detectChanges();
      
      component.increase(10);
      
      expect(cartService.increase).not.toHaveBeenCalled();
    });

    it('should not call increase if item is undefined', () => {
      itemsSubject.next([]);
      fixture.detectChanges();
      
      component.increase(0);
      
      expect(cartService.increase).not.toHaveBeenCalled();
    });
  });

  describe('decrease', () => {
    it('should call cart service decrease with correct item', () => {
      itemsSubject.next(mockItems);
      fixture.detectChanges();
      
      component.decrease(0);
      
      expect(cartService.decrease).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should not call decrease if index is out of bounds', () => {
      itemsSubject.next(mockItems);
      fixture.detectChanges();
      
      component.decrease(10);
      
      expect(cartService.decrease).not.toHaveBeenCalled();
    });

    it('should not call decrease if item is undefined', () => {
      itemsSubject.next([]);
      fixture.detectChanges();
      
      component.decrease(0);
      
      expect(cartService.decrease).not.toHaveBeenCalled();
    });
  });

  describe('onQtyInput', () => {
    it('should update quantity with valid positive number', () => {
      itemsSubject.next(mockItems);
      fixture.detectChanges();
      
      const event = {
        target: { value: '5' }
      } as unknown as Event;
      
      component.onQtyInput(0, event);
      
      expect(cartService.updateQuantity).toHaveBeenCalledWith(mockItems[0], 5);
    });

    it('should floor decimal numbers', () => {
      itemsSubject.next(mockItems);
      fixture.detectChanges();
      
      const event = {
        target: { value: '3.7' }
      } as unknown as Event;
      
      component.onQtyInput(0, event);
      
      expect(cartService.updateQuantity).toHaveBeenCalledWith(mockItems[0], 3);
    });

    it('should set quantity to 1 for invalid input', () => {
      itemsSubject.next(mockItems);
      fixture.detectChanges();
      
      const event = {
        target: { value: 'abc' }
      } as unknown as Event;
      
      component.onQtyInput(0, event);
      
      expect(cartService.updateQuantity).toHaveBeenCalledWith(mockItems[0], 1);
    });

    it('should set quantity to 1 for zero or negative numbers', () => {
      itemsSubject.next(mockItems);
      fixture.detectChanges();
      
      const event = {
        target: { value: '0' }
      } as unknown as Event;
      
      component.onQtyInput(0, event);
      
      expect(cartService.updateQuantity).toHaveBeenCalledWith(mockItems[0], 1);
    });

    it('should not call updateQuantity if index is out of bounds', () => {
      itemsSubject.next(mockItems);
      fixture.detectChanges();
      
      const event = {
        target: { value: '5' }
      } as unknown as Event;
      
      component.onQtyInput(10, event);
      
      expect(cartService.updateQuantity).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call cart service remove with correct item', () => {
      itemsSubject.next(mockItems);
      fixture.detectChanges();
      
      component.remove(0);
      
      expect(cartService.remove).toHaveBeenCalledWith(mockItems[0]);
    });

    it('should not call remove if index is out of bounds', () => {
      itemsSubject.next(mockItems);
      fixture.detectChanges();
      
      component.remove(10);
      
      expect(cartService.remove).not.toHaveBeenCalled();
    });

    it('should not call remove if item is undefined', () => {
      itemsSubject.next([]);
      fixture.detectChanges();
      
      component.remove(0);
      
      expect(cartService.remove).not.toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('should call cart service clear', () => {
      component.clear();
      
      expect(cartService.clear).toHaveBeenCalled();
    });
  });

  describe('subtotal', () => {
    it('should calculate subtotal correctly for multiple items', () => {
      itemsSubject.next(mockItems);
      fixture.detectChanges();
      
      const expected = (189900 * 2) + (150000 * 1);
      expect(component.subtotal()).toBe(expected);
    });

    it('should return 0 for empty cart', () => {
      itemsSubject.next([]);
      fixture.detectChanges();
      
      expect(component.subtotal()).toBe(0);
    });

    it('should calculate subtotal correctly for single item', () => {
      itemsSubject.next([mockItems[0]]);
      fixture.detectChanges();
      
      expect(component.subtotal()).toBe(189900 * 2);
    });
  });

  describe('checkout', () => {
    it('should log checkout payload with correct structure', () => {
      itemsSubject.next(mockItems);
      fixture.detectChanges();
      
      const consoleSpy = spyOn(console, 'log');
      const expectedPayload = {
        items: [
          { sku: '123456', size: 34, qty: 2 },
          { sku: '789012', size: 33, qty: 1 }
        ],
        total: component.subtotal()
      };
      
      component.checkout();
      
      expect(consoleSpy).toHaveBeenCalledWith('checkout', expectedPayload);
    });

    it('should include correct total in checkout payload', () => {
      itemsSubject.next(mockItems);
      fixture.detectChanges();
      
      const consoleSpy = spyOn(console, 'log');
      const expectedTotal = component.subtotal();
      
      component.checkout();
      
      const callArgs = consoleSpy.calls.mostRecent().args;
      expect(callArgs[1].total).toBe(expectedTotal);
    });

    it('should handle empty cart in checkout', () => {
      itemsSubject.next([]);
      fixture.detectChanges();
      
      const consoleSpy = spyOn(console, 'log');
      
      component.checkout();
      
      expect(consoleSpy).toHaveBeenCalledWith('checkout', {
        items: [],
        total: 0
      });
    });
  });
});
