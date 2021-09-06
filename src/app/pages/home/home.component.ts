import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public titleTxt = "Home - BlackSip Test"
  public description = "En BlackSip nos encargamos de brindarle la mejor atención a nuestros clientes"
  public featureImg = '/assets/images/media/men-chatting.jpg'

  constructor(
    private router: Router,
    private meta: Meta,
    private title: Title
  ) {
    this.title.setTitle(this.titleTxt);
    // Añadir el tag de la info de la página
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

}
