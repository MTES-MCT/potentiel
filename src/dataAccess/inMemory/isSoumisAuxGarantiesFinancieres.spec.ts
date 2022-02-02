import { isSoumisAuxGarantiesFinancieres } from '.'

describe('appelOffre.isSoumisAuxGarantiesFinancieres', () => {
  describe('when appelOffreId is "Eolien" (CRE4), "PPE2 - Sol", "PPE2 - Bâtiment", "PPE2 - Autoconsommation métropole", "PPE2 - Eolien", "PPE2 - Neutre" or "CRE4 - ZNI 2017"', () => {
    for (const appelOffre of [
      'Eolien',
      'PPE2 - Sol',
      'PPE2 - Bâtiment',
      'PPE2 - Autoconsommation métropole',
      'PPE2 - Eolien',
      'PPE2 - Neutre',
      'CRE4 - Sol',
      'CRE4 - ZNI 2017',
    ]) {
      describe(`when appelOffreId is ${appelOffre}`, () => {
        it('should return true', () => {
          expect(isSoumisAuxGarantiesFinancieres(appelOffre, '')).toEqual(true)
        })
      })
    }
  })
  describe('when appel offre is "CRE4 - Innovation", "CRE4 - Autoconsommation métropole, "CRE4 - Autoconsommation ZNI", "CRE4 - Autoconsommation métropole 2016", "CRE4 - Autoconsommation ZNI 2017", or "PPE2 - Innovation"', () => {
    for (const appelOffre of [
      'CRE4 - Innovation',
      'CRE4 - Autoconsommation métropole',
      'CRE4 - Autoconsommation ZNI',
      'CRE4 - Autoconsommation métropole 2016',
      'CRE4 - Autoconsommation ZNI 2017',
      'PPE2 - Innovation',
    ]) {
      describe(`when appelOffreId is ${appelOffre}`, () => {
        it('should return false', () => {
          expect(isSoumisAuxGarantiesFinancieres(appelOffre, '')).toEqual(false)
        })
      })
    }
  })
  describe('when appelOffreId "CRE4 - bâtiment" and famille is "2"', () => {
    it('should return true', () => {
      expect(isSoumisAuxGarantiesFinancieres('CRE4 - Bâtiment', '2')).toEqual(true)
    })
  })
  describe('when appelOffreId is "CRE4 - bâtiment" and famille is "1"', () => {
    it('should return false', () => {
      expect(isSoumisAuxGarantiesFinancieres('CRE4 - Bâtiment', '1')).toEqual(false)
    })
  })
  describe('when appelOffreId is "CRE4 - ZNI" and famille is 1b, 1c, 2b or 2c', () => {
    for (const famille of ['1b', '1c', '2b', '2c']) {
      describe(`when appelOffreId is "CRE4 - ZNI" and famille is ${famille}`, () => {
        it('should return true', () => {
          expect(isSoumisAuxGarantiesFinancieres('CRE4 - ZNI', famille)).toEqual(true)
        })
      })
    }
  })
  describe('when appelOffreId "CRE4 - ZNI" and famille is 1, 2, 3, 1a or 2a', () => {
    for (const famille of ['1', '2', '3', '1a', '2a']) {
      describe(`when appelOffreId is "CRE4 - ZNI" and famille is ${famille}`, () => {
        it('should return false', () => {
          expect(isSoumisAuxGarantiesFinancieres('CRE4 - ZNI', famille)).toEqual(false)
        })
      })
    }
  })
  describe('when appelOffreId is "Fessenheim" and famille is 1 or 2', () => {
    for (const famille of ['1', '2']) {
      describe(`when appelOffreId is "Fessenheim" and famille is ${famille}`, () => {
        it('should return true', () => {
          expect(isSoumisAuxGarantiesFinancieres('Fessenheim', famille)).toEqual(true)
        })
      })
    }
  })
  describe('when appelOffreId is "Fessenheim" and famille is 3', () => {
    it('should return false', () => {
      expect(isSoumisAuxGarantiesFinancieres('Fessenheim', '3')).toEqual(false)
    })
  })
})
