export default function (query): Array<{ [fieldName: string]: string }> {
  return Object.entries(query).reduce(
    (errors, [key, value]) => ({
      ...errors,
      ...(key.startsWith('error-') && { [key.replace('error-', '')]: value }),
    }),
    [] as Array<{ [fieldName: string]: string }>
  )
}
