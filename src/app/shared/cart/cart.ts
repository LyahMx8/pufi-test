import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem, CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class CartComponent {
	items: CartItem[] = []

	constructor(private cart: CartService) {
		this.cart.items$.subscribe(list => this.items = list)
	}

	increase(index: number): void {
		const item = this.items[index]
		if (!item) return
		this.cart.increase(item)
	}

	decrease(index: number): void {
		const item = this.items[index]
		if (!item) return
		this.cart.decrease(item)
	}

	onQtyInput(index: number, event: Event): void {
		const el = event.target as HTMLInputElement
		const parsed = Number(el.value)
		const item = this.items[index]
		if (!item) return
		this.cart.updateQuantity(item, Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1)
	}

	remove(index: number): void {
		const item = this.items[index]
		if (!item) return
		this.cart.remove(item)
	}

	clear(): void {
		this.cart.clear()
	}

	subtotal(): number {
		return this.items.reduce((sum, it) => sum + (it.price * it.quantity), 0)
	}

	checkout(): void {
		const payload = {
			items: this.items.map(i => ({ sku: i.sku, size: i.size, qty: i.quantity })),
			total: this.subtotal()
		}
		console.log('checkout', payload)
	}
}
