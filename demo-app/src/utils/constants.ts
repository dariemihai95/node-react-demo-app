export enum RequestMethod {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
  DELETE = 'delete'
}

export const path = {
  register: '/authentication/register',
  login: '/authentication/login',
  createTask: '/api/task',
  getTaskList: '/api/tasks',
  getTask: '/api/task',
};

export enum URIBase {
  api = 'http://localhost:3001',
}
