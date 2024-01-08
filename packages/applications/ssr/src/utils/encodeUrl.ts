import { Route } from 'next';

export const encodeUrl = (templateUrl: string, parameters: Record<string, string>): Route => {
  let dynamicUrl = templateUrl;

  for (const [key, value] of Object.entries(parameters)) {
    dynamicUrl = dynamicUrl.replace(`:${key}`, encodeURIComponent(value));
  }

  return dynamicUrl as Route;
};
