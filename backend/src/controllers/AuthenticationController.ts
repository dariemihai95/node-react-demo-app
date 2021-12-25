import * as express from 'express';
import UserService from '../services/UserService';
import { User } from '../openapi/model/user';
import { JwtAuthenticationResponse } from '../openapi/model/jwtAuthenticationResponse';
import { Responses } from '../config/Responses';

module.exports = {
  test: (request: express.Request, response: express.Response, next: express.NextFunction) => {
    response.status(Responses.created.status).send(true)
    next();
  },

  register: async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
      const user: User = request.body;
      const createdUser: User | null = await UserService.createUser(user);
      response.status(Responses.created.status).send(createdUser);
    } catch (error: any) {
      next(error);
    }
  },

  login: async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
      const user: User = request.body;
      const jwtAuthenticationResponse: JwtAuthenticationResponse = await UserService.loginUser(user);
      response.status(Responses.created.status).send(jwtAuthenticationResponse);
    } catch (error: any) {
      next(error);
    }
  }
};