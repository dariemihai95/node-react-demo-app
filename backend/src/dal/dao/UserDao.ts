import { Table, Column, Model, ForeignKey, Unique, DataType, HasMany } from 'sequelize-typescript';
import TaskDao from './TaskDao';
import { daoModelName } from '../../utils/constants';

@Table({
  tableName: daoModelName.user
})
class UserDao extends Model<UserDao> {

  @Unique
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID
  })
  get userId(): string {
    return this.getDataValue('userId');
  }
  set userId(value: string) {
    this.setDataValue('userId', value);
  }

  @Unique
  @Column
  get username(): string {
    return this.getDataValue('username')
  }
  set username(value: string) {
    this.setDataValue('username', value)
  }

  @Column
  get password(): string {
    return this.getDataValue('password')
  }
  set password(value: string) {
    this.setDataValue('password', value)
  }

  @HasMany(() => TaskDao)
  get tasks(): TaskDao[] {
    return this.getDataValue('tasks')
  }

}

export default UserDao;