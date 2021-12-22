import UserDao from '../../dal/dao/UserDao';
import { User } from '../../openapi/model/user';

class UserConverter {

    public convertToDto(userDao: UserDao): User {
        const userDto: User = new User();
        userDto.username = userDao.username;
        return userDto;
    }

    public convertToDao(userDto: User): UserDao {
        const userDao: UserDao = new UserDao();
        userDao.username = userDto.username || '';
        userDao.password = userDto.password || '';
        return userDao;
    }
}

export default new UserConverter();
