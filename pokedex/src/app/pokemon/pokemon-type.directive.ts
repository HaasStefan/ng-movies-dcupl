import {
  Directive,
  ElementRef,
  Renderer2,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { PokemonType } from './pokemon.model';

@Directive({
  selector: '[appPokemonType]',
  standalone: true,
})
export class PokemonTypeDirective {
  private readonly renderer = inject(Renderer2);
  private readonly elemenRef = inject(ElementRef);

  pokemonType = input.required<PokemonType>({ alias: 'appPokemonType' });
  customStyle = computed(() => this.getStyle(this.pokemonType()));

  constructor() {
    effect(() => {
      this.renderer.setStyle(
        this.elemenRef.nativeElement,
        'backgroundColor',
        this.customStyle().backgroundColor
      );
    });
  }

  private getStyle(pokemonType: PokemonType) {
    switch (pokemonType) {
      case 'normal':
        return { backgroundColor: '#A8A878' };
      case 'fire':
        return { backgroundColor: '#F08030' };
      case 'water':
        return { backgroundColor: '#6890F0' };
      case 'electric':
        return { backgroundColor: '#F8D030' };
      case 'grass':
        return { backgroundColor: '#78C850' };
      case 'ice':
        return { backgroundColor: '#98D8D8' };
      case 'fighting':
        return { backgroundColor: '#C03028' };
      case 'poison':
        return { backgroundColor: '#A040A0' };
      case 'ground':
        return { backgroundColor: '#E0C068' };
      case 'flying':
        return { backgroundColor: '#A890F0' };
      case 'psychic':
        return { backgroundColor: '#F85888' };
      case 'bug':
        return { backgroundColor: '#A8B820' };
      case 'rock':
        return { backgroundColor: '#B8A038' };
      case 'ghost':
        return { backgroundColor: '#705898' };
      case 'dragon':
        return { backgroundColor: '#7038F8' };
      case 'dark':
        return { backgroundColor: '#705848' };
      case 'steel':
        return { backgroundColor: '#B8B8D0' };
      case 'fairy':
        return { backgroundColor: '#EE99AC' };
      default:
        return { backgroundColor: '#68A090' };
    }
  }
}
