import { Periode, ProjectAppelOffre } from '@entities'
import { exceedMaxPuissanceOfReservedVolume } from './exceedMaxPuissanceOfReservedVolume'

describe('exceedMaxPuissanceOfReservedVolume', () => {
  describe(`when the project has an appel offre with a reserved volume`, () => {
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
        it(`should return true`, () => {
          const actual = exceedMaxPuissanceOfReservedVolume({
            project: { puissanceInitiale: 10, appelOffre },
            nouvellePuissance: 10.1,
          })
          expect(actual).toBe(true)
        })
      })
    })

    describe(`when the project was not notified in the reserved volume`, () => {
      describe(`when the new puissance exceed the max power of the reserved volume`, () => {
        it(`should return false`, () => {
          const actual = exceedMaxPuissanceOfReservedVolume({
            project: { puissanceInitiale: 15, appelOffre },
            nouvellePuissance: 16,
          })
          expect(actual).toBe(false)
        })
      })
    })
  })
})
