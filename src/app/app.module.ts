import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './shared/auth/auth.component';
import { NavigationComponent } from './shared/navigation/navigation.component';
import { LibraryComponent } from './library/library.component';
import { AuthInterceptorService } from './shared/auth/auth-interceptor.service';
import { BookComponent } from './shared/book/book.component';

@NgModule({
  declarations: [AppComponent, AuthComponent, NavigationComponent, LibraryComponent, BookComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
