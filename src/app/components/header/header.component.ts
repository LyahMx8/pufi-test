import { Component, OnInit } from '@angular/core';
import { MenuService } from '@core/_services/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public menu: any

  constructor(
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
    this.getMenu()
  }
  
  getMenu(){
    this.menuService.menuElements()
      .subscribe((data: any) => {
        this.menu = data.data;
      }, err => {
        console.log(err)
      })
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
