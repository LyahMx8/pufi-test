import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '@core/_services/form.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Form } from '@core/_models/form';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let formService: jasmine.SpyObj<FormService>;
  let formBuilder: FormBuilder;

  const mockFormData = {
    name: 'JuanPerezGarcia',
    email: 'juan.perez@example.com',
    phone: '3001234567',
    city: 'Bogota',
    message: 'A123456789'
  };

  const mockFormResponse: Form = {
    email: 'juan.perez@example.com',
    id: 1,
    mobile: 3001234567,
    city: 'Bogota',
    message: 'A123456789'
  };

  beforeEach(async () => {
    const formServiceSpy = jasmine.createSpyObj('FormService', ['postContactForm']);

    await TestBed.configureTestingModule({
      imports: [FormComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: FormService, useValue: formServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    formService = TestBed.inject(FormService) as jasmine.SpyObj<FormService>;
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.loading).toBe(false);
      expect(component.thankYou).toBe(false);
      expect(component.error).toBeUndefined();
    });

    it('should create form on ngOnInit', () => {
      component.ngOnInit();
      expect(component.userForm).toBeDefined();
    });

    it('should have all form controls', () => {
      component.ngOnInit();
      expect(component.userForm.get('name')).toBeTruthy();
      expect(component.userForm.get('email')).toBeTruthy();
      expect(component.userForm.get('phone')).toBeTruthy();
      expect(component.userForm.get('city')).toBeTruthy();
      expect(component.userForm.get('message')).toBeTruthy();
    });
  });

  describe('Form Validation - Name', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should require name field', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('');
      expect(nameControl?.hasError('required')).toBe(true);
    });

    it('should validate name pattern (only letters)', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('Juan123');
      expect(nameControl?.hasError('pattern')).toBe(true);
    });

    it('should accept valid name with only letters (no spaces)', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('JuanPerezGarcia');
      expect(nameControl?.valid).toBe(true);
    });

    it('should reject name with spaces', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('Juan Pérez García');
      expect(nameControl?.hasError('pattern')).toBe(true);
    });

    it('should reject name with numbers', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('Juan123');
      expect(nameControl?.hasError('pattern')).toBe(true);
    });

    it('should validate name min length (10)', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('Juan');
      expect(nameControl?.hasError('minlength')).toBe(true);
    });

    it('should validate name max length (500)', () => {
      const nameControl = component.userForm.get('name');
      nameControl?.setValue('a'.repeat(501));
      expect(nameControl?.hasError('maxlength')).toBe(true);
    });
  });

  describe('Form Validation - Email', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should require email field', () => {
      const emailControl = component.userForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.userForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);
    });

    it('should accept valid email', () => {
      const emailControl = component.userForm.get('email');
      emailControl?.setValue('test@example.com');
      expect(emailControl?.valid).toBe(true);
    });

    it('should validate email pattern', () => {
      const emailControl = component.userForm.get('email');
      emailControl?.setValue('invalid@');
      expect(emailControl?.hasError('pattern')).toBe(true);
    });
  });

  describe('Form Validation - Phone', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should require phone field', () => {
      const phoneControl = component.userForm.get('phone');
      phoneControl?.setValue('');
      expect(phoneControl?.hasError('required')).toBe(true);
    });

    it('should validate phone pattern (digits only, no leading zero)', () => {
      const phoneControl = component.userForm.get('phone');
      phoneControl?.setValue('0123456789');
      expect(phoneControl?.hasError('pattern')).toBe(true);
    });

    it('should accept valid phone number', () => {
      const phoneControl = component.userForm.get('phone');
      phoneControl?.setValue('3001234567');
      expect(phoneControl?.valid).toBe(true);
    });

    it('should validate phone min length (7)', () => {
      const phoneControl = component.userForm.get('phone');
      phoneControl?.setValue('123456');
      expect(phoneControl?.hasError('minlength')).toBe(true);
    });

    it('should validate phone max length (10)', () => {
      const phoneControl = component.userForm.get('phone');
      phoneControl?.setValue('12345678901');
      expect(phoneControl?.hasError('maxlength')).toBe(true);
    });
  });

  describe('Form Validation - City', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should require city field', () => {
      const cityControl = component.userForm.get('city');
      cityControl?.setValue('');
      expect(cityControl?.hasError('required')).toBe(true);
    });

    it('should validate city pattern (only letters)', () => {
      const cityControl = component.userForm.get('city');
      cityControl?.setValue('Bogotá123');
      expect(cityControl?.hasError('pattern')).toBe(true);
    });

    it('should accept valid city with only letters (no spaces or accents)', () => {
      const cityControl = component.userForm.get('city');
      cityControl?.setValue('Bogota');
      expect(cityControl?.valid).toBe(true);
    });

    it('should reject city with spaces', () => {
      const cityControl = component.userForm.get('city');
      cityControl?.setValue('Bogotá D.C.');
      expect(cityControl?.hasError('pattern')).toBe(true);
    });

    it('should reject city with numbers', () => {
      const cityControl = component.userForm.get('city');
      cityControl?.setValue('Bogota123');
      expect(cityControl?.hasError('pattern')).toBe(true);
    });

    it('should validate city min length (2)', () => {
      const cityControl = component.userForm.get('city');
      cityControl?.setValue('A');
      expect(cityControl?.hasError('minlength')).toBe(true);
    });

    it('should validate city max length (50)', () => {
      const cityControl = component.userForm.get('city');
      cityControl?.setValue('a'.repeat(51));
      expect(cityControl?.hasError('maxlength')).toBe(true);
    });
  });

  describe('Form Validation - Message', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should require message field', () => {
      const messageControl = component.userForm.get('message');
      messageControl?.setValue('');
      expect(messageControl?.hasError('required')).toBe(true);
    });

    it('should validate message pattern (must start with letter followed by digits 1-9)', () => {
      const messageControl = component.userForm.get('message');
      // Pattern requires: letter followed by digits 1-9
      messageControl?.setValue('123'); // Starts with number, should fail
      expect(messageControl?.hasError('pattern')).toBe(true);
    });

    it('should accept valid message pattern (letter + digits)', () => {
      const messageControl = component.userForm.get('message');
      messageControl?.setValue('A123');
      expect(messageControl?.valid).toBe(true);
    });

    it('should reject message starting with number', () => {
      const messageControl = component.userForm.get('message');
      messageControl?.setValue('123abc');
      expect(messageControl?.hasError('pattern')).toBe(true);
    });

    it('should reject message with only letters', () => {
      const messageControl = component.userForm.get('message');
      messageControl?.setValue('Hello');
      expect(messageControl?.hasError('pattern')).toBe(true);
    });

    it('should validate message min length (2)', () => {
      const messageControl = component.userForm.get('message');
      messageControl?.setValue('A');
      expect(messageControl?.hasError('minlength')).toBe(true);
    });

    it('should validate message max length (500)', () => {
      const messageControl = component.userForm.get('message');
      messageControl?.setValue('a'.repeat(501));
      expect(messageControl?.hasError('maxlength')).toBe(true);
    });
  });

  describe('submitMessage', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.userForm.patchValue(mockFormData);
    });

    it('should disable form when submitting', () => {
      formService.postContactForm.and.returnValue(of(mockFormResponse));
      
      component.submitMessage();
      
      expect(component.userForm.disabled).toBe(true);
    });

    it('should set loading to true when submitting', () => {
      formService.postContactForm.and.returnValue(of(mockFormResponse));
      
      component.submitMessage();
      
      expect(component.loading).toBe(true);
    });

    it('should call formService.postContactForm with form values', () => {
      formService.postContactForm.and.returnValue(of(mockFormResponse));
      
      component.submitMessage();
      
      expect(formService.postContactForm).toHaveBeenCalledWith(mockFormData);
    });

    it('should log email with random number', () => {
      formService.postContactForm.and.returnValue(of(mockFormResponse));
      const consoleSpy = spyOn(console, 'log');
      
      component.submitMessage();
      
      expect(consoleSpy).toHaveBeenCalled();
      const logCall = consoleSpy.calls.mostRecent().args[0];
      expect(logCall).toContain(mockFormData.email.toLowerCase());
    });

    it('should reset form on successful submission', () => {
      formService.postContactForm.and.returnValue(of(mockFormResponse));
      
      component.submitMessage();
      
      // Wait for async operation
      fixture.detectChanges();
      
      expect(component.userForm.value.name).toBe('');
      expect(component.userForm.value.email).toBe('');
    });

    it('should enable form after successful submission', () => {
      formService.postContactForm.and.returnValue(of(mockFormResponse));
      
      component.submitMessage();
      fixture.detectChanges();
      
      expect(component.userForm.enabled).toBe(true);
    });

    it('should set loading to false after successful submission', () => {
      formService.postContactForm.and.returnValue(of(mockFormResponse));
      
      component.submitMessage();
      fixture.detectChanges();
      
      expect(component.loading).toBe(false);
    });

    it('should set thankYou to true after successful submission', () => {
      formService.postContactForm.and.returnValue(of(mockFormResponse));
      
      component.submitMessage();
      fixture.detectChanges();
      
      expect(component.thankYou).toBe(true);
    });

    it('should handle 422 error status', () => {
      const error422 = { status: 422, error: { message: 'Validation error' } };
      formService.postContactForm.and.returnValue(throwError(() => error422));
      const consoleSpy = spyOn(console, 'log');
      
      component.submitMessage();
      fixture.detectChanges();
      
      expect(component.error).toEqual(error422);
      expect(consoleSpy).toHaveBeenCalledWith(error422);
      expect(component.loading).toBe(false);
    });

    it('should handle other error statuses', () => {
      const error500 = { status: 500, error: { message: 'Server error' } };
      formService.postContactForm.and.returnValue(throwError(() => error500));
      const consoleSpy = spyOn(console, 'log');
      
      component.submitMessage();
      fixture.detectChanges();
      
      expect(component.error).toBe('Server error');
      expect(consoleSpy).toHaveBeenCalledWith('Server error');
      expect(component.loading).toBe(false);
    });

    it('should keep form disabled on error', () => {
      const error422 = { status: 422, error: { message: 'Validation error' } };
      formService.postContactForm.and.returnValue(throwError(() => error422));
      
      component.submitMessage();
      fixture.detectChanges();
      
      // Form should remain disabled after error
      expect(component.userForm.disabled).toBe(true);
    });

    it('should handle error without error.message', () => {
      const errorWithoutMessage = { status: 500 };
      formService.postContactForm.and.returnValue(throwError(() => errorWithoutMessage));
      const consoleSpy = spyOn(console, 'log');
      
      component.submitMessage();
      fixture.detectChanges();
      
      expect(component.error).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should handle error with null error object', () => {
      const errorNull = { status: 500, error: null };
      formService.postContactForm.and.returnValue(throwError(() => errorNull));
      const consoleSpy = spyOn(console, 'log');
      
      component.submitMessage();
      fixture.detectChanges();
      
      expect(component.error).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('Form Complete Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should have invalid form when empty', () => {
      expect(component.userForm.valid).toBe(false);
    });

    it('should have valid form when all fields are correctly filled', () => {
      component.userForm.patchValue({
        name: 'JuanPerezGarcia',
        email: 'juan.perez@example.com',
        phone: '3001234567',
        city: 'Bogota',
        message: 'A123456789'
      });
      expect(component.userForm.valid).toBe(true);
    });

    it('should have invalid form when name is too short', () => {
      component.userForm.patchValue({
        name: 'Juan',
        email: 'juan.perez@example.com',
        phone: '3001234567',
        city: 'Bogota',
        message: 'A123456789'
      });
      expect(component.userForm.valid).toBe(false);
    });

    it('should have invalid form when email is invalid', () => {
      component.userForm.patchValue({
        name: 'JuanPerezGarcia',
        email: 'invalid-email',
        phone: '3001234567',
        city: 'Bogota',
        message: 'A123456789'
      });
      expect(component.userForm.valid).toBe(false);
    });

    it('should have invalid form when phone starts with zero', () => {
      component.userForm.patchValue({
        name: 'JuanPerezGarcia',
        email: 'juan.perez@example.com',
        phone: '0123456789',
        city: 'Bogota',
        message: 'A123456789'
      });
      expect(component.userForm.valid).toBe(false);
    });
  });

  describe('Form UI Behavior', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should show loading indicator when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();
      const loadingElement = fixture.nativeElement.querySelector('#form-loading');
      expect(loadingElement).toBeTruthy();
    });

    it('should show thank you message when thankYou is true', () => {
      component.thankYou = true;
      fixture.detectChanges();
      const thankYouElement = fixture.nativeElement.querySelector('#form-thank-you');
      expect(thankYouElement).toBeTruthy();
      expect(thankYouElement.textContent).toContain('Gracias por tu comentario');
    });

    it('should disable submit button when form is invalid', () => {
      component.userForm.patchValue({
        name: '',
        email: '',
        phone: '',
        city: '',
        message: ''
      });
      fixture.detectChanges();
      const submitButton = fixture.nativeElement.querySelector('#form-submit');
      expect(submitButton.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.userForm.patchValue({
        name: 'JuanPerezGarcia',
        email: 'juan.perez@example.com',
        phone: '3001234567',
        city: 'Bogota',
        message: 'A123456789'
      });
      fixture.detectChanges();
      const submitButton = fixture.nativeElement.querySelector('#form-submit');
      expect(submitButton.disabled).toBe(false);
    });
  });
});

