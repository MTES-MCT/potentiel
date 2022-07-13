import { okAsync } from '@core/utils'
import { User } from '@entities'
import { DélaiAnnulé } from '@modules/demandeModification'
import { makeOnDélaiAnnulé } from './onDélaiAnnulé'

describe(`Notifier lorsqu'un délai est annulé`, () => {
  describe(`Notifier les porteur ayant accès au projet`, () => {
    it(`  Quand un délai est annulé
          Alors tous les porteurs ayant accès au projet devrait être notifié`, async () => {
      const sendNotification = jest.fn(async () => null)
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

      const onDélaiAnnulé = makeOnDélaiAnnulé({
        sendNotification,
        getModificationRequestInfoForStatusNotification,
        dgecEmail: 'dgec@email.test',
        getModificationRequestRecipient: () => okAsync('dgec' as 'dgec'),
        findUsersForDreal: jest.fn(),
      })

      await onDélaiAnnulé(
        new DélaiAnnulé({
          payload: {
            demandeDélaiId: 'la-demande',
            projetId: 'le-projet',
            annuléPar: 'le-porteur',
          },
        })
      )

      expect(sendNotification).toHaveBeenCalledTimes(3)
      expect(sendNotification).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: 'modification-request-status-update',
          message: expect.objectContaining({
            email: 'porteur1@test.test',
          }),
          variables: expect.objectContaining({
            status: 'annulée',
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
            status: 'annulée',
            nom_projet: 'nom-du-projet',
            type_demande: 'delai',
          }),
        })
      )
    })
  })
  describe(`Notifier la DGEC`, () => {
    it(`  Quand un délai est annulé sous l'autorité de la DGEC
          Alors le bureau de la DGEC devrait être notifié`, async () => {
      const sendNotification = jest.fn(async () => null)
      const getModificationRequestRecipient = () => okAsync('dgec' as 'dgec')
      const getModificationRequestInfoForStatusNotification = () =>
        okAsync({
          porteursProjet: [],
          nomProjet: 'nom-du-projet',
          regionProjet: 'region',
          departementProjet: 'departement',
          type: 'delai',
        })

      const onDélaiAnnulé = makeOnDélaiAnnulé({
        sendNotification,
        getModificationRequestInfoForStatusNotification,
        getModificationRequestRecipient,
        dgecEmail: 'dgec@email.test',
        findUsersForDreal: jest.fn(),
      })

      await onDélaiAnnulé(
        new DélaiAnnulé({
          payload: {
            demandeDélaiId: 'la-demande',
            projetId: 'le-projet',
            annuléPar: 'le-porteur',
          },
        })
      )

      expect(sendNotification).toHaveBeenCalledTimes(1)
      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'modification-request-cancelled',
          message: expect.objectContaining({
            email: 'dgec@email.test',
            name: 'DGEC',
          }),
          context: expect.objectContaining({
            modificationRequestId: 'la-demande',
          }),
          variables: expect.objectContaining({
            nom_projet: 'nom-du-projet',
            type_demande: 'delai',
            departement_projet: 'departement',
          }),
        })
      )
    })
  })
  describe(`Notifier les DREALs`, () => {
    it(`  Quand un délai est annulé sous l'autorité des DREALs
          Alors tous les agents de la DREAL des régions du projet devraient être notifiés`, async () => {
      const sendNotification = jest.fn(async () => null)
      const getModificationRequestRecipient = () => okAsync('dreal' as 'dreal')
      const getModificationRequestInfoForStatusNotification = () =>
        okAsync({
          porteursProjet: [],
          nomProjet: 'nom-du-projet',
          regionProjet: 'regionA / regionB',
          departementProjet: 'departement',
          type: 'delai',
        })
      const findUsersForDreal = (region: string) =>
        Promise.resolve(
          region === 'regionA'
            ? [{ email: 'drealA@test.test', fullName: 'drealA' } as User]
            : [{ email: 'drealB@test.test', fullName: 'drealB' } as User]
        )

      const onDélaiAnnulé = makeOnDélaiAnnulé({
        sendNotification,
        getModificationRequestInfoForStatusNotification,
        getModificationRequestRecipient,
        dgecEmail: 'dgec@email.test',
        findUsersForDreal,
      })

      await onDélaiAnnulé(
        new DélaiAnnulé({
          payload: {
            demandeDélaiId: 'la-demande',
            projetId: 'le-projet',
            annuléPar: 'le-porteur',
          },
        })
      )

      expect(sendNotification).toHaveBeenCalledTimes(2)
      expect(sendNotification).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: 'modification-request-cancelled',
          message: expect.objectContaining({
            email: 'drealA@test.test',
            name: 'drealA',
          }),
          context: expect.objectContaining({
            modificationRequestId: 'la-demande',
          }),
          variables: expect.objectContaining({
            nom_projet: 'nom-du-projet',
            type_demande: 'delai',
            departement_projet: 'departement',
          }),
        })
      )
      expect(sendNotification).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: 'modification-request-cancelled',
          message: expect.objectContaining({
            email: 'drealB@test.test',
            name: 'drealB',
          }),
          context: expect.objectContaining({
            modificationRequestId: 'la-demande',
          }),
          variables: expect.objectContaining({
            nom_projet: 'nom-du-projet',
            type_demande: 'delai',
            departement_projet: 'departement',
          }),
        })
      )
    })
  })
})
