import { Periode, ProjectAppelOffre } from '@entities'
import { exceedsPuissanceMaxDuVolumeReserve } from './exceedsPuissanceMaxDuVolumeReserve'

describe('exceedsPuissanceMaxDuVolumeReserve', () => {
  describe(`when the project has an appel offre with a reserved volume`, () => {
    const appelOffre = {
      changementPuissance: {
        ratios: { min: 0.7, max: 1.1 },
      },
      periode: {
        noteThresholdBy: 'category',
        noteThreshold: { volumeReserve: { puissanceMax: 10 } },
      } as Periode,
    } as ProjectAppelOffre

    describe(`when the project was notified in the reserved volume`, () => {
      describe(`when the new puissance exceed the max power of the reserved volume`, () => {
        it(`should return true`, () => {
          const actual = exceedsPuissanceMaxDuVolumeReserve({
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
          const actual = exceedsPuissanceMaxDuVolumeReserve({
            project: { puissanceInitiale: 15, appelOffre },
            nouvellePuissance: 16,
          })
          expect(actual).toBe(false)
        })
      })
    })
  })
})
