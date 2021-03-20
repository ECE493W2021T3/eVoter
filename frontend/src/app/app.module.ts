import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './helpers/token.interceptor';
import { MaterialModule } from './helpers/material.module';
import { AuthGuard } from './helpers/auth.guard';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { NewListComponent } from './components/new-list/new-list.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { EditListComponent } from './components/edit-list/edit-list.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { TopNavBarComponent } from './components/top-nav-bar/top-nav-bar.component';
import { NewPollComponent } from './components/new-poll/new-poll.component';
import { HostedPollsComponent } from './components/hosted-polls/hosted-polls.component';
import { InvitedPollsComponent } from './components/invited-polls/invited-polls.component';
import { PollResultsComponent } from './components/poll-results/poll-results.component';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
    declarations: [
        AppComponent,
        TaskViewComponent,
        NewListComponent,
        NewTaskComponent,
        LoginPageComponent,
        SignupPageComponent,
        EditListComponent,
        EditTaskComponent,
        TopNavBarComponent,
        NewPollComponent,
        HostedPollsComponent,
        InvitedPollsComponent,
        PollResultsComponent,
        SettingsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule,
        FlexLayoutModule
    ],
    providers: [
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
