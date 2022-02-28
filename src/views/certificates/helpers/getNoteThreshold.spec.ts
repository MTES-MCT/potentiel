import { ProjectAppelOffre } from '@entities'
import { getNoteThreshold } from './getNoteThreshold'

describe(`getNoteThreshold`, () => {
  describe(`when the periode has a note threshold`, () => {
    const fakeProject = {
      appelOffre: {
        periode: {
          noteThreshold: 99,
        },
      } as ProjectAppelOffre,
    }

    const project = { ...fakeProject, puissance: 10 }
    const actual = getNoteThreshold(project)

    it(`should return the note threshold`, () => {
      expect(actual).toBe(99)
    })
  })

  describe(`when the periode has a note threshold by category`, () => {
    const fakeProject = {
      appelOffre: {
        periode: {
          noteThresholdBy: 'category',
          noteThreshold: {
            volumeReserve: {
              noteThreshold: 99,
              puissanceMax: 15,
            },
            autres: {
              noteThreshold: 78,
            },
          },
        },
      } as ProjectAppelOffre,
    }

    describe(`when the project puissance is lower than the maximum puissance`, () => {
      const project = { ...fakeProject, puissance: 10 }
      const actual = getNoteThreshold(project)

      it(`should return the "reserved volumes" note threshold`, () => {
        expect(actual).toBe(99)
      })
    })

    describe(`when the project puissance is higher than the maximum puissance`, () => {
      const project = { ...fakeProject, puissance: 22 }
      const actual = getNoteThreshold(project)

      it(`should return the "others" note threshold`, () => {
        expect(actual).toBe(78)
      })
    })
  })

  describe(`when the periode does not have a note threshold by category`, () => {
    describe(`when the periode does not have a note threshold by family`, () => {
      const fakeProject = {
        puissance: 10,
        appelOffre: {
          periode: {},
        } as ProjectAppelOffre,
      }

      const actual = getNoteThreshold(fakeProject)

      it(`should return 'N/A'`, () => {
        expect(actual).toBe('N/A')
      })
    })
  })

  describe(`when the periode has a note threshold by family`, () => {
    const familleId = 'family-id'
    const territoire = 'Guadeloupe'

    const fakeProject = {
      puissance: 10,
      familleId,
      appelOffre: {
        periode: {
          noteThresholdBy: 'family',
          noteThreshold: [
            {
              familleId,
              noteThreshold: 38,
              territoire,
            },
            {
              familleId: 'family-id-2',
              noteThreshold: 57,
              territoire: 'Corse',
            },
          ],
        },
      } as ProjectAppelOffre,
    }

    describe(`when the project has not the same territoire as the family`, () => {
      const actual = getNoteThreshold({ ...fakeProject, territoireProjet: 'Another' })

      it(`should return 'N/A'`, () => {
        expect(actual).toBe('N/A')
      })
    })

    describe(`when the project has the same territoire as the family`, () => {
      const actual = getNoteThreshold({ ...fakeProject, territoireProjet: territoire })

      it(`should return the family note threshold`, () => {
        expect(actual).toBe(38)
      })
    })

    describe(`when the project does not have a territoire`, () => {
      describe(`when the project family exists in the periode`, () => {
        const actual = getNoteThreshold({ ...fakeProject, territoireProjet: '' })

        it(`should return the family note threshold of the project`, () => {
          expect(actual).toBe(38)
        })
      })

      describe(`when the project family does not exist in the periode`, () => {
        const actual = getNoteThreshold({
          ...fakeProject,
          territoireProjet: '',
          familleId: 'inexistent-family',
        })

        it(`should return 'N/A'`, () => {
          expect(actual).toBe('N/A')
        })
      })
    })
  })
})
