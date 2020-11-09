const validateOrThrow = <T>(validationFn: (obj: any) => boolean, errorMsg: string) => (
  obj: any
): obj is T => {
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
  }, 'doit être un nombre strictement positif')(obj)

export const makePropertyValidator = (validatorMap: Record<string, (obj: any) => void>) => (
  object: Record<string, any>
): Record<string, string> =>
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
