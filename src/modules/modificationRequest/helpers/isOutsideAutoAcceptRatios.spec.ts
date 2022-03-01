import { ProjectAppelOffre, Technologie } from '@entities'
import { isOutsideAutoAcceptRatios } from './isOutsideAutoAcceptRatios'

describe(`isOutsideAutoAcceptRatios`, () => {
  describe(`when automatic accepted ratios are not by technology`, () => {
    const ratios = { min: 0.7, max: 1.1 }
    const appelOffre = {
      changementPuissance: {
        autoAcceptRatios: ratios,
      },
    } as ProjectAppelOffre

    describe(`when the new puissance is between the min and max auto accept ratios of the initial puissance`, () => {
      it(`should return false`, () => {
        const actual = isOutsideAutoAcceptRatios({
          project: {
            puissanceInitiale: 100,
            appelOffre,
            technologie: 'pv',
          },
          nouvellePuissance: 80,
        })
        expect(actual).toBe(false)
      })
    })
    describe(`when the new puissance is below the min ratio of the initial puissance`, () => {
      it(`should return true`, () => {
        const actual = isOutsideAutoAcceptRatios({
          project: {
            puissanceInitiale: 100,
            appelOffre,
            technologie: 'pv',
          },
          nouvellePuissance: 69.9,
        })
        expect(actual).toBe(true)
      })
    })
    describe(`when the new puissance is above the max ratio of the initial puissance`, () => {
      it(`should return true`, () => {
        const actual = isOutsideAutoAcceptRatios({
          project: {
            puissanceInitiale: 100,
            appelOffre,
            technologie: 'pv',
          },
          nouvellePuissance: 110.1,
        })
        expect(actual).toBe(true)
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
    } as ProjectAppelOffre

    const technologieFixtures: Technologie[] = ['eolien', 'pv', 'hydraulique']
    for (const technologie of technologieFixtures) {
      const autoAcceptratios =
        appelOffre.changementPuissance.changementByTechnologie &&
        appelOffre.changementPuissance.autoAcceptRatios[technologie]

      describe(`when the new puissance is between the ${technologie} min and max auto accept ratios of the initial puissance`, () => {
        it(`should return false`, () => {
          expect(autoAcceptratios).toBeDefined()

          const puissanceInitiale = 100
          const nouvellePuissance = puissanceInitiale * (autoAcceptratios!.min + 0.1)

          const actual = isOutsideAutoAcceptRatios({
            project: {
              puissanceInitiale,
              appelOffre,
              technologie,
            },
            nouvellePuissance,
          })
          expect(actual).toBe(false)
        })
      })
      describe(`when the new puissance is below the ${technologie} min ratio of the initial puissance`, () => {
        it(`should return true`, () => {
          expect(autoAcceptratios).toBeDefined()

          const puissanceInitiale = 100
          const nouvellePuissance = puissanceInitiale * (autoAcceptratios!.min - 0.1)

          const actual = isOutsideAutoAcceptRatios({
            project: {
              puissanceInitiale,
              appelOffre,
              technologie,
            },
            nouvellePuissance,
          })
          expect(actual).toBe(true)
        })
      })
      describe(`when the new puissance is above the ${technologie} max ratio of the initial puissance`, () => {
        it(`should return true`, () => {
          expect(autoAcceptratios).toBeDefined()

          const puissanceInitiale = 100
          const nouvellePuissance = puissanceInitiale * (autoAcceptratios!.max + 0.1)

          const actual = isOutsideAutoAcceptRatios({
            project: {
              puissanceInitiale,
              appelOffre,
              technologie,
            },
            nouvellePuissance,
          })
          expect(actual).toBe(true)
        })
      })
    }

    describe(`when the technology is unknown`, () => {
      describe(`when the new puissance is between 90% and 110% of the initial one`, () => {
        it(`should return false`, () => {
          const actual = isOutsideAutoAcceptRatios({
            project: { puissanceInitiale: 100, appelOffre, technologie: 'N/A' },
            nouvellePuissance: 105,
          })
          expect(actual).toBe(false)
        })
      })
      describe(`when the new puissance is below 90% of the initial one`, () => {
        it(`should return true`, () => {
          const actual = isOutsideAutoAcceptRatios({
            project: { puissanceInitiale: 100, appelOffre, technologie: 'N/A' },
            nouvellePuissance: 89.9,
          })
          expect(actual).toBe(true)
        })
      })
      describe(`when the new puissance is above 110% of the initial one`, () => {
        it(`should return true`, () => {
          const actual = isOutsideAutoAcceptRatios({
            project: { puissanceInitiale: 100, appelOffre, technologie: 'N/A' },
            nouvellePuissance: 110.1,
          })
          expect(actual).toBe(true)
        })
      })
    })
  })

  describe(`when appel offre is undefined`, () => {
    describe(`when the new puissance is between 90% and 110% of the initial one`, () => {
      it(`should return false`, () => {
        const actual = isOutsideAutoAcceptRatios({
          project: { puissanceInitiale: 100, technologie: 'pv' },
          nouvellePuissance: 105,
        })
        expect(actual).toBe(false)
      })
    })
    describe(`when the new puissance is below 90% of the initial one`, () => {
      it(`should return true`, () => {
        const actual = isOutsideAutoAcceptRatios({
          project: { puissanceInitiale: 100, technologie: 'pv' },
          nouvellePuissance: 89.9,
        })
        expect(actual).toBe(true)
      })
    })
    describe(`when the new puissance is above 110% of the initial one`, () => {
      it(`should return true`, () => {
        const actual = isOutsideAutoAcceptRatios({
          project: { puissanceInitiale: 100, technologie: 'pv' },
          nouvellePuissance: 110.1,
        })
        expect(actual).toBe(true)
      })
    })
  })
})
