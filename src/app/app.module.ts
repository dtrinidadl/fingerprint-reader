import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ComponentTutorialComponent } from './component/component-tutorial/component-tutorial.component';
import { ComponentTest1Component } from './component/component-test-1/component-test-1.component';

@NgModule({
  declarations: [
    AppComponent,
    ComponentTutorialComponent,
    ComponentTest1Component
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
