import expressAsyncHandler from 'express-async-handler'
import type express from 'express'
import type core from 'express-serve-static-core'

export default function asyncHandler<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query
>(
  handler: (...args: Parameters<express.RequestHandler<P, ResBody, ReqBody, ReqQuery>>) => any
): express.RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return expressAsyncHandler(async (...args) => {
    await handler(...args)
  })
}
