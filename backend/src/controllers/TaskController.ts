import { Task, User } from '../openapi/model/models';
import * as express from 'express';
import { Responses } from '../config/Responses';
import TaskService from '../services/TaskService';

export class TaskController {

  static createTask = async (request: any, response: express.Response, next: express.NextFunction) => {
    const task: Task = request.body;
    const accessToken = request.headers.authorization;
    const createdTask: Task | null = await TaskService.createTask(task, accessToken);
    response.status(Responses.created.status).send(createdTask);
  }

  static getTasks = async (request: any, response: express.Response, next: express.NextFunction) => {
    const accessToken = request.headers.authorization;
    const taskList: Task[] = await TaskService.getAllTasksByUser(accessToken);
    response.send(taskList);
  }

  static getTaskById = async (request: any, response: express.Response, next: express.NextFunction) => {
    const taskId: string = request.params.taskId;
    const accessToken = request.headers.authorization;
    const task: Task = await TaskService.getTaskById(taskId);
    response.send(task);
  }

  static deleteTask = async (request: any, response: express.Response, next: express.NextFunction) => {
    const taskId: string = request.params.taskId;
    const accessToken = request.headers.authorization;
    const isDeleted: boolean = await TaskService.deleteTask(taskId);
    isDeleted && response.json(Responses.deleted);
  }
}

export default TaskController;