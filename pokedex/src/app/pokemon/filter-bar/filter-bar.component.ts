import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs';
import { PokemonService } from '../pokemon.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Pokemon } from '../pokemon.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './filter-bar.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  private readonly pokemonService = inject(PokemonService);
  private readonly destroyRef = inject(DestroyRef);

  readonly pokemonLength$ = this.pokemonService.pokemons$.pipe(
    map((pokemons) => (pokemons ?? []).length)
  );
  readonly pokemonName = new FormControl<string>('');
  readonly search$ = this.pokemonName.valueChanges.pipe(
    /* not needed because nothing needs to be fetched */
    // debounceTime(200),
    distinctUntilChanged(),
    tap((value) => {
      this.pokemonService.pokemonName.next(value);
    })
  );

  constructor() {
    this.search$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
