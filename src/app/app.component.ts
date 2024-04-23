import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonComponent } from './json.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'json-view';
}
