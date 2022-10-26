import { ValidationError } from 'yup'
import { CsvValidationError } from './errors'

const getNuméroLigne = (path: string | undefined) => {
  const extractLigne = path?.replace(/\D/g, '')
  if (!extractLigne) {
    return
  }

  return Number(extractLigne) + 2
}

export const mapYupValidationErrorToCsvValidationError = (error: ValidationError) => {
  const validationErreurs = error.inner.reduce((acc, err) => {
    const { path, params, errors } = err
    const numéroLigne = getNuméroLigne(path)

    if (!errors?.length) {
      return [...acc]
    }

    const valeurInvalide =
      typeof params?.originalValue?.toString === 'function' &&
      typeof params.originalValue === 'string'
        ? params.originalValue
        : undefined

    const [raison] = errors

    return [
      ...acc,
      {
        ...(numéroLigne && { numéroLigne }),
        ...(valeurInvalide && { valeurInvalide: valeurInvalide.toString() }),
        raison,
      },
    ]
  }, [])

  console.log('validation Erreurs', validationErreurs)

  return new CsvValidationError(validationErreurs)
}
