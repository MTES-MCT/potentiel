import { Periode, ProjectAppelOffre } from '@entities'
import { exceedsPuissanceMaxDuVolumeReserve } from './exceedsPuissanceMaxDuVolumeReserve'

describe('exceedsPuissanceMaxDuVolumeReserve', () => {
  describe(`when the project has an appel offre with a volume reservé`, () => {
    const appelOffre = {
      periode: {
        noteThresholdBy: 'category',
        noteThreshold: { volumeReserve: { puissanceMax: 10 } },
      } as Periode,
    } as ProjectAppelOffre

    describe(`when the project was notified in the volume reservé`, () => {
      describe(`when the new puissance exceed the puissance max of the volume reservé`, () => {
        it(`should return true`, () => {
          const actual = exceedsPuissanceMaxDuVolumeReserve({
            project: { puissanceInitiale: 10, appelOffre },
            nouvellePuissance: 10.1,
          })
          expect(actual).toBe(true)
        })
      })
    })

    describe(`when the project was not notified in the volume reservé`, () => {
      describe(`when the new puissance exceed the puissance max of the volume reservé`, () => {
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
