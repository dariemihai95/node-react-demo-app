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

    public async findAllById(userId: string, pageSize: number, pageNumber: number, order: string, sortBy?: string): Promise<Array<TaskDao>> {
        const taskList: TaskDao[] = await TaskDao.findAll({
            where: { userId: userId },
            offset: (pageNumber - 1) * pageSize,
            limit: pageSize,
            order: !sortBy ? undefined : [[sortBy, order]]
        });
        return taskList;
    }

    public async findOneById(taskId: string): Promise<TaskDao | null> {
        const taskDao: TaskDao | null = await TaskDao.findByPk(taskId);
        return taskDao;
    }

    public async updateOneById(taskDao: TaskDao, taskId: string): Promise<TaskDao> {
        const updatedTask: [number, TaskDao[]] = await TaskDao.update({
            name: taskDao.name,
            description: taskDao.description,
            dueDate: taskDao.dueDate,
            status: taskDao.status,
            tags: taskDao.tags,
        }, { where: { taskId: taskId }, returning: true });
        const updatedTaskObject: TaskDao = updatedTask && updatedTask[1][0];
        return updatedTaskObject;
    }

    public async deleteOneById(taskId: string): Promise<boolean> {
        const deletedTask: number = await TaskDao.destroy({ where: { taskId: taskId } });
        const isTaskDeleted: boolean = Boolean(deletedTask);
        return isTaskDeleted;
    }
}

export default new TaskRepository();