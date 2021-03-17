import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private baseService: BaseService) { }


  getLists() {
    return this.baseService.get('lists');
  }

  createList(title: string) {
    // We want to send a web request to create a list
    return this.baseService.post('lists', { title });
  }

  updateList(id: string, title: string) {
    // We want to send a web request to update a list
    return this.baseService.patch(`lists/${id}`, { title });
  }

  updateTask(listId: string, taskId: string, title: string) {
    // We want to send a web request to update a list
    return this.baseService.patch(`lists/${listId}/tasks/${taskId}`, { title });
  }

  deleteTask(listId: string, taskId: string) {
    return this.baseService.delete(`lists/${listId}/tasks/${taskId}`);
  }

  deleteList(id: string) {
    return this.baseService.delete(`lists/${id}`);
  }

  getTasks(listId: string) {
    return this.baseService.get(`lists/${listId}/tasks`);
  }

  createTask(title: string, listId: string) {
    // We want to send a web request to create a task
    return this.baseService.post(`lists/${listId}/tasks`, { title });
  }

  complete(task: Task) {
    return this.baseService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }
}
