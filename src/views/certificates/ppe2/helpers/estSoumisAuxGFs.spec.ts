import { Famille, ProjectAppelOffre } from '@entities'
import { ProjectDataForCertificate } from '@modules/project'
import { estSoumisAuxGFs } from './estSoumisAuxGFs'

describe(`estSoumisAuxGFs`, () => {
  describe(`when the AO in project soumisAuxGarantiesFinancieres is true`, () => {
    const fakeProjectData: ProjectDataForCertificate = {
      appelOffre: {
        soumisAuxGarantiesFinancieres: true,
        familles: [] as Famille[],
      } as ProjectAppelOffre,
    } as ProjectDataForCertificate

    it(`should return true`, () => {
      const actual = estSoumisAuxGFs(fakeProjectData)

      expect(actual).toBe(true)
    })
  })

  describe(`when the AO in project soumisAuxGarantiesFinancieres is false`, () => {
    describe(`when the AO has no famille`, () => {
      const fakeProjectData: ProjectDataForCertificate = {
        appelOffre: {
          soumisAuxGarantiesFinancieres: false,
          familles: [] as Famille[],
        } as ProjectAppelOffre,
      } as ProjectDataForCertificate

      it(`should return false`, () => {
        const actual = estSoumisAuxGFs(fakeProjectData)

        expect(actual).toBe(false)
      })
    })

    describe(`when the AO has one famille that has the property soumisAuxGarantiesFinancieres true`, () => {
      const fakeProjectData: ProjectDataForCertificate = {
        familleId: 'famille',
        appelOffre: {
          soumisAuxGarantiesFinancieres: false,
          familles: [
            {
              id: 'famille',
              soumisAuxGarantiesFinancieres: true,
            } as Famille,
          ],
        } as ProjectAppelOffre,
      } as ProjectDataForCertificate

      it(`should return true`, () => {
        const actual = estSoumisAuxGFs(fakeProjectData)

        expect(actual).toBe(true)
      })
    })

    describe(`when the AO has one famille that has the property garantieFinanciereEnMois is more than 0`, () => {
      const fakeProjectData: ProjectDataForCertificate = {
        familleId: 'famille',
        appelOffre: {
          soumisAuxGarantiesFinancieres: false,
          familles: [
            {
              id: 'famille',
              garantieFinanciereEnMois: 3,
            } as Famille,
          ],
        } as ProjectAppelOffre,
      } as ProjectDataForCertificate

      it(`should return true`, () => {
        const actual = estSoumisAuxGFs(fakeProjectData)

        expect(actual).toBe(true)
      })
    })

    describe(`when the AO has one famille that has the property garantieFinanciereEnMois is equal to 0`, () => {
      const fakeProjectData: ProjectDataForCertificate = {
        familleId: 'famille',
        appelOffre: {
          soumisAuxGarantiesFinancieres: false,
          familles: [
            {
              id: 'famille',
              garantieFinanciereEnMois: 0,
            } as Famille,
          ],
        } as ProjectAppelOffre,
      } as ProjectDataForCertificate

      it(`should return false`, () => {
        const actual = estSoumisAuxGFs(fakeProjectData)

        expect(actual).toBe(false)
      })
    })
  })
})
