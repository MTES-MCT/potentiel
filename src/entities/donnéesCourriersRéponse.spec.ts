import { CahierDesChargesModifié } from './cahierDesCharges'
import { ProjectAppelOffre } from './appelOffre'
import { Periode } from './periode'
import { getDonnéesCourriersRéponse } from './donnéesCourriersRéponse'

describe(`Récupération des données des courriers de réponse`, () => {
  describe(`Cas des données présentes seulement dans l'appel d'offres`, () => {
    it(`Etant donné un appel d'offres de projet dont les données sont seulement dans l'AO
        Alors les données de l'AO devraient être retournées`, () => {
      const cahierDesChargesActuel = '30/07/2021'

      const projectAppelOffre = {
        periode: {} as Periode,
        donnéesCourriersRéponse: {
          texteEngagementRéalisationEtModalitésAbandon: {
            référenceParagraphe: 'AO-1',
            dispositions: 'AO-une',
          },
          texteChangementDActionnariat: { référenceParagraphe: 'AO-2', dispositions: 'AO-deux' },
          texteChangementDePuissance: { référenceParagraphe: 'AO-3', dispositions: 'AO-trois' },
          texteIdentitéDuProducteur: { référenceParagraphe: 'AO-4', dispositions: 'AO-quatre' },
          texteChangementDeProducteur: { référenceParagraphe: 'AO-5', dispositions: 'AO-cinq' },
          texteDélaisDAchèvement: { référenceParagraphe: 'AO-6', dispositions: 'AO-six' },
        },
        cahiersDesChargesModifiésDisponibles: [] as ReadonlyArray<CahierDesChargesModifié>,
      } as ProjectAppelOffre

      const res = getDonnéesCourriersRéponse(cahierDesChargesActuel, projectAppelOffre)

      expect(res).toEqual({
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: 'AO-1',
          dispositions: 'AO-une',
        },
        texteChangementDActionnariat: { référenceParagraphe: 'AO-2', dispositions: 'AO-deux' },
        texteChangementDePuissance: { référenceParagraphe: 'AO-3', dispositions: 'AO-trois' },
        texteIdentitéDuProducteur: { référenceParagraphe: 'AO-4', dispositions: 'AO-quatre' },
        texteChangementDeProducteur: { référenceParagraphe: 'AO-5', dispositions: 'AO-cinq' },
        texteDélaisDAchèvement: { référenceParagraphe: 'AO-6', dispositions: 'AO-six' },
      })
    })
  })

  describe(`Cas des données présentes en partie dans la période et l'appel d'offres`, () => {
    it(`Etant donné un appel d'offres de projet dont les données sont en partie dans la période et l'appel d'offres
        Alors les données de la l'AO devraient être retournées surchargées par celles de la période`, () => {
      const cahierDesChargesActuel = '30/07/2021'

      const projectAppelOffre = {
        periode: {
          donnéesCourriersRéponse: {
            texteEngagementRéalisationEtModalitésAbandon: {
              référenceParagraphe: 'PE-1',
              dispositions: 'PE-une',
            },
            texteChangementDActionnariat: { référenceParagraphe: 'PE-2', dispositions: 'PE-deux' },
          },
        } as Periode,
        donnéesCourriersRéponse: {
          texteEngagementRéalisationEtModalitésAbandon: {
            référenceParagraphe: 'AO-1',
            dispositions: 'AO-une',
          },
          texteChangementDActionnariat: { référenceParagraphe: 'AO-2', dispositions: 'AO-deux' },
          texteChangementDePuissance: { référenceParagraphe: 'AO-3', dispositions: 'AO-trois' },
          texteIdentitéDuProducteur: { référenceParagraphe: 'AO-4', dispositions: 'AO-quatre' },
          texteChangementDeProducteur: { référenceParagraphe: 'AO-5', dispositions: 'AO-cinq' },
          texteDélaisDAchèvement: { référenceParagraphe: 'AO-6', dispositions: 'AO-six' },
        },
        cahiersDesChargesModifiésDisponibles: [] as ReadonlyArray<CahierDesChargesModifié>,
      } as ProjectAppelOffre

      const res = getDonnéesCourriersRéponse(cahierDesChargesActuel, projectAppelOffre)

      expect(res).toEqual({
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: 'PE-1',
          dispositions: 'PE-une',
        },
        texteChangementDActionnariat: { référenceParagraphe: 'PE-2', dispositions: 'PE-deux' },
        texteChangementDePuissance: { référenceParagraphe: 'AO-3', dispositions: 'AO-trois' },
        texteIdentitéDuProducteur: { référenceParagraphe: 'AO-4', dispositions: 'AO-quatre' },
        texteChangementDeProducteur: { référenceParagraphe: 'AO-5', dispositions: 'AO-cinq' },
        texteDélaisDAchèvement: { référenceParagraphe: 'AO-6', dispositions: 'AO-six' },
      })
    })
  })

  describe(`Cas des données présentes en partie dans le CDC modifié, la période et l'appel d'offres`, () => {
    it(`Etant donné un appel d'offres de projet dont les données sont en partie dans le CDC modifié, la période et l'appel d'offres
        Alors les données de l'AO devraient être retournées surchargées par celles de la période puis celles du CDC`, () => {
      const cahierDesChargesActuel = '30/08/2022-alternatif'

      const cahiersDesChargesModifiésDisponibles: ReadonlyArray<CahierDesChargesModifié> = [
        {
          paruLe: '30/07/2021',
          url: 'url',
          donnéesCourriersRéponse: {
            texteEngagementRéalisationEtModalitésAbandon: {
              référenceParagraphe: 'VALEUR NON ATTENDU',
              dispositions: 'VALEUR NON ATTENDU',
            },
          },
        },
        {
          paruLe: '30/08/2022',
          alternatif: true,
          url: 'url',
          donnéesCourriersRéponse: {
            texteEngagementRéalisationEtModalitésAbandon: {
              référenceParagraphe: 'CDC-1',
              dispositions: 'CDC-une',
            },
          },
        },
      ]

      const projectAppelOffre = {
        periode: {
          donnéesCourriersRéponse: {
            texteEngagementRéalisationEtModalitésAbandon: {
              référenceParagraphe: 'PE-1',
              dispositions: 'PE-une',
            },
            texteChangementDActionnariat: { référenceParagraphe: 'PE-2', dispositions: 'PE-deux' },
          },
        } as Periode,
        donnéesCourriersRéponse: {
          texteEngagementRéalisationEtModalitésAbandon: {
            référenceParagraphe: 'AO-1',
            dispositions: 'AO-une',
          },
          texteChangementDActionnariat: { référenceParagraphe: 'AO-2', dispositions: 'AO-deux' },
          texteChangementDePuissance: { référenceParagraphe: 'AO-3', dispositions: 'AO-trois' },
          texteIdentitéDuProducteur: { référenceParagraphe: 'AO-4', dispositions: 'AO-quatre' },
          texteChangementDeProducteur: { référenceParagraphe: 'AO-5', dispositions: 'AO-cinq' },
          texteDélaisDAchèvement: { référenceParagraphe: 'AO-6', dispositions: 'AO-six' },
        },
        cahiersDesChargesModifiésDisponibles,
      } as ProjectAppelOffre

      const res = getDonnéesCourriersRéponse(cahierDesChargesActuel, projectAppelOffre)

      expect(res).toEqual({
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: 'CDC-1',
          dispositions: 'CDC-une',
        },
        texteChangementDActionnariat: { référenceParagraphe: 'PE-2', dispositions: 'PE-deux' },
        texteChangementDePuissance: { référenceParagraphe: 'AO-3', dispositions: 'AO-trois' },
        texteIdentitéDuProducteur: { référenceParagraphe: 'AO-4', dispositions: 'AO-quatre' },
        texteChangementDeProducteur: { référenceParagraphe: 'AO-5', dispositions: 'AO-cinq' },
        texteDélaisDAchèvement: { référenceParagraphe: 'AO-6', dispositions: 'AO-six' },
      })
    })
  })
})
