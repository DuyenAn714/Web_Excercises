import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
    <main class="container mt-3">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.css'], // Nếu không cần CSS thì xóa dòng này
  standalone: true,
  imports: [RouterOutlet, CommonModule]
})
export class AppComponent {
  title = 'AdminFashion';
}
