import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive,MatButtonModule,MatIconModule],templateUrl:'./app.component.html',styleUrl:'./app.component.scss'})
export class AppComponent { readonly menuOpen=signal(false); readonly dark=signal(false); toggleTheme(){this.dark.update(v=>!v);document.documentElement.classList.toggle('dark',this.dark());} }
