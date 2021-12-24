import { AxiosResponse } from 'axios';
import { URIBase, path, RequestMethod } from '../utils/constants';
import { isObjectEmpty, isString } from '../utils/validators';
import axios from 'axios';
import qs from 'qs';

let instance = axios.create({
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  // withCredentials: true
});

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
    data: qs.stringify({
      ...body,
    })
  };
};

export const makeRequest = async (method: RequestMethod, uriBase: URIBase, path: string, body: object, shouldReturnError?: boolean, functionName?: string): Promise<any> => {
  return instance(makeAxiosConfig(method, uriBase, path, body))
    .then((response: AxiosResponse) => {
      console.warn(response)
      const apiResponse = response.data;
      if (!apiResponse) {
        throw new Error('Unexpected error: Missing Axios response data');
      } else {
        if (apiResponse.code) {
          throw new Error(apiResponse.message);
        }
        if (apiResponse.status) {
          if (isObjectEmpty(apiResponse.data)) {
            throw new Error('Unexpected error: Missing Api response data');
          }
        } else {
          throw new Error(apiResponse.message);
        }
      }
      return apiResponse || {};
    })
    .catch((error: any) => {
      console.log(functionName || '[makeRequest]', error.message);
      if (shouldReturnError) {
        if (isString(error.message)) {
          return `* ${error.message}`;
        } else {
          return '';
        }
      }
    });
};

export const postRegister = async (): Promise<any> => {
  return await makeRequest(RequestMethod.POST, URIBase.api, path.register, {}, false, '[postRegister]');
};

export const postLogin = async (): Promise<any> => {
  return await makeRequest(RequestMethod.POST, URIBase.api, path.login, {}, false, '[postLogin]');
};

export const postCreateTask = async (): Promise<any> => {
  return await makeRequest(RequestMethod.POST, URIBase.api, path.createTask, {}, false, '[postCreateTask]');
};

export const getTaskList = async (): Promise<any> => {
  return await makeRequest(RequestMethod.GET, URIBase.api, path.getTaskList, {}, false, '[getTaskList]');
};

export const getTask = async (): Promise<any> => {
  return await makeRequest(RequestMethod.GET, URIBase.api, path.getTask, {}, false, '[getTask]');
};
