import { AxiosResponse } from 'axios';
import { URIBase, path, RequestMethod } from '../utils/constants';
import { isString } from '../utils/validators';
import axios from 'axios';
import { IJwtAuthenticationResponse, ITask, IUser } from '../openapi';

export const makeAxiosConfig = (method: RequestMethod, uriBase: URIBase, path: string, body: object) => {
  let url = uriBase + path;
  if (method === RequestMethod.GET) {
    let query = '';
    for (const [key, value] of Object.entries(body)) {
      query = query + `&${key}=${value}`;
    }
    query = query.replace('&', "?")
    url = uriBase + path + query;
    return {
      method: method,
      url: url
    };
  }
  return {
    method: method,
    url: url,
    data: JSON.stringify({
      ...body
    })
  };
};

export const makeRequest = async (method: RequestMethod, uriBase: URIBase, path: string, body: object, shouldReturnError?: boolean, functionName?: string, jwt?: string): Promise<any> => {
  return axios.create({
    headers: { 'Content-Type': 'application/json', 'Authorization': jwt ? `Bearer ${jwt}` : '' },
    timeout: 10000,
    // withCredentials: true
  })(makeAxiosConfig(method, uriBase, path, body))
    .then((response: AxiosResponse) => {
      const apiResponse = response.data;
      if (!apiResponse) {
        throw new Error('Unexpected error: Missing Axios response data');
      }
      return response.data;
    })
    .catch((error: any) => {
      console.error(`${error.response.data.name}:`, error.response.data.message);
      if (shouldReturnError) {
        if (isString(error.response.data.message)) {
          return `* ${error.response.data.status} ${error.response.data.message}`;
        } else {
          return '';
        }
      }
    });
};

export const postRegister = async (payload: IUser): Promise<{ username: string } | string> => {
  return await makeRequest(RequestMethod.POST, URIBase.api, path.register, payload, true, '[postRegister]');
};

export const postLogin = async (payload: IUser): Promise<IJwtAuthenticationResponse | string> => {
  return await makeRequest(RequestMethod.POST, URIBase.api, path.login, payload, true, '[postLogin]');
};

export const postCreateTask = async (payload: ITask, jwt: string): Promise<ITask | string> => {
  return await makeRequest(RequestMethod.POST, URIBase.api, path.createTask, payload, true, '[postCreateTask]', jwt);
};

export const getTaskList = async (queryItems: { pageSize?: number, pageNumber?: number, order?: string, sortBy?: string }, jwt: string): Promise<ITask[] | string> => {
  return await makeRequest(RequestMethod.GET, URIBase.api, path.getTaskList, queryItems, true, '[getTaskList]', jwt);
};

export const getTask = async (jwt: string): Promise<ITask | string> => {
  return await makeRequest(RequestMethod.GET, URIBase.api, path.getTask, {}, true, '[getTask]', jwt);
};
