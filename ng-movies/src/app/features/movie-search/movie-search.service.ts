import { Injectable } from '@angular/core';
import { injectDcupl$ } from '../../shared/dcupl.service';
import { MovieDto } from './models/movie.dto';

@Injectable({
  providedIn: 'root',
})
export class MovieSearchService {
  private readonly dcupl$ = injectDcupl$();

  readonly movies$ = this.dcupl$.readyMap((dcupl) => {
    const movieList = dcupl.lists.create({ modelKey: 'metadata' });
    return movieList.catalog.query.execute<MovieDto>().slice(0, 10);
  });
}
