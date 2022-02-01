import { Periode, ProjectAppelOffre } from '@entities'
import { ProjectDataForCertificate } from '@modules/project'
import { getNoteThreshold } from './getNoteThreshold'

describe(`getNoteThreshold`, () => {
  describe(`when the periode has a note thershold by category`, () => {
    const fakeProject = {
      appelOffre: {
        periode: {
          noteThresholdByCategory: {
            volumesReserves: {
              noteThreshold: 99,
              puissanceMax: 15,
            },
            autres: {
              noteThreshold: 78,
            },
          },
        },
      } as ProjectAppelOffre,
    } as ProjectDataForCertificate

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

  describe(`when the periode does not have a note thershold by category`, () => {
    describe(`when the periode does not have a note thershold by family`, () => {
      const fakeProject = {
        appelOffre: {
          periode: {
            noteThresholdByCategory: undefined,
            noteThresholdByFamily: undefined,
          },
        } as ProjectAppelOffre,
      } as ProjectDataForCertificate

      const actual = getNoteThreshold(fakeProject)

      it(`should return 'N/A'`, () => {
        expect(actual).toBe('N/A')
      })
    })
  })

  describe(`when the periode has a note thershold by family`, () => {
    const familleId = 'family-id'
    const territoire = 'Guadeloupe'

    const fakeProject = {
      familleId,
      appelOffre: {
        periode: {
          noteThresholdByCategory: undefined,
          noteThresholdByFamily: [
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
        } as Periode,
      } as ProjectAppelOffre,
    } as ProjectDataForCertificate

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
