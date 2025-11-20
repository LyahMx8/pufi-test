import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart';
import { CartUiService } from '../../_services/cart-ui.service';

@Component({
	selector: 'app-cart-drawer',
	standalone: true,
	imports: [CommonModule, CartComponent],
	templateUrl: './cart-drawer.html',
	styleUrls: ['./cart-drawer.scss']
})
export class CartDrawerComponent {
	open = false

	constructor(private ui: CartUiService) {
		this.ui.open$.subscribe(v => this.open = v)
	}

	close(): void {
		this.ui.close()
	}
}

