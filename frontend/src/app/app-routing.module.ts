import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { NewListComponent } from './components/new-list/new-list.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { EditListComponent } from './components/edit-list/edit-list.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';

const routes: Routes = [
    { path: '', redirectTo: '/lists', pathMatch: 'full' },
    { path: 'new-list', component: NewListComponent },
    { path: 'edit-list/:listId', component: EditListComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'signup', component: SignupPageComponent },
    { path: 'lists', component: TaskViewComponent },
    { path: 'lists/:listId', component: TaskViewComponent },
    { path: 'lists/:listId/new-task', component: NewTaskComponent },
    { path: 'lists/:listId/edit-task/:taskId', component: EditTaskComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
