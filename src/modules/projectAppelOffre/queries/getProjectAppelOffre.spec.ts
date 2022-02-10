import { AppelOffre, Famille, Periode, ProjectAppelOffre } from '@entities'
import { makeGetProjectAppelOffre } from './getProjectAppelOffre'

describe(`getProjectAppelOffre`, () => {
  describe(`when the AO property soumisAuxGarantiesFinancieres is true`, () => {
    const fakeAppelOffre: AppelOffre = {
      id: 'Fake - AO1',
      soumisAuxGarantiesFinancieres: true,
      periodes: [
        {
          id: 'Fake - Periode AO1',
        } as Periode,
      ],
      familles: [] as Famille[],
    } as AppelOffre

    it(`should return a projectAppelOffre with isSoumisAuxGFs = true`, () => {
      const actual = makeGetProjectAppelOffre([fakeAppelOffre])({
        appelOffreId: 'Fake - AO1',
        periodeId: 'Fake - Periode AO1',
      })
      expect(actual?.isSoumisAuxGFs).toBe(true)
    })
  })

  describe(`when the AO property soumisAuxGarantiesFinancieres is false`, () => {
    describe(`when the family property soumisAuxGarantiesFinancieres is true `, () => {
      const fakeAppelOffre: AppelOffre = {
        id: 'Fake - AO1',
        soumisAuxGarantiesFinancieres: false,
        periodes: [
          {
            id: 'Fake - Periode AO1',
          } as Periode,
        ],
        familles: [
          {
            id: 'Fake - Famille AO1',
            soumisAuxGarantiesFinancieres: true,
          } as Famille,
        ],
      } as AppelOffre

      it(`should return a projectAppelOffre with isSoumisAuxGFs = true`, () => {
        const actual = makeGetProjectAppelOffre([fakeAppelOffre])({
          appelOffreId: 'Fake - AO1',
          periodeId: 'Fake - Periode AO1',
          familleId: 'Fake - Famille AO1',
        })
        expect(actual?.isSoumisAuxGFs).toBe(true)
      })
    })

    describe(`when the family has no property soumisAuxGarantiesFinancieres`, () => {
      describe(`when the family property garantieFinanciereEnMois is more than 0`, () => {
        const fakeAppelOffre: AppelOffre = {
          id: 'Fake - AO1',
          soumisAuxGarantiesFinancieres: false,
          periodes: [
            {
              id: 'Fake - Periode AO1',
            } as Periode,
          ],
          familles: [
            {
              id: 'Fake - Famille AO1',
              garantieFinanciereEnMois: 3,
            } as Famille,
          ],
        } as AppelOffre

        it(`should return a projectAppelOffre with isSoumisAuxGFs = true`, () => {
          const actual = makeGetProjectAppelOffre([fakeAppelOffre])({
            appelOffreId: 'Fake - AO1',
            periodeId: 'Fake - Periode AO1',
            familleId: 'Fake - Famille AO1',
          })
          expect(actual?.isSoumisAuxGFs).toBe(true)
        })
      })

      describe(`when the family property garantieFinanciereEnMois is equal to 0`, () => {
        const fakeAppelOffre: AppelOffre = {
          id: 'Fake - AO1',
          soumisAuxGarantiesFinancieres: false,
          periodes: [
            {
              id: 'Fake - Periode AO1',
            } as Periode,
          ],
          familles: [
            {
              id: 'Fake - Famille AO1',
              garantieFinanciereEnMois: 0,
            } as Famille,
          ],
        } as AppelOffre

        it(`should return a projectAppelOffre with isSoumisAuxGFs = false`, () => {
          const actual = makeGetProjectAppelOffre([fakeAppelOffre])({
            appelOffreId: 'Fake - AO1',
            periodeId: 'Fake - Periode AO1',
            familleId: 'Fake - Famille AO1',
          })
          expect(actual?.isSoumisAuxGFs).toBe(false)
        })
      })

      describe(`when the family has no property garantieFinanciereEnMois`, () => {
        const fakeAppelOffre: AppelOffre = {
          id: 'Fake - AO1',
          soumisAuxGarantiesFinancieres: false,
          periodes: [
            {
              id: 'Fake - Periode AO1',
            } as Periode,
          ],
          familles: [
            {
              id: 'Fake - Famille AO1',
            } as Famille,
          ],
        } as AppelOffre

        it(`should return a projectAppelOffre with isSoumisAuxGFs = false`, () => {
          const actual = makeGetProjectAppelOffre([fakeAppelOffre])({
            appelOffreId: 'Fake - AO1',
            periodeId: 'Fake - Periode AO1',
            familleId: 'Fake - Famille AO1',
          })
          expect(actual?.isSoumisAuxGFs).toBe(false)
        })
      })
    })
  })
})
