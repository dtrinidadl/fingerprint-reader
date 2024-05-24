import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ComponentTutorialComponent } from './component/component-tutorial/component-tutorial.component';
import { ComponentTest1Component } from './component/component-test-1/component-test-1.component';
import { ComponentTest2Component } from './component/component-test-2/component-test-2.component';

@NgModule({
  declarations: [
    AppComponent,
    ComponentTutorialComponent,
    ComponentTest1Component,
    ComponentTest2Component
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
