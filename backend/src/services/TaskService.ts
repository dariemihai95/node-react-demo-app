import { HandledError } from '../config/HandledError';
import { Responses } from '../config/Responses';
import { Task } from '../openapi/model/task';
import TaskDao from '../dal/dao/TaskDao';
import TaskRepository from '../dal/repository/TaskRepository';
import TaskConverter from './converter/TaskConverter';
import { decodeJwt } from '../middlewares/jwtController';
import UserRepository from '../dal/repository/UserRepository';

class TaskService {

  public async createTask(task: Task, accessToken: string): Promise<Task | null> {
    if (task.name && task.description && task.dueDate && task.status && accessToken) {
      const decodedToken = decodeJwt(accessToken);
      if (typeof decodedToken != null && typeof decodedToken !== 'string') {
        const userDao = await UserRepository.findOneByUsername(decodedToken!.username)
        const taskDao: TaskDao = TaskConverter.convertToDao(task, userDao?.userId || '')
        const newTaskDao: TaskDao = await TaskRepository.create(taskDao as TaskDao);
        const newTaskDto: Task = TaskConverter.convertToDto(newTaskDao);
        return newTaskDto;
      }
      throw new HandledError(Responses.forbidden);
    } else {
      throw new HandledError(Responses.badRequest);
    }
  }

  public async getAllTasks(accessToken: string): Promise<Array<Task>> {
    const decodedToken = decodeJwt(accessToken);
    if (typeof decodedToken != null && typeof decodedToken !== 'string') {
      const taskList: TaskDao[] = await TaskRepository.findAll();
      const taskListDto: Task[] = taskList.map((task: TaskDao) => TaskConverter.convertToDto(task));
      return taskListDto;
    }
    throw new HandledError(Responses.forbidden);
  }

  public async getAllTasksByUser(accessToken: string, pageSize: number, pageNumber: number, order: string, sortBy?: string): Promise<Array<Task>> {
    const decodedToken = decodeJwt(accessToken);
    if (typeof decodedToken != null && typeof decodedToken !== 'string') {
      const userDao = await UserRepository.findOneByUsername(decodedToken!.username)
      if (userDao != null) {
        const taskList: TaskDao[] = await TaskRepository.findAllById(userDao.userId, pageSize, pageNumber, order, sortBy);
        const taskListDto: Task[] = taskList.map((task: TaskDao) => TaskConverter.convertToDto(task));
        return taskListDto;
      }
      throw new HandledError(Responses.notFound);
    }
    throw new HandledError(Responses.forbidden);
  }

  public async modifyTask(task: Task): Promise<Task> {
    if (task.taskId) {
      let taskDao: TaskDao | null = await TaskRepository.findOneById(task.taskId);
      if (taskDao && task.name && task.description && task.dueDate && task.status) {
        const userId = taskDao.userId;
        taskDao = TaskConverter.convertToDao(task, userId);
        const modifiedTask: TaskDao = await TaskRepository.updateOneById(taskDao, task.taskId);
        return TaskConverter.convertToDto(modifiedTask);
      } else {
        throw new HandledError(Responses.badRequest);
      }
    } else {
      throw new HandledError(Responses.badRequest);
    }
  }

  public async getTaskById(taskId: string): Promise<Task> {
    const taskDao: TaskDao | null = await TaskRepository.findOneById(taskId);
    if (taskDao) {
      return TaskConverter.convertToDto(taskDao);
    } else {
      throw new HandledError(Responses.notFound);
    }
  }

  public async deleteTask(taskId: string): Promise<boolean> {
    const isTaskDeleted: boolean = await TaskRepository.deleteOneById(taskId);
    if (!isTaskDeleted) {
      throw new HandledError(Responses.notFound);
    }
    return isTaskDeleted;
  }
}

export default new TaskService();
