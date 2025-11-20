import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@core/components/header/header.component';
import { FooterComponent } from '@core/components/footer/footer.component';
import { FormComponent } from '@core/shared/form/form.component';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CartService } from '@core/shared/cart/cart.service';
import { CartUiService } from '@core/shared/cart/cart-ui.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, FormComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public titleTxt = "Home - bright-bogota Test"
  public description = "En bright-bogota nos encargamos de brindarle la mejor atención a nuestros clientes"
  public featureImg = '/assets/images/media/men-chatting.jpg'
  public slides: { src: string; alt: string }[] = [
    { src: '/assets/images/media/products/heel-01/front.webp', alt: 'Vista frontal' },
    { src: '/assets/images/media/products/heel-01/far.webp', alt: 'Vista lejana' },
    { src: '/assets/images/media/products/heel-01/left.webp', alt: 'Vista izquierda' },
    { src: '/assets/images/media/products/heel-01/right.webp', alt: 'Vista derecha' },
    { src: '/assets/images/media/products/heel-01/tallas.webp', alt: 'Tabla de tallas' }
  ]
  public slideIndex: number = 1
  public sizes: number[] = [34, 33, 32]
  public selectedSize: number | null = null
  public quantity: number = 1

  constructor(
    private router: Router,
    private meta: Meta,
    private title: Title,
    private cart: CartService,
    private cartUi: CartUiService
  ) {
    this.title.setTitle(this.titleTxt);
    this.meta.addTags([
      { name: 'description', content: this.description },
      { name: 'og:title', content: this.titleTxt },
      { name: 'og:image', content: this.featureImg },
      { name: 'og:url', content: this.router.url },
      { name: 'og:description', content: this.description },
      { name: 'twitter:title', content: this.titleTxt },
      { name: 'twitter:description', content: this.description },
      { name: 'twitter:image', content: this.featureImg }
    ]);}

  ngOnInit(): void {
  }

  plusSlides(step: number): void {
    this.slideIndex = this.normalizeIndex(this.slideIndex + step)
  }

  currentSlide(index: number): void {
    this.slideIndex = this.normalizeIndex(index)
  }

  private normalizeIndex(index: number): number {
    const total = this.slides.length
    if (index > total) {
      return 1
    }
    if (index < 1) {
      return total
    }
    return index
  }

  addToCart(): void {
    if (!this.selectedSize || this.quantity < 1) return
    this.cart.addItem({
      sku: '123456',
      name: 'Stiletto Essential 90',
      size: this.selectedSize,
      price: 189900,
      quantity: this.quantity,
      image: this.slides[0]?.src ?? ''
    })
    this.cartUi.open()
  }

  onSizeChange(event: Event): void {
    const el = event.target as HTMLSelectElement
    const value = el.value
    this.selectedSize = value ? Number(value) : null
  }

  onQuantityInput(event: Event): void {
    const el = event.target as HTMLInputElement
    const parsed = Number(el.value)
    this.quantity = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1
    if (this.quantity < 1) {
      this.quantity = 1
    }
  }
}
