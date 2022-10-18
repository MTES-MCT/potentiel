import { ValidationError } from 'yup'
import { CsvValidationError } from './errors'

export const mapYupValidationErrorToCsvValidationError = (error: ValidationError) => {
  const validationErreurs = error.inner.reduce((acc, err) => {
    const { path, params, errors } = err

    const numéroLigne = path ? Number(path.slice(1, 2)) + 2 : undefined
    if (!numéroLigne || !errors?.length) {
      return [...acc]
    }

    const valeurInvalide =
      typeof params?.originalValue?.toString === 'function' ? params.originalValue : undefined

    return [
      ...acc,
      {
        numéroLigne,
        valeurInvalide: valeurInvalide?.toString(),
        raison: errors[0],
      },
    ]
  }, [])

  return new CsvValidationError(validationErreurs)
}
