import { JwtAuthenticationResponse } from '../openapi/model/jwtAuthenticationResponse';
import { jwtExpiry } from '../utils/constants';
import * as jwt from "jsonwebtoken";
import { HandledError } from '../config/HandledError';

export const verifyAccessToken = (request: any, callbackSuccess: any, callbackError: any): void => {
  const bearerToken: string = <string>request.headers.authorization;
  const accessToken = bearerToken.split(' ')[1];
  jwt.verify(accessToken, process.env.ACCESS_KEY || "", function (error, decoded) {
    if (error) {
      callbackError(new HandledError({ ...error, status: 400 }));
    }
    callbackSuccess(true);
  });
};

export const signJwt = (username: string): JwtAuthenticationResponse => {
  const jwtAuthenticationResponseToken: JwtAuthenticationResponse = new JwtAuthenticationResponse();
  if (username) {
    const accessToken: string = jwt.sign({
      username: username,
    }, process.env.ACCESS_KEY || "jwt", {
      expiresIn: jwtExpiry.auth
    });
    jwtAuthenticationResponseToken.accessToken = accessToken;
  }
  return jwtAuthenticationResponseToken;
}
