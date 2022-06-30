import { err, ok, Result } from '@core/utils'
import { BaseSchema, InferType, ValidationError } from 'yup'

export class RequestValidationErrorArray extends Error {
  constructor(public errors: Array<string>) {
    super("Votre demande n'a pas pu être traitée.")
  }
}

export const validateRequestBodyForErrorArray = <Schema extends BaseSchema>(
  body: Request['body'],
  schema: Schema
): Result<InferType<Schema>, RequestValidationErrorArray | Error> => {
  try {
    return ok(schema.validateSync(body, { abortEarly: false }))
  } catch (error) {
    if (error instanceof ValidationError) {
      return err(new RequestValidationErrorArray(error.errors))
    }
    return err(error)
  }
}
