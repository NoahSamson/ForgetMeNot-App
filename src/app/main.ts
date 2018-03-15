import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
//to ensure we only take one value from our auth state.
import 'rxjs/add/operator/take'; 

platformBrowserDynamic().bootstrapModule(AppModule);
