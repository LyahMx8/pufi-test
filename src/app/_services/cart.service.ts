import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type CartItem = {
	sku: string
	name: string
	size: number
	price: number
	quantity: number
	image: string
}

@Injectable({ providedIn: 'root' })
export class CartService {
	private readonly itemsSubject = new BehaviorSubject<CartItem[]>([])
	readonly items$ = this.itemsSubject.asObservable()

	get items(): CartItem[] {
		return this.itemsSubject.getValue()
	}

	private setItems(items: CartItem[]): void {
		this.itemsSubject.next([...items])
	}

	addItem(item: CartItem): void {
		const items = this.items
		const idx = items.findIndex(i => i.sku === item.sku && i.size === item.size)
		if (idx >= 0) {
			items[idx] = { ...items[idx], quantity: items[idx].quantity + item.quantity }
			this.setItems(items)
			return
		}
		this.setItems([...items, item])
	}

	updateQuantity(item: CartItem, quantity: number): void {
		const items = this.items
		const idx = items.findIndex(i => i.sku === item.sku && i.size === item.size)
		if (idx < 0) return
		items[idx] = { ...items[idx], quantity: Math.max(1, Math.floor(quantity)) }
		this.setItems(items)
	}

	increase(item: CartItem): void {
		this.updateQuantity(item, (item.quantity ?? 1) + 1)
	}

	decrease(item: CartItem): void {
		this.updateQuantity(item, (item.quantity ?? 1) - 1)
	}

	remove(item: CartItem): void {
		this.setItems(this.items.filter(i => !(i.sku === item.sku && i.size === item.size)))
	}

	clear(): void {
		this.setItems([])
	}
}

