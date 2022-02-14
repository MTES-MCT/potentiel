import { AppelOffre } from '@entities'
import { getAutoAcceptRatiosForAppelOffre } from '.'

describe('getAutoAcceptRatios()', () => {
  describe(`when it's an innovation appel offre`, () => {
    it('should return ratios 70-100%', () => {
      const res = getAutoAcceptRatiosForAppelOffre({ type: 'innovation' } as AppelOffre)
      expect(res).toEqual({ min: 0.7, max: 1 })
    })
  })

  describe(`when it's an autoconso appel offre`, () => {
    it('should return ratios 80-100%', () => {
      const res = getAutoAcceptRatiosForAppelOffre({ type: 'autoconso' } as AppelOffre)
      expect(res).toEqual({ min: 0.8, max: 1 })
    })
  })

  describe(`when it's another appel offre`, () => {
    const testFixture: AppelOffre['type'][] = [
      'batiment',
      'sol',
      'zni',
      'eolien',
      'neutre',
      'autre',
    ]
    for (const type of testFixture) {
      describe(`when it's an ${type} appel offre`, () => {
        it('should return ratios 90-110%', () => {
          const res = getAutoAcceptRatiosForAppelOffre(type ? ({ type } as AppelOffre) : undefined)
          expect(res).toEqual({ min: 0.9, max: 1.1 })
        })
      })
    }
  })

  describe(`when appel offre is undefined`, () => {
    it('should return ratios 90-110%', () => {
      const res = getAutoAcceptRatiosForAppelOffre(undefined)
      expect(res).toEqual({ min: 0.9, max: 1.1 })
    })
  })
})
