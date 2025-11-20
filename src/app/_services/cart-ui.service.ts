import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartUiService {
	private readonly openSubject = new BehaviorSubject<boolean>(false)
	readonly open$ = this.openSubject.asObservable()

	get isOpen(): boolean {
		return this.openSubject.getValue()
	}

	open(): void {
		this.openSubject.next(true)
	}

	close(): void {
		this.openSubject.next(false)
	}

	toggle(): void {
		this.openSubject.next(!this.isOpen)
	}
}

