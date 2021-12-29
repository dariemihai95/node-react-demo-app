export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export const isObjectEmpty = (obj: object): boolean => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object; // true for null and undefined
};

export const isObject = (variable: any): boolean => {
  if (typeof variable === 'object' && !Array.isArray(variable) && variable !== null) {
    return true;
  } else {
    return false;
  }
};

export const isObjectAndNotEmpty = (variable: any): boolean => {
  if (isObject(variable) && !isObjectEmpty(variable)) {
    return true;
  } else {
    return false;
  }
};

export const isString = (variable: any): boolean => {
  return (typeof variable === 'string' || variable instanceof String);
};

export const isNumber = (variable: any): boolean => {
  return typeof variable == 'number';
};

export const replaceString = (text: string, toFindInWord: string): string => {
  return text.replace(toFindInWord, '');
};
