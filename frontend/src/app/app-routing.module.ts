import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';
// import { TaskViewComponent } from './components/task-view/task-view.component';
// import { NewListComponent } from './components/new-list/new-list.component';
// import { NewTaskComponent } from './components/new-task/new-task.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
// import { EditListComponent } from './components/edit-list/edit-list.component';
// import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { NewPollComponent } from './components/new-poll/new-poll.component';
import { HostedPollsComponent } from './components/hosted-polls/hosted-polls.component';
import { InvitedPollsComponent } from './components/invited-polls/invited-polls.component';
import { PollResultsComponent } from './components/poll-results/poll-results.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
    { path: '', component: HostedPollsComponent, pathMatch: 'full', canActivate: [AuthGuard], data: { title: 'My Hosted Polls' } },
    // { path: 'new-list', component: NewListComponent },
    // { path: 'edit-list/:listId', component: EditListComponent },
    { path: 'login', component: LoginPageComponent, data: { title: 'My Hosted Polls' } },
    { path: 'signup', component: SignupPageComponent },
    // { path: 'lists', component: TaskViewComponent },
    // { path: 'lists/:listId', component: TaskViewComponent },
    // { path: 'lists/:listId/new-task', component: NewTaskComponent },
    // { path: 'lists/:listId/edit-task/:taskId', component: EditTaskComponent },
    { path: 'new-poll', component: NewPollComponent, canActivate: [AuthGuard], data: { title: 'Create New Poll' } },
    { path: 'hosted-polls', component: HostedPollsComponent, canActivate: [AuthGuard], data: { title: 'My Hosted Polls' } },
    { path: 'invited-polls', component: InvitedPollsComponent, canActivate: [AuthGuard], data: { title: 'Invited Polls' } },
    { path: 'poll-results', component: PollResultsComponent, canActivate: [AuthGuard], data: { title: 'Poll Results' } },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard], data: { title: 'Settings' } },
    { path: '**', redirectTo: '', data: { title: 'My Hosted Polls' } }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
