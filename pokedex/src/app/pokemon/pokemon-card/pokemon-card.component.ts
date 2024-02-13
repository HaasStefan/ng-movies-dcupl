import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { injectDcupl$ } from '../../dcupl.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Pokemon } from '../pokemon.model';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, filter, map, switchMap, tap } from 'rxjs';
import { PokemonService } from '../pokemon.service';
import { PokemonTypeDirective } from '../pokemon-type.directive';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, PokemonTypeDirective],
  templateUrl: './pokemon-card.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCardComponent {
  private readonly dcupl$ = injectDcupl$();
  private readonly pokemonService = inject(PokemonService);
  private readonly elementRef = inject(ElementRef);

  pokedexNumber = input.required<string>();
  readonly pokedexNumber$ = toObservable(this.pokedexNumber);

  readonly pokemon$ = combineLatest({
    dcupl: this.dcupl$,
    pokedexNumber: this.pokedexNumber$,
  }).pipe(
    map(({ dcupl, pokedexNumber }) =>
      dcupl.query.one({
        modelKey: 'pokemon',
        itemKey: pokedexNumber,
      })
    ),
    filter((pokemon): pokemon is Pokemon => pokemon !== null),
    switchMap((pokemon) =>
      this.pokemonService.getSprites(this.cleanPokemonName(pokemon.name)).pipe(
        tap((res) => {
          if (res.error) {
            this.elementRef.nativeElement.remove();
          }
        }),
        map(({ sprites }) => ({
          ...pokemon,
          sprites: sprites,
          pokedex_number: this.padNumber(+pokemon.pokedex_number, 4),
        }))
      )
    )
  );

  private cleanPokemonName(name: string): string {
    return name.replace('♀', '-f').replace('♂', '-m').replace('+', '');
  }

  private padNumber(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }
}
