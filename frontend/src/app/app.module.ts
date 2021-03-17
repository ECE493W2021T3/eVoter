import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './helpers/token.interceptor';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { NewListComponent } from './components/new-list/new-list.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { EditListComponent } from './components/edit-list/edit-list.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';

@NgModule({
    declarations: [
        AppComponent,
        TaskViewComponent,
        NewListComponent,
        NewTaskComponent,
        LoginPageComponent,
        SignupPageComponent,
        EditListComponent,
        EditTaskComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
