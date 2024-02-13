import {
  APP_INITIALIZER,
  Injectable,
  assertInInjectionContext,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { Dcupl } from '@dcupl/core';
import { DcuplAppLoader } from '@dcupl/loader';
import { dcuplKeys } from './dcupl-keys';
import {
  BehaviorSubject,
  Observable,
  defer,
  filter,
  map,
  shareReplay,
} from 'rxjs';

interface State {
  isReady: boolean;
}

const initialState: State = {
  isReady: false,
} as const;

@Injectable()
class DcuplService {
  readonly dcupl = new Dcupl({ config: dcuplKeys });

  private readonly state = new BehaviorSubject(initialState);
  readonly isReady$ = this.state.pipe(
    map((state) => state.isReady),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  async initialize() {
    const loader = new DcuplAppLoader();

    this.dcupl.loaders.add(loader);

    await loader.config.fetch();

    await loader.process({
      applicationKey: 'movies',
    });

    await this.dcupl.init();
    this.setReady();
  }

  private setReady() {
    this.state.next({ ...this.state.value, isReady: true });
  }
}

export function injectDcupl$() {
  assertInInjectionContext(injectDcupl$);
  const dcuplService = inject(DcuplService);

  const dcupl$ = defer(() => dcuplService.isReady$).pipe(
    filter((isReady) => isReady),
    map(() => dcuplService.dcupl)
  );

  return dcupl$;
}

export function provideDcupl() {
  return makeEnvironmentProviders([
    DcuplService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [DcuplService],
      useFactory: () => {
        const dcuplService = inject(DcuplService);
        dcuplService.initialize();
        return () => true;
      },
    },
  ]);
}
