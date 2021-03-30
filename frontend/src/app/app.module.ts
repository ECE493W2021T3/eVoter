import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './helpers/token.interceptor';
import { MaterialModule } from './helpers/material.module';
import { AuthGuard } from './helpers/auth.guard';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { TopNavBarComponent } from './components/top-nav-bar/top-nav-bar.component';
import { NewPollComponent } from './components/new-poll/new-poll.component';
import { HostedPollsComponent } from './components/hosted-polls/hosted-polls.component';
import { InvitedPollsComponent } from './components/invited-polls/invited-polls.component';
import { PollResultsComponent } from './components/poll-results/poll-results.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MatNativeDateModule } from '@angular/material/core';
import { PollDetailsDialogComponent } from './components/poll-details-dialog/poll-details-dialog.component';
import { InvitePollComponent } from './components/invite-poll/invite-poll.component';
import { InviteSystemComponent } from './components/invite-system/invite-system.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        SignupPageComponent,
        TopNavBarComponent,
        NewPollComponent,
        HostedPollsComponent,
        InvitedPollsComponent,
        PollResultsComponent,
        SettingsComponent,
        PollDetailsDialogComponent,
        InvitePollComponent,
        InviteSystemComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatNativeDateModule
    ],
    providers: [
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
