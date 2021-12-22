import { User } from '../openapi/model/user';
import { JwtAuthenticationResponse } from '../openapi/model/jwtAuthenticationResponse';
import UserDao from '../dal/dao/UserDao';
import UserConverter from './converter/UserConverter';
import UserRepository from '../dal/repository/UserRepository';
import { signJwt } from '../middlewares/jwtController';
import { HandledError } from '../config/HandledError';
import { encrypt, verifyEncryption } from '../utils/encryptUtils';
import { Responses } from '../config/Responses';

class UserService {

  public async createUser(user: User): Promise<User | null> {
    if (user.username && user.password) {
      user.password = await encrypt(user.password);
      let userDao: UserDao | null = await UserRepository.findOneByUsername(user.username);
      if (!userDao) {
        userDao = UserConverter.convertToDao(user);
        const newUserDao: UserDao = await UserRepository.create(userDao as UserDao);
        return UserConverter.convertToDto(newUserDao);
      } else {
        throw new HandledError(Responses.conflict);
      }
    } else {
      throw new HandledError(Responses.badRequest);
    }
  }

  public async getAllUsers(): Promise<Array<User>> {
    const userList: UserDao[] = await UserRepository.findAll();
    const userListDto: User[] = userList.map((user: UserDao) => UserConverter.convertToDto(user));
    return userListDto;
  }

  public async getUserById(userId: string): Promise<User> {
    const userDao: UserDao | null = await UserRepository.findOneById(userId);
    if (userDao) {
      return UserConverter.convertToDto(userDao);
    } else {
      throw new HandledError(Responses.notFound);
    }
  }

  public async getUserByUsername(username: string): Promise<User> {
    const userDao: UserDao | null = await UserRepository.findOneByUsername(username);
    if (userDao) {
      return UserConverter.convertToDto(userDao);
    } else {
      throw new HandledError(Responses.notFound);
    }
  }

  public async loginUser(user: User): Promise<JwtAuthenticationResponse> {
    if (user.username && user.password) {
      const userDao: UserDao | null = await UserRepository.findOneByUsername(user.username);
      if (userDao) {
        const checkedPassword: boolean = await verifyEncryption(user.password, userDao.password);
        if (checkedPassword) {
          const jwtAuthenticationResponse: JwtAuthenticationResponse = signJwt(userDao.username);
          return jwtAuthenticationResponse;
        } else {
          throw new HandledError(Responses.unauthorized);
        }
      } else {
        throw new HandledError(Responses.notFound);
      }
    } else {
      throw new HandledError(Responses.badRequest);
    }
  }

  public async deleteUser(userId: string): Promise<boolean> {
    const isUserDeleted: boolean = await UserRepository.deleteOneById(userId);
    if (!isUserDeleted) {
      throw new HandledError(Responses.notFound);
    }
    return isUserDeleted;
  }
}

export default new UserService();