import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safePipe'
})

export class DecodeHtmlString implements PipeTransform {

    transform(value: string) {
        const tempElement = document.createElement("div")
        tempElement.innerHTML = value
        return tempElement.innerText
    }
    
}