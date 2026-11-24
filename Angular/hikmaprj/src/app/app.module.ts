import { NgModule} from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import {  provideHttpClient, withFetch } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule} from 'ngx-pagination';
import { TeamhistoryComponent } from './views/admin/dashboard/dashboard/componments/teamhistory/teamhistory.component';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    LayoutModule,
    GraphQLModule,
    FormsModule,
    NgxPaginationModule,
    TeamhistoryComponent,
  ],
  providers: [
    [provideHttpClient(withFetch())]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
