import UserDao from '../dao/UserDao';

class UserRepository {

    public async create(userDao: UserDao): Promise<UserDao> {
        const createdUser: UserDao = await userDao.save();
        return createdUser;
    }

    public async findAll(): Promise<Array<UserDao>> {
        const userList: UserDao[] = await UserDao.findAll();
        return userList;
    }

    public async findOneByUsername(username: string): Promise<UserDao | null> {
        const userDao: UserDao | null = await UserDao.findOne({ where: { username: username } });
        return userDao;
    }

    public async findOneById(userId: string): Promise<UserDao | null> {
        const userDao: UserDao | null = await UserDao.findByPk(userId);
        return userDao;
    }

    public async deleteOneById(userId: string): Promise<boolean> {
        const deletedUser: number = await UserDao.destroy({ where: { userId: userId } });
        const isUserDeleted: boolean = Boolean(deletedUser);
        return isUserDeleted;
    }
}

export default new UserRepository();