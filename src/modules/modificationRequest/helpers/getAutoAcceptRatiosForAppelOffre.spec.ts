import { getAutoAcceptRatiosForAppelOffre } from '.'

describe('getAutoAcceptRatios()', () => {
  describe('when appel offre is "CRE4 - Innovation"', () => {
    it('should return ratios 70-100%', () => {
      const res = getAutoAcceptRatiosForAppelOffre('CRE4 - Innovation')
      expect(res).toEqual({ min: 0.7, max: 1 })
    })
  })

  describe('when appel offre is "CRE4 - Autoconsommation métropole 2016"', () => {
    it('should return ratios 80-100%', () => {
      const res = getAutoAcceptRatiosForAppelOffre('CRE4 - Autoconsommation métropole 2016')
      expect(res).toEqual({ min: 0.8, max: 1 })
    })
  })

  describe('when appel offre is "CRE4 - Autoconsommation métropole"', () => {
    it('should return ratios 80-100%', () => {
      const res = getAutoAcceptRatiosForAppelOffre('CRE4 - Autoconsommation métropole')
      expect(res).toEqual({ min: 0.8, max: 1 })
    })
  })

  describe('when appel offre is "CRE4 - Autoconsommation ZNI"', () => {
    it('should return ratios 80-100%', () => {
      const res = getAutoAcceptRatiosForAppelOffre('CRE4 - Autoconsommation ZNI')
      expect(res).toEqual({ min: 0.8, max: 1 })
    })
  })

  describe('when appel offre is "CRE4 - Autoconsommation ZNI 2017"', () => {
    it('should return ratios 80-100%', () => {
      const res = getAutoAcceptRatiosForAppelOffre('CRE4 - Autoconsommation ZNI 2017')
      expect(res).toEqual({ min: 0.8, max: 1 })
    })
  })

  describe('when appel offre is "CRE4 - Bâtiment"', () => {
    it('should return ratios 90-110%', () => {
      const res = getAutoAcceptRatiosForAppelOffre('CRE4 - Bâtiment')
      expect(res).toEqual({ min: 0.9, max: 1.1 })
    })
  })

  describe('when appel offre is "CRE4 - Sol"', () => {
    it('should return ratios 90-110%', () => {
      const res = getAutoAcceptRatiosForAppelOffre('CRE4 - Sol')
      expect(res).toEqual({ min: 0.9, max: 1.1 })
    })
  })

  describe('when appel offre is "Fessenheim"', () => {
    it('should return ratios 90-110%', () => {
      const res = getAutoAcceptRatiosForAppelOffre('Fessenheim')
      expect(res).toEqual({ min: 0.9, max: 1.1 })
    })
  })

  describe('when appel offre is "CRE4 - Eolien"', () => {
    it('should return ratios 90-110%', () => {
      const res = getAutoAcceptRatiosForAppelOffre('CRE4 - Eolien')
      expect(res).toEqual({ min: 0.9, max: 1.1 })
    })
  })

  describe('when appel offre is "CRE4 - ZNI 2017"', () => {
    it('should return ratios 90-110%', () => {
      const res = getAutoAcceptRatiosForAppelOffre('CRE4 - ZNI 2017')
      expect(res).toEqual({ min: 0.9, max: 1.1 })
    })
  })

  describe('when appel offre is "CRE4 - ZNI"', () => {
    it('should return ratios 90-110%', () => {
      const res = getAutoAcceptRatiosForAppelOffre('CRE4 - ZNI')
      expect(res).toEqual({ min: 0.9, max: 1.1 })
    })
  })

  describe('when appel offre is anything else', () => {
    it('should return ratios 90-110%', () => {
      const res = getAutoAcceptRatiosForAppelOffre('my default appel offre')
      expect(res).toEqual({ min: 0.9, max: 1.1 })
    })
  })
})


