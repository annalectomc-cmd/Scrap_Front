import { Component } from '@angular/core';
import { Home } from './components/home/home';
import { Comments } from './comments';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Home, RouterOutlet, RouterLink],
  template: `
    <main>
      <nav class="navbar bg-body-tertiary">
        <header class="brand-name">
          <!--<img class="brand-logo" src="/public/logo.svg" alt="logo" aria-hidden="true" />-->
          <h1>Scrapping TikTok</h1>
        </header>
      </nav>
      <section class="content">
        <router-outlet />
      </section>
    </main>`,
  styleUrls: ['./app.css'],
})
export class App {
  title = 'Scrapp';
}
