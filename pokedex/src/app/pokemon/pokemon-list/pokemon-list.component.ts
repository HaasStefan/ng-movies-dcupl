import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';
import { PokemonService } from '../pokemon.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  templateUrl: './pokemon-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, PokemonCardComponent, FilterBarComponent],
})
export class PokemonListComponent {
  private readonly pokemonService = inject(PokemonService);
  readonly pokemons$ = this.pokemonService.pokemons$;
}
