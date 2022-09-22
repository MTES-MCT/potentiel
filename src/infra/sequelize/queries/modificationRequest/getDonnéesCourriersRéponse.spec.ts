import { ProjectAppelOffre } from '@entities'
import { getDonnéesCourriersRéponse } from './getDonnéesCourriersRéponse'

describe(`Requête getDonnéesCourriersRéponse`, () => {
  describe(`Cas des données présentes seulement dans la portée de l'appel d'offre`, () => {
    it(`Etant donné un projet dont les données de CDC sont directement dans l'AO
    Alors les textes suivants devraient être retournés: 
    'texteEngagementRéalisationEtModalitésAbandon',
    'texteChangementDActionnariat',
    'texteChangementDePuissance',
    'texteIdentitéDuProducteur',
    'texteChangementDeProducteur',
    'texteDélaisDAchèvement'`, () => {
      const cahierDesChargesActuel = { paruLe: '31/07/2021' }

      const projectAppelOffre = {
        donnéesCourriersRéponse: {
          texteEngagementRéalisationEtModalitésAbandon: {
            référenceParagraphe: '1',
            dispositions: 'une',
          },
          texteChangementDActionnariat: { référenceParagraphe: '2', dispositions: 'deux' },
          texteChangementDePuissance: { référenceParagraphe: '3', dispositions: 'trois' },
          texteIdentitéDuProducteur: { référenceParagraphe: '4', dispositions: 'quatre' },
          texteChangementDeProducteur: { référenceParagraphe: '5', dispositions: 'cinq' },
          texteDélaisDAchèvement: { référenceParagraphe: '6', dispositions: 'six' },
        },
      } as ProjectAppelOffre

      const res = getDonnéesCourriersRéponse(cahierDesChargesActuel, projectAppelOffre)

      expect(res).toEqual({
        texteEngagementRéalisationEtModalitésAbandon: {
          référenceParagraphe: '1',
          dispositions: 'une',
        },
        texteChangementDActionnariat: { référenceParagraphe: '2', dispositions: 'deux' },
        texteChangementDePuissance: { référenceParagraphe: '3', dispositions: 'trois' },
        texteIdentitéDuProducteur: { référenceParagraphe: '4', dispositions: 'quatre' },
        texteChangementDeProducteur: { référenceParagraphe: '5', dispositions: 'cinq' },
        texteDélaisDAchèvement: { référenceParagraphe: '6', dispositions: 'six' },
      })
    })
  })
})
