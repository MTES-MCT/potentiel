import { Request } from 'express';

export type FormErrors = Record<string, string>;

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
      formErrors?: FormErrors;
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
  const apiResults = request.session.apiResults;

  if (apiResults) {
    const { [route]: apiResult, ...clearedApiResults } = apiResults;

    request.session.apiResults = clearedApiResults;

    return apiResult as ApiResult<TResult>;
  }
};
