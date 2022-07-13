import { okAsync } from '@core/utils'
import { DélaiRejeté } from '@modules/demandeModification'
import { makeOnDélaiRejeté } from './onDélaiRejeté'

describe(`Notifier lorsqu'un délai est rejeté`, () => {
  describe(`Notifier les porteurs ayant accès au projet`, () => {
    it(`  Quand un délai est rejeté
          Alors tous les porteurs ayant accès au projet devrait être notifié`, async () => {
      const sendNotification = jest.fn()
      const getModificationRequestInfoForStatusNotification = () =>
        okAsync({
          porteursProjet: [
            {
              role: 'porteur-projet',
              id: 'porteur-1',
              email: 'porteur1@test.test',
              fullName: 'Porteur de projet 1',
            },
            {
              role: 'porteur-projet',
              id: 'porteur-2',
              email: 'porteur2@test.test',
              fullName: 'Porteur de projet 2',
            },
          ],
          nomProjet: 'nom-du-projet',
          regionProjet: 'region',
          departementProjet: 'departement',
          type: 'delai',
        })

      const onDélaiRejeté = makeOnDélaiRejeté({
        sendNotification,
        getModificationRequestInfoForStatusNotification,
      })

      await onDélaiRejeté(
        new DélaiRejeté({
          payload: {
            demandeDélaiId: 'la-demande',
            projetId: 'le-projet',
            rejetéPar: 'la-dreal',
            fichierRéponseId: 'le-fichier-de-réponse',
          },
        })
      )

      expect(sendNotification).toHaveBeenCalledTimes(2)
      expect(sendNotification).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: 'modification-request-status-update',
          message: expect.objectContaining({
            email: 'porteur1@test.test',
          }),
          variables: expect.objectContaining({
            status: 'rejetée',
            nom_projet: 'nom-du-projet',
            type_demande: 'delai',
          }),
        })
      )
      expect(sendNotification).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: 'modification-request-status-update',
          message: expect.objectContaining({
            email: 'porteur2@test.test',
          }),
          variables: expect.objectContaining({
            status: 'rejetée',
            nom_projet: 'nom-du-projet',
            type_demande: 'delai',
          }),
        })
      )
    })
  })
})
