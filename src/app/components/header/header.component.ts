import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartUiService } from '@core/shared/cart/cart-ui.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public menu = [
    {
      "title": "Catálogo", "link": "/boutique",
      subItems: [
        {"title": "Dama", "link": "/lady"},
        {"title": "Caballero", "link": "/gentleman"},
      ]
    },
    { "title": "Acerca de", "link": "/about"},
    { "title": "Contacto", "link": "/contact"}
  ];

  constructor(
    private cartUi: CartUiService
  ) { }

  ngOnInit(): void {
  }

  showItem($this) {
    console.log($this.target.innerHTML);
  }

  openMenu(id) {
    var element = document.getElementById(id)
    if(element.classList.contains("open-menu")){
      element.classList.remove("open-menu")
    } else {
      element.classList.add("open-menu")
    }
  }

  openCart() {
    this.cartUi.open()
  }
}
