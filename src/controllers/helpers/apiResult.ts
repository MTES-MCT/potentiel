import { Request } from 'express';

export type ApiResult<TResult> = {
  route: string;
} & (
  | {
      status: 'OK';
      result?: TResult;
    }
  | {
      status: 'BAD_REQUEST';
      message: string;
      errors?: Record<string, string>;
    }
);

export const setApiResult = <TResult>(
  request: Request,
  { route, ...result }: ApiResult<TResult>,
): void => {
  request.session.apiResults = {
    ...request.session.apiResults,
    [route]: result,
  };
};

export const getApiResult = <TResult>(
  request: Request,
  route: string,
): ApiResult<TResult> | undefined => {
  console.info(JSON.stringify(request.session.apiResults));

  const apiResults = request.session.apiResults;
  if (apiResults) {
    const { [route]: apiResult, ...clearedApiResults } = apiResults;

    request.session.apiResults = clearedApiResults;

    return apiResult as ApiResult<TResult>;
  }
};
