import { ValidationError } from 'yup'
import { CsvValidationError } from './errors'

export const mapYupValidationErrorToCsvValidationError = (error: ValidationError) => {
  if (!error) {
    return new CsvValidationError({ validationErreurs: [] })
  }

  const validationErreurs = error.inner.reduce((acc, err) => {
    const { path, params, errors } = err

    const numéroLigne = path ? Number(path.slice(1, 2)) + 2 : undefined
    if (!numéroLigne || !errors?.length || typeof params?.originalValue !== 'string') {
      return [...acc]
    }

    return [
      ...acc,
      {
        numéroLigne,
        valeur: params.originalValue,
        erreur: errors[0],
      },
    ]
  }, [])

  return new CsvValidationError({ validationErreurs })
}
