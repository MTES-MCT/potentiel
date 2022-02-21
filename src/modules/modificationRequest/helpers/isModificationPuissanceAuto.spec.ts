import { Periode, ProjectAppelOffre, Technologie } from '@entities'
import { eolien } from 'src/dataAccess/inMemory/appelsOffres'
import { isModificationPuissanceAuto } from './isModificationPuissanceAuto'

describe('isModificationPuissanceAuto', () => {
  describe(`when the project was notified on an appel offre without a reserved volume`, () => {
    describe(`when automatic accepted ratios are not by technology`, () => {
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
              technologie: 'pv',
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
              technologie: 'pv',
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
              technologie: 'pv',
            },
            nouvellePuissance: 110.1,
          })
          expect(actual).toEqual(false)
        })
      })
    })

    describe(`when automatic accepted ratios are by technology`, () => {
      const appelOffre = {
        changementPuissance: {
          changementByTechnologie: true,
          autoAcceptRatios: {
            pv: { min: 0.5, max: 1.3 },
            eolien: { min: 0.4, max: 1.4 },
            hydraulique: { min: 0.3, max: 1.5 },
          },
        },
        periode: { isNotifiedOnPotentiel: true } as Periode,
      } as ProjectAppelOffre

      const technologieFixtures: Technologie[] = ['eolien', 'pv', 'hydraulique']
      for (const technologie of technologieFixtures) {
        const autoAcceptratios =
          appelOffre.changementPuissance.changementByTechnologie &&
          appelOffre.changementPuissance.autoAcceptRatios[technologie]

        describe(`when the new puissance is between the ${technologie} min and max auto accept ratios of the initial puissance`, () => {
          it(`should return true`, () => {
            expect(autoAcceptratios).toBeDefined()

            const puissanceInitiale = 100
            const nouvellePuissance = puissanceInitiale * (autoAcceptratios!.min + 0.1)

            const actual = isModificationPuissanceAuto({
              project: {
                puissanceInitiale,
                appelOffre,
                technologie,
              },
              nouvellePuissance,
            })
            expect(actual).toEqual(true)
          })
        })
        describe(`when the new puissance is below the ${technologie} min ratio of the initial puissance`, () => {
          it(`should return false`, () => {
            expect(autoAcceptratios).toBeDefined()

            const puissanceInitiale = 100
            const nouvellePuissance = puissanceInitiale * (autoAcceptratios!.min - 0.1)

            const actual = isModificationPuissanceAuto({
              project: {
                puissanceInitiale,
                appelOffre,
                technologie,
              },
              nouvellePuissance,
            })
            expect(actual).toEqual(false)
          })
        })
        describe(`when the new puissance is above the ${technologie} max ratio of the initial puissance`, () => {
          it(`should return false`, () => {
            expect(autoAcceptratios).toBeDefined()

            const puissanceInitiale = 100
            const nouvellePuissance = puissanceInitiale * (autoAcceptratios!.max + 0.1)

            const actual = isModificationPuissanceAuto({
              project: {
                puissanceInitiale,
                appelOffre,
                technologie: 'pv',
              },
              nouvellePuissance,
            })
            expect(actual).toEqual(false)
          })
        })
      }

      describe(`when the technology is unknown`, () => {
        describe(`when the new puissance is between 90% and 110% of the initial one`, () => {
          it(`should return true`, () => {
            const actual = isModificationPuissanceAuto({
              project: { puissanceInitiale: 100, appelOffre, technologie: 'N/A' },
              nouvellePuissance: 105,
            })
            expect(actual).toEqual(true)
          })
        })
        describe(`when the new puissance is below 90% of the initial one`, () => {
          it(`should return false`, () => {
            const actual = isModificationPuissanceAuto({
              project: { puissanceInitiale: 100, appelOffre, technologie: 'N/A' },
              nouvellePuissance: 89.9,
            })
            expect(actual).toEqual(false)
          })
        })
        describe(`when the new puissance is above 110% of the initial one`, () => {
          it(`should return false`, () => {
            const actual = isModificationPuissanceAuto({
              project: { puissanceInitiale: 100, appelOffre, technologie: 'N/A' },
              nouvellePuissance: 110.1,
            })
            expect(actual).toEqual(false)
          })
        })
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
            project: { puissanceInitiale: 10, appelOffre, technologie: 'pv' },
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
          project: { puissanceInitiale: 100, technologie: 'pv' },
          nouvellePuissance: 105,
        })
        expect(actual).toEqual(true)
      })
    })
    describe(`when the new puissance is below 90% of the initial one`, () => {
      it(`should return false`, () => {
        const actual = isModificationPuissanceAuto({
          project: { puissanceInitiale: 100, technologie: 'pv' },
          nouvellePuissance: 89.9,
        })
        expect(actual).toEqual(false)
      })
    })
    describe(`when the new puissance is above 110% of the initial one`, () => {
      it(`should return false`, () => {
        const actual = isModificationPuissanceAuto({
          project: { puissanceInitiale: 100, technologie: 'pv' },
          nouvellePuissance: 110.1,
        })
        expect(actual).toEqual(false)
      })
    })
  })
})
