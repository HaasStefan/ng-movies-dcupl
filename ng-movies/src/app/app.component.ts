import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MovieSearchService } from './features/movie-search/movie-search.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MovieListComponent } from "./features/movie-search/movie-list/movie-list.component";

@Component({
    selector: 'app-root',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './app.component.html',
    imports: [JsonPipe, AsyncPipe, MovieListComponent]
})
export class AppComponent {
  private readonly movieSearchService = inject(MovieSearchService);
}
