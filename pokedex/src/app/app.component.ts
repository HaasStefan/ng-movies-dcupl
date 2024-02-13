import { Component } from '@angular/core';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [PokemonListComponent],
})
export class AppComponent {}
