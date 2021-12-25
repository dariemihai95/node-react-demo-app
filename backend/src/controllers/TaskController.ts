import { Task, User } from '../openapi/model/models';
import * as express from 'express';
import { Responses } from '../config/Responses';
import TaskService from '../services/TaskService';

module.exports = {

  testTask: async (request: any, response: express.Response, next: express.NextFunction) => {
    response.status(Responses.created.status).send(true);
  },

  createTask: async (request: any, response: express.Response, next: express.NextFunction) => {
    try {
      const task: Task = request.body;
      const accessToken = request.headers.authorization;
      const createdTask: Task | null = await TaskService.createTask(task, accessToken);
      response.status(Responses.created.status).send(createdTask);
    } catch (error) {
      next(error);
    }
  },

  getTasks: async (request: any, response: express.Response, next: express.NextFunction) => {
    try {
      const accessToken = request.headers.authorization;
      const taskList: Task[] = await TaskService.getAllTasksByUser(accessToken);
      response.send(taskList);
    } catch (error) {
      next(error);
    }
  },

  getTaskById: async (request: any, response: express.Response, next: express.NextFunction) => {
    try {
      const taskId: string = request.params.taskId;
      const accessToken = request.headers.authorization;
      const task: Task = await TaskService.getTaskById(taskId);
      response.send(task);
    } catch (error) {
      next(error);
    }
  },

  deleteTask: async (request: any, response: express.Response, next: express.NextFunction) => {
    try {
      const taskId: string = request.params.taskId;
      const accessToken = request.headers.authorization;
      const isDeleted: boolean = await TaskService.deleteTask(taskId);
      isDeleted && response.json(Responses.deleted);
    } catch (error) {
      next(error);
    }
  },
}
