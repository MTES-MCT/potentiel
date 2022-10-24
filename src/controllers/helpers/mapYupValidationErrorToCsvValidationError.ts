import { ValidationError } from 'yup'
import { CsvValidationError } from './errors'

const getNuméroLigne = (path: string | undefined) => {
  if (!path) {
    return undefined
  }

  const extractLigne = path?.replace(/\D/g, '')
  if (!extractLigne) {
    return undefined
  }

  return Number(extractLigne) + 2
}

export const mapYupValidationErrorToCsvValidationError = (error: ValidationError) => {
  const validationErreurs = error.inner.reduce((acc, err) => {
    const { path, params, errors } = err
    const numéroLigne = getNuméroLigne(path)

    if (!numéroLigne || !errors?.length) {
      return [...acc]
    }

    const valeurInvalide =
      typeof params?.originalValue?.toString === 'function' ? params.originalValue : undefined

    const [raison] = errors

    return [
      ...acc,
      {
        numéroLigne,
        valeurInvalide: valeurInvalide?.toString(),
        raison,
      },
    ]
  }, [])

  return new CsvValidationError(validationErreurs)
}
