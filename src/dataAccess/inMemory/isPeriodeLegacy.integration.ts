import { isPeriodeLegacy } from './isPeriodeLegacy'

describe('isPeriodeLegacy', () => {
  it('should return true for a periode that is not notified on potentiel', async () => {
    expect(await isPeriodeLegacy({ appelOffreId: 'Fessenheim', periodeId: '1' })).toEqual(true)
  })

  it('should return false for a periode that is notified on potentiel', async () => {
    expect(await isPeriodeLegacy({ appelOffreId: 'Fessenheim', periodeId: '3' })).toEqual(false)
  })

  it('should return false for a periode that does not exist', async () => {
    expect(await isPeriodeLegacy({ appelOffreId: 'Fessenheim', periodeId: '0' })).toEqual(false)

    expect(await isPeriodeLegacy({ appelOffreId: 'Nothing', periodeId: '1wq' })).toEqual(false)
  })
})
