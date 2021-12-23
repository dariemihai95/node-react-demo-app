import TaskDao from '../dao/TaskDao';

class TaskRepository {

    public async create(taskDao: TaskDao): Promise<TaskDao> {
        const createdTask: TaskDao = await taskDao.save();
        return createdTask;
    }

    public async findAll(): Promise<Array<TaskDao>> {
        const taskList: TaskDao[] = await TaskDao.findAll();
        return taskList;
    }

    public async findAllById(userId: string): Promise<Array<TaskDao>> {
        const taskList: TaskDao[] = await TaskDao.findAll({ where: { userId: userId } });
        return taskList;
    }

    public async findOneById(taskId: string): Promise<TaskDao | null> {
        const taskDao: TaskDao | null = await TaskDao.findByPk(taskId);
        return taskDao;
    }

    public async deleteOneById(taskId: string): Promise<boolean> {
        const deletedTask: number = await TaskDao.destroy({ where: { taskId: taskId } });
        const isTaskDeleted: boolean = Boolean(deletedTask);
        return isTaskDeleted;
    }
}

export default new TaskRepository();