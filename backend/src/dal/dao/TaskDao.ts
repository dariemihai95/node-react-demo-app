import { Table, Column, Model, ForeignKey, Unique, DataType, AllowNull, BelongsTo } from 'sequelize-typescript';
import UserDao from './UserDao';
import { daoModelName } from '../../utils/constants';

@Table({
  tableName: daoModelName.task
})
class TaskDao extends Model<TaskDao> {

  @Unique
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID
  })
  get taskId(): string {
    return this.getDataValue('taskId');
  }
  set taskId(value: string) {
    this.setDataValue('taskId', value);
  }

  @Column
  get name(): string {
    return this.getDataValue('name')
  }
  set name(value: string) {
    this.setDataValue('name', value)
  }

  @Column
  get description(): string {
    return this.getDataValue('description')
  }
  set description(value: string) {
    this.setDataValue('description', value)
  }

  @Column
  get dueDate(): string {
    return this.getDataValue('dueDate')
  }
  set dueDate(value: string) {
    this.setDataValue('dueDate', value)
  }

  @Column
  get status(): string {
    return this.getDataValue('status')
  }
  set status(value: string) {
    this.setDataValue('status', value)
  }

  @AllowNull
  @Column
  get tags(): string {
    return this.getDataValue('tags')
  }
  set tags(value: string) {
    this.setDataValue('tags', value)
  }

  @ForeignKey(() => UserDao)
  @Column({
    defaultValue: DataType.UUIDV4,
    type: DataType.UUID
  })
  get userId(): string {
    return this.getDataValue('userId')
  }
  set userId(value: string) {
    this.setDataValue('userId', value)
  }

  @BelongsTo(() => UserDao)
  get user(): UserDao {
    return this.getDataValue('user')
  }
  set user(value: UserDao) {
    this.setDataValue('user', value)
  }

}

export default TaskDao;