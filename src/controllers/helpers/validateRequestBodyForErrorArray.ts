import { err, ok, Result } from '@core/utils'
import { BaseSchema, InferType, ValidationError } from 'yup'

export class RequestValidationErrorArray extends Error {
  constructor(public errors: Array<string>) {
    super("L'attestation de constitution des garanties financières n'a pas pu être envoyée.")
  }
}

export const validateRequestBodyForErrorArray = (
  body: Request['body'],
  schema: BaseSchema
): Result<InferType<typeof schema>, RequestValidationErrorArray | Error> => {
  try {
    return ok(schema.validateSync(body, { abortEarly: false }))
  } catch (error) {
    if (error instanceof ValidationError) {
      return err(new RequestValidationErrorArray(error.errors))
    }
    return err(error)
  }
}
