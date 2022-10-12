import { ValidationError } from 'yup'
import { CsvValidationError } from './errors'

export const mapYupValidationErrorToCsvValidationError = (error: ValidationError) => {
  if (!error) {
    return new CsvValidationError([])
  }

  const errors = error.inner.reduce((acc, err) => {
    const { path, params, errors = ['Une erreur est survenue'] } = err

    const numéroLigne = path ? Number(path.slice(1, 2)) + 2 : undefined
    if (!numéroLigne) {
      return acc
    }

    return [
      ...acc,
      {
        numéroLigne,
        valeur: params && params.originalValue ? params.originalValue.toString() : undefined,
        erreur: errors[0],
      },
    ]
  }, [])

  return new CsvValidationError(errors)
}
