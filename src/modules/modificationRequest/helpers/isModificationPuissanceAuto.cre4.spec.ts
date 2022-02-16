import { AppelOffre } from '@entities'
import { isModificationPuissanceAuto } from './isModificationPuissanceAuto'

describe('isModificationPuissanceAuto for CRE4', () => {
  describe(`when it's an innovation appel offre`, () => {
    describe(`when the new puissance is between 70% and 100% of the initial one`, () => {
      it(`should return true`, () => {
        const actual = isModificationPuissanceAuto({
          project: { puissanceInitiale: 100, appelOffre: { type: 'innovation' } as AppelOffre },
          nouvellePuissance: 80,
        })
        expect(actual).toEqual(true)
      })
    })
    describe(`when the new puissance is below 70% of the initial one`, () => {
      it(`should return false`, () => {
        const actual = isModificationPuissanceAuto({
          project: { puissanceInitiale: 100, appelOffre: { type: 'innovation' } as AppelOffre },
          nouvellePuissance: 69.9,
        })
        expect(actual).toEqual(false)
      })
    })
    describe(`when the new puissance is above 100% of the initial one`, () => {
      it(`should return false`, () => {
        const actual = isModificationPuissanceAuto({
          project: { puissanceInitiale: 100, appelOffre: { type: 'innovation' } as AppelOffre },
          nouvellePuissance: 100.1,
        })
        expect(actual).toEqual(false)
      })
    })
  })

  describe(`when it's an autoconso appel offre`, () => {
    describe(`when the new puissance is between 80% and 100% of the initial one`, () => {
      it(`should return true`, () => {
        const actual = isModificationPuissanceAuto({
          project: { puissanceInitiale: 100, appelOffre: { type: 'autoconso' } as AppelOffre },
          nouvellePuissance: 90,
        })
        expect(actual).toEqual(true)
      })
    })
    describe(`when the new puissance is below 80% of the initial one`, () => {
      it(`should return false`, () => {
        const actual = isModificationPuissanceAuto({
          project: { puissanceInitiale: 100, appelOffre: { type: 'autoconso' } as AppelOffre },
          nouvellePuissance: 79.9,
        })
        expect(actual).toEqual(false)
      })
    })
    describe(`when the new puissance is above 100% of the initial one`, () => {
      it(`should return false`, () => {
        const actual = isModificationPuissanceAuto({
          project: { puissanceInitiale: 100, appelOffre: { type: 'autoconso' } as AppelOffre },
          nouvellePuissance: 100.1,
        })
        expect(actual).toEqual(false)
      })
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
        describe(`when the new puissance is between 90% and 110% of the initial one`, () => {
          it(`should return true`, () => {
            const actual = isModificationPuissanceAuto({
              project: { puissanceInitiale: 100, appelOffre: { type } as AppelOffre },
              nouvellePuissance: 105,
            })
            expect(actual).toEqual(true)
          })
        })
        describe(`when the new puissance is below 90% of the initial one`, () => {
          it(`should return false`, () => {
            const actual = isModificationPuissanceAuto({
              project: { puissanceInitiale: 100, appelOffre: { type } as AppelOffre },
              nouvellePuissance: 89.9,
            })
            expect(actual).toEqual(false)
          })
        })
        describe(`when the new puissance is above 110% of the initial one`, () => {
          it(`should return false`, () => {
            const actual = isModificationPuissanceAuto({
              project: { puissanceInitiale: 100, appelOffre: { type } as AppelOffre },
              nouvellePuissance: 110.1,
            })
            expect(actual).toEqual(false)
          })
        })
      })
    }
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
