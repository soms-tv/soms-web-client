import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ChooseComponent } from './choose/choose.component';
import { HostComponent } from './host/host.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', component: ChooseComponent },
  { path: 'host',  component: HostComponent },
  { path: 'view', component: ViewComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
