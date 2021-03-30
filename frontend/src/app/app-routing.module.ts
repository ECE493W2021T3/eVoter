import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { NewPollComponent } from './components/new-poll/new-poll.component';
import { HostedPollsComponent } from './components/hosted-polls/hosted-polls.component';
import { InvitedPollsComponent } from './components/invited-polls/invited-polls.component';
import { PollResultsComponent } from './components/poll-results/poll-results.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const routes: Routes = [
    { path: '', component: HostedPollsComponent, pathMatch: 'full', canActivate: [AuthGuard], data: { title: 'My Hosted Polls' } },
    { path: 'login', component: LoginPageComponent, data: { title: 'My Hosted Polls' } },
    { path: 'signup', component: SignupPageComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'new-poll', component: NewPollComponent, canActivate: [AuthGuard], data: { title: 'Create New Poll' } },
    { path: 'hosted-polls', component: HostedPollsComponent, canActivate: [AuthGuard], data: { title: 'My Hosted Polls' } },
    { path: 'invited-polls', component: InvitedPollsComponent, canActivate: [AuthGuard], data: { title: 'Invited Polls' } },
    { path: 'poll-results', component: PollResultsComponent, canActivate: [AuthGuard], data: { title: 'Poll Results' } },
    { path: '**', redirectTo: '', data: { title: 'My Hosted Polls' } }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
