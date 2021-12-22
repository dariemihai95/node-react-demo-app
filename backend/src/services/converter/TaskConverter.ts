import TaskDao from '../../dal/dao/TaskDao';
import { Task } from '../../openapi/model/task';

class TaskConverter {

    public convertToDto(taskDao: TaskDao): Task {
        const taskDto: Task = new Task();
        taskDto.name = taskDao.name;
        taskDto.description = taskDao.description;
        taskDto.dueDate = taskDao.dueDate;
        taskDto.status = taskDao.status;
        taskDto.tags = taskDao.tags;
        return taskDto;
    }

    public convertToDao(taskDto: Task): TaskDao {
        const taskDao: TaskDao = new TaskDao();
        taskDao.name = taskDto.name || '';
        taskDao.description = taskDto.description || '';
        taskDao.dueDate = taskDto.dueDate || '';
        taskDao.status = taskDto.status || '';
        taskDao.tags = taskDto.tags || '';
        return taskDao;
    }
}

export default new TaskConverter();
