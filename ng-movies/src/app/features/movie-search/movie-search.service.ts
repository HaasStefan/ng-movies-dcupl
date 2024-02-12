import { Injectable, inject } from '@angular/core';
import { injectDcupl$ } from '../../shared/dcupl.service';
import { MovieDto } from './models/movie.dto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MovieSearchService {
  private readonly dcupl$ = injectDcupl$();
  private readonly http = inject(HttpClient);

  readonly movies$ = this.dcupl$.readyMap((dcupl) => {
    const movieList = dcupl.lists.create({ modelKey: 'metadata' });
    return movieList.catalog.query.execute<MovieDto>();
  });

  getPoster(movie: MovieDto) {
    return this.http.get(
      `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      { responseType: 'blob' }
    );
  }
}
