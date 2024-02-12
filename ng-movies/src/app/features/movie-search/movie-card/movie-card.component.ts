import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MovieDto } from '../models/movie.dto';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';


@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [RouterLink, NgClass, AsyncPipe],
  templateUrl: './movie-card.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCardComponent {
  private readonly http = inject(HttpClient);
  readonly movie = input.required<MovieDto>();
}
