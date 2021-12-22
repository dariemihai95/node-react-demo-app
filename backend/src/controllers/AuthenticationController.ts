import * as express from 'express';
import UserService from '../services/UserService';
import { User } from '../openapi/model/user';
import { JwtAuthenticationResponse } from '../openapi/model/jwtAuthenticationResponse';
import { Responses } from '../config/Responses';

class AuthenticationController {

  static test = async (request: any, response: express.Response, next: express.NextFunction) => {
    response.status(Responses.created.status).send(true);
  }

  static register = async (request: any, response: express.Response, next: express.NextFunction) => {
    const user: User = request.body;
    const createdUser: User | null = await UserService.createUser(user);
    response.status(Responses.created.status).send(createdUser);
  }

  static login = async (request: any, response: express.Response, next: express.NextFunction) => {
    const user: User = request.body;
    const jwtAuthenticationResponse: JwtAuthenticationResponse = await UserService.loginUser(user);
    response.status(Responses.created.status).send(jwtAuthenticationResponse);
  }

}

export default AuthenticationController;