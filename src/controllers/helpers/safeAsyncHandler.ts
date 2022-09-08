import expressAsyncHandler from 'express-async-handler'
import type core from 'express-serve-static-core'
import { BaseSchema, InferType } from 'yup'
import { RequestHandler } from 'express'
import { errorResponse } from './errorResponse'

export default function safeAsyncHandler<Schema extends BaseSchema>(
  {
    schema,
    onError,
  }: {
    schema: Schema
    onError: ({
      request,
      response,
      error,
      errors,
    }: {
      request: core.Request<core.ParamsDictionary, any, InferType<Schema>['body'], core.Query>
      response: core.Response
      error
      errors: Record<string, string>
    }) => any
  },
  handler: (
    ...args: Parameters<
      RequestHandler<core.ParamsDictionary, any, InferType<Schema>['body'], core.Query>
    >
  ) => any
): RequestHandler<core.ParamsDictionary, any, InferType<Schema>['body'], core.Query> {
  return expressAsyncHandler(async (request, response, next) => {
    try {
      schema.validateSync({ body: request.body, params: request.params }, { abortEarly: false })
    } catch (error) {
      if (onError) {
        const errors = error.inner.reduce(
          (errors, { path, message }) => ({ ...errors, [`error-${path}`]: message }),
          {}
        )
        onError({ request, response, error, errors })
        return
      }
      errorResponse({
        request,
        response,
        customMessage: `Requête incorrecte`,
        customStatus: 400,
      })
      return
    }
    await handler(request, response, next)
  })
}
