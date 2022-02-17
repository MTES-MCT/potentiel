import { Periode, ProjectAppelOffre } from '@entities'
import { isModificationPuissanceAuto } from './isModificationPuissanceAuto'

describe('isModificationPuissanceAuto for CRE4', () => {
  describe(`when the project was notified on an appel offre without a reserved volume`, () => {
    const appelOffre = {
      changementPuissance: {
        autoAcceptRatios: { min: 0.7, max: 1.1 },
      },
      periode: { isNotifiedOnPotentiel: true } as Periode,
    } as ProjectAppelOffre

    describe(`when the new puissance is between the min and max auto accept ratios of the initial puissance`, () => {
      it(`should return true`, () => {
        const actual = isModificationPuissanceAuto({
          project: {
            puissanceInitiale: 100,
            appelOffre,
          },
          nouvellePuissance: 80,
        })
        expect(actual).toEqual(true)
      })
    })
    describe(`when the new puissance is below the min ratio of the initial puissance`, () => {
      it(`should return false`, () => {
        const actual = isModificationPuissanceAuto({
          project: {
            puissanceInitiale: 100,
            appelOffre,
          },
          nouvellePuissance: 69.9,
        })
        expect(actual).toEqual(false)
      })
    })
    describe(`when the new puissance is above the max ratio of the initial puissance`, () => {
      it(`should return false`, () => {
        const actual = isModificationPuissanceAuto({
          project: {
            puissanceInitiale: 100,
            appelOffre,
          },
          nouvellePuissance: 110.1,
        })
        expect(actual).toEqual(false)
      })
    })
  })

  describe(`when the project was notified on an appel offre with a reserved volume`, () => {
    const appelOffre = {
      changementPuissance: {
        autoAcceptRatios: { min: 0.7, max: 1.1 },
      },
      periode: {
        isNotifiedOnPotentiel: true,
        noteThresholdBy: 'category',
        noteThreshold: { volumeReserve: { puissanceMax: 10 } },
      } as Periode,
    } as ProjectAppelOffre

    describe(`when the project was notified in the reserved volume`, () => {
      describe(`when the new puissance exceed the max power of the reserved volume`, () => {
        it(`should return false`, () => {
          const actual = isModificationPuissanceAuto({
            project: { puissanceInitiale: 10, appelOffre },
            nouvellePuissance: 10.1,
          })
          expect(actual).toEqual(false)
        })
      })
    })
  })

  describe(`when appel offre is undefined`, () => {
    describe(`when the new puissance is between 90% and 110% of the initial one`, () => {
      it(`should return true`, () => {
        const actual = isModificationPuissanceAuto({
          project: { puissanceInitiale: 100 },
          nouvellePuissance: 105,
        })
        expect(actual).toEqual(true)
      })
    })
    describe(`when the new puissance is below 90% of the initial one`, () => {
      it(`should return false`, () => {
        const actual = isModificationPuissanceAuto({
          project: { puissanceInitiale: 100 },
          nouvellePuissance: 89.9,
        })
        expect(actual).toEqual(false)
      })
    })
    describe(`when the new puissance is above 110% of the initial one`, () => {
      it(`should return false`, () => {
        const actual = isModificationPuissanceAuto({
          project: { puissanceInitiale: 100 },
          nouvellePuissance: 110.1,
        })
        expect(actual).toEqual(false)
      })
    })
  })
})
