import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  ReplaySubject,
  catchError,
  map,
  of,
  shareReplay,
  withLatestFrom,
} from 'rxjs';
import { PokemonApiResponse } from './pokemon-card/poke-api/pokemon.model';
import { injectDcupl$ } from '../dcupl.service';
import { Pokemon } from './pokemon.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly dcupl$ = injectDcupl$();
  private readonly destroyRef = inject(DestroyRef);

  readonly pokemonName = new ReplaySubject<string | null>(1);
  readonly pokemonName$ = this.pokemonName.asObservable();

  private readonly pokemons = new BehaviorSubject<Pokemon[] | null>(null);
  readonly pokemons$ = this.pokemons.asObservable();

  readonly pokemonList$ = this.dcupl$.pipe(
    map((dcupl) => dcupl.lists.create<Pokemon>({ modelKey: 'pokemon' }))
  );

  constructor() {
    this.pokemonList$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pokemonList) => {
        const allPokemon = pokemonList.catalog.query.execute<Pokemon>();
        this.pokemons.next(allPokemon);
      });

    this.pokemonName$
      .pipe(
        withLatestFrom(this.pokemonList$),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(([name, pokemonList]) => {
        pokemonList.catalog.query.remove();

        pokemonList.catalog.query.apply({
          attribute: 'name',
          operator: 'find',
          value: name ?? '',
          options: {
            transform: ['lowercase'],
          },
        });

        const pokemon = pokemonList.catalog.query.execute<Pokemon>();
        this.pokemons.next(pokemon);
      });
  }

  private pokemonSpriteCache: Map<
    string,
    ReturnType<PokemonService['_getSprites']>
  > = new Map<string, ReturnType<PokemonService['_getSprites']>>();

  getSprites(pokemonName: string) {
    if (this.pokemonSpriteCache.has(pokemonName)) {
      return this.pokemonSpriteCache.get(pokemonName)!;
    }

    const sprites = this._getSprites(pokemonName).pipe(shareReplay());
    this.pokemonSpriteCache.set(pokemonName, sprites);
    return sprites;
  }

  private _getSprites(pokemonName: string) {
    return this.http
      .get<PokemonApiResponse>(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      )
      .pipe(
        map(
          (response) =>
            ({
              sprites: response.sprites,
              error: false,
            } as const)
        ),
        catchError(() => of({ sprites: null, error: true }))
      );
  }
}
