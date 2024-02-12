import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MovieSearchService } from '../movie-search.service';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { map } from 'rxjs';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  templateUrl: './movie-list.component.html',
  styles: `
    :host {
      @apply flex flex-col h-full;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MovieCardComponent, AsyncPipe, JsonPipe, ScrollingModule],
})
export class MovieListComponent {
  private readonly movieSearchService = inject(MovieSearchService);
  readonly movies$ = this.movieSearchService.movies$;
}
