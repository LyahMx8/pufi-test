import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public menu: any

  constructor(
  ) { }

  ngOnInit(): void {
    this.menu = {
      "title": "menu",
      "subItems": [
        {
          "title": "Home",
          "link": "/home"
        },
        {
          "title": "About",
          "link": "/about"
        },
        {
          "title": "Contact",
          "link": "/contact"
        }
      ]
    }
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

}
