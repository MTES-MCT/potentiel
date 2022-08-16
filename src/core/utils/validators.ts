import { DomainError } from '../domain'
import { err, ok, Result } from './Result'

const validateOrThrow =
  <T>(validationFn: (obj: any) => boolean, errorMsg: string) =>
  (obj: any): obj is T => {
    if (!validationFn(obj)) throw new Error(errorMsg)
    return true
  }

const _isNumber = (nbr: any) => {
  return typeof nbr === 'number' && !isNaN(nbr) && isFinite(nbr)
}

export const isNumber = validateOrThrow<number>(_isNumber, 'doit être un nombre')

export const isPositiveNumber = validateOrThrow<number>((nbr: any) => {
  return _isNumber(nbr) && nbr >= 0
}, 'doit être un nombre positif')

export const isStrictlyPositiveNumber = validateOrThrow<number>((nbr: any) => {
  return _isNumber(nbr) && nbr > 0
}, 'doit être un nombre strictement positif')

export const isDefined = <T>(obj: any): obj is T =>
  validateOrThrow((nbr: any) => {
    return typeof nbr !== 'undefined'
  }, 'doit être défini')(obj)

interface PropertyValidator {
  (object: Record<string, any>): Record<string, string>
}

export const makePropertyValidator =
  (validatorMap: Record<string, (obj: any) => void>): PropertyValidator =>
  (object) =>
    Object.entries(object).reduce((errorInProperty, [objectKey, objectValue]) => {
      if (objectKey in validatorMap) {
        // this property is has a validator
        try {
          validatorMap[objectKey](objectValue)
        } catch (e) {
          errorInProperty[objectKey] = e.message
        }
      }

      return errorInProperty
    }, {})

interface HasErrorFieldsContructor {
  new (errorsInFields: Record<string, string>): any
}

export const ValidationError: HasErrorFieldsContructor = class ValidationError extends DomainError {
  constructor(errorsInFields: Record<string, string>) {
    super(
      `Champs erronés: ${Object.entries(errorsInFields)
        .map(([key, value]) => `${key} (${value})`)
        .join(', ')}`
    )
  }
}

export const makeValidator = <T, E extends HasErrorFieldsContructor>(
  validatorMap: Record<string, (obj: any) => void>,
  ErrorType: E
) => {
  const propertyValidator = makePropertyValidator(validatorMap)

  return (object: T): Result<T, E> => {
    const errorsInFields = propertyValidator(object)
    if (Object.keys(errorsInFields).length) {
      return err(new ErrorType(errorsInFields))
    }
    return ok(object)
  }
}
