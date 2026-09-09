import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

// logout-success.component.ts
@Component({
  selector: 'app-logout-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './logout-success.component.html',
  styleUrls: ['./logout-success.component.css']
})
export class LogoutSuccessComponent {}
