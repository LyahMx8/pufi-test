import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

    constructor() { }

    toggle(toggler, icon, active, inactive, displayType) {
        let toggledInput = document.getElementById(toggler);
        let body = document.body
        let html = document.getElementsByTagName('html')[0]
        if(toggledInput.style.display == displayType){
          toggledInput.style.display = "none";
          body.classList.remove("modal-open")
          html.classList.remove("modal-open")
          // console.log("active")
          // document.body.classList.remove("stop-scrolling");
        } else {
          toggledInput.style.display = displayType;
          body.classList.add("modal-open")
          html.classList.add("modal-open")
          window.scrollTo(0, 0)
          // console.log("disactive")
          // document.body.classList.add("stop-scrolling"); 
        }
        if (icon != '' || icon != 0) {
            let changedIcon = document.getElementById(icon);
            toggledInput.style.display == displayType ? changedIcon.innerHTML = active : changedIcon.innerHTML = inactive;
        }
    }
}
