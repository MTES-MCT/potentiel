const toNumber = str => {
  return typeof str === 'number'
    ? str
    : typeof str === 'string'
    ? Number(str.replace(/,/g, '.'))
    : undefined
}

export default toNumber
