import { HandledError } from '../config/HandledError';
import { Responses } from '../config/Responses';
import { Task } from '../openapi/model/task';
import TaskDao from '../dal/dao/TaskDao';
import TaskRepository from '../dal/repository/TaskRepository';
import TaskConverter from './converter/TaskConverter';
import { decodeJwt } from '../middlewares/jwtController';
import UserRepository from '../dal/repository/UserRepository';
import UserDao from '../dal/dao/UserDao';
import UserConverter from './converter/UserConverter';
import { User } from '../openapi/model/user';

class TaskService {

  public async createTask(task: Task, accessToken: string): Promise<Task | null> {
    if (task.name && task.description && task.dueDate && task.status && accessToken) {
      const decodedToken = decodeJwt(accessToken);
      // const verifiedJwt = verifyAccessToken(accessToken);
      if (typeof decodedToken != null && typeof decodedToken !== 'string') {
        const userDao = await UserRepository.findOneByUsername(decodedToken!.username)
        const taskDao: TaskDao = TaskConverter.convertToDao(task, userDao?.userId || '')
        const newTaskDao: TaskDao = await TaskRepository.create(taskDao as TaskDao);
        return newTaskDao;
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