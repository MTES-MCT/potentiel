export const yupFormatCsvDataError = (
  error,
  defaultMessage = 'Une erreur est survenue lors de la validation des données'
) => {
  if (!error || !error.inner || !error.inner.length) {
    return [defaultMessage]
  }

  return error.inner.reduce((acc, err) => {
    const { path, params, errors = ['Une erreur est survenue'] } = err

    let index
    let formattedErreur = ''

    if (path) {
      index = Number(err.path.slice(1, 2))
      index += 2
      formattedErreur += `Ligne ${index} - `
    }

    if (params && params.originalValue) {
      formattedErreur += `${params.originalValue} - `
    }

    formattedErreur += `${errors[0]}`

    acc.push(formattedErreur)
    return acc
  }, [])
}
