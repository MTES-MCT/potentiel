import getDepartementRegionFromCodePostal from './getDepartementRegionFromCodePostal'

describe('getDepartementRegionFromCodePostal helper', () => {
  it('should return Corse-du-Sud / Corse for 20000 (Ajaccio)', () => {
    const result = getDepartementRegionFromCodePostal('20000')

    expect(result).toBeDefined()
    if (!result) return
    expect(result.departement).toEqual('Corse-du-Sud')
    expect(result.region).toEqual('Corse')
  })

  it('should return Corse-du-Sud / Corse for 20146 (Sotta)', () => {
    const result = getDepartementRegionFromCodePostal('20146')

    expect(result).toBeDefined()
    if (!result) return
    expect(result.departement).toEqual('Corse-du-Sud')
    expect(result.region).toEqual('Corse')
  })

  it('should return Haute-Corse / Corse for 20243 (Prunelli-di-Fiumorbo)', () => {
    const result = getDepartementRegionFromCodePostal('20243')

    expect(result).toBeDefined()
    if (!result) return
    expect(result.departement).toEqual('Haute-Corse')
    expect(result.region).toEqual('Corse')
  })

  it('should return Rhône / Auvergne-Rhône-Alpes for 69250', () => {
    const result = getDepartementRegionFromCodePostal('69250')

    expect(result).toBeDefined()
    if (!result) return
    expect(result.departement).toEqual('Rhône')
    expect(result.region).toEqual('Auvergne-Rhône-Alpes')
  })

  it('should return La Réunion / La Réunion for 97438 (Sainte-Marie)', () => {
    const result = getDepartementRegionFromCodePostal('97438')

    expect(result).toBeDefined()
    if (!result) return
    expect(result.departement).toEqual('La Réunion')
    expect(result.region).toEqual('La Réunion')
  })

  it('should return codePostal 01456 for 1450', () => {
    const result = getDepartementRegionFromCodePostal('1450')

    expect(result).toBeDefined()
    if (!result) return
    expect(result.codePostal).toEqual('01450')
  })

  it('should return undefined if empty string', () => {
    const result = getDepartementRegionFromCodePostal('')

    expect(result).toBeUndefined()
  })

  it('should return undefined if undefined', () => {
    const result = getDepartementRegionFromCodePostal(undefined)

    expect(result).toBeUndefined()
  })

  it('should return undefined if string under 4 length', () => {
    const result = getDepartementRegionFromCodePostal('123')

    expect(result).toBeUndefined()
  })
})
