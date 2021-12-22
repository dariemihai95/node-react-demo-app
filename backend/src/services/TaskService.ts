import { HandledError } from '../config/HandledError';
import { Responses } from '../config/Responses';
import { Task } from '../openapi/model/task';
import TaskDao from '../dal/dao/TaskDao';
import TaskRepository from '../dal/repository/TaskRepository';
import TaskConverter from './converter/TaskConverter';

class TaskService {

  public async createTask(task: Task): Promise<Task | null> {
    if (task.name && task.description && task.dueDate && task.status) {
      const taskDao: TaskDao = TaskConverter.convertToDao(task)
      const newTaskDao: TaskDao = await TaskRepository.create(taskDao as TaskDao);
      return newTaskDao;
    } else {
      throw new HandledError(Responses.badRequest);
    }
  }

  public async getAllTasks(): Promise<Array<Task>> {
    const taskList: TaskDao[] = await TaskRepository.findAll();
    const taskListDto: Task[] = taskList.map((task: TaskDao) => TaskConverter.convertToDto(task));
    return taskListDto;
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