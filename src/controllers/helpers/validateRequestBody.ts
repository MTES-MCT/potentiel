import { err, ok, Result } from '@core/utils'
import { BaseSchema, InferType, ValidationError } from 'yup'

export const validateRequestBody = (
  body: Request['body'],
  schema: BaseSchema
): Result<InferType<typeof schema>, RequestValidationError | Error> => {
  try {
    return ok(schema.validateSync(body, { abortEarly: false }))
  } catch (error) {
    if (error instanceof ValidationError) {
      const errors = error.inner.reduce(
        (errors, { path, message }) => ({ ...errors, [`error-${path}`]: message }),
        {}
      )
      return err(new RequestValidationError(errors))
    }

    return err(error)
  }
}

export class RequestValidationError extends Error {
  constructor(public errors: { [fieldName: string]: string }) {
    super("La requête n'est pas valide.")
  }
}
