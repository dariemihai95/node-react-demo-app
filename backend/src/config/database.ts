import { Sequelize } from 'sequelize-typescript';
import TaskDao from '../dal/dao/TaskDao';
import UserDao from '../dal/dao/UserDao';

export const sequelize = new Sequelize({
  dialect: process.env.DB_LANG as 'postgres' || 'postgres',
  host: process.env.DB_HOST || 'host.docker.internal', //TODO add you specific host
  port: parseInt(`${process.env.DB_PORT}`, 10) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'docker',
  database: process.env.DB_NAME || 'postgres',
  models: [UserDao, TaskDao],
  define: {
    underscored: true,
  },
  logging: false
});