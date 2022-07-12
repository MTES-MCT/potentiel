import { okAsync } from '@core/utils'
import { Project, User } from '@entities'
import { DélaiDemandé } from '@modules/demandeModification'
import routes from '@routes'
import { makeOnDélaiDemandé } from './onDélaiDemandé'

describe(`Notifier lorsqu'un délai est demandé`, () => {
  describe(`Notifier le porteur de projet`, () => {
    it(`  Quand un délai est demandé
          Alors le porteur ayant fait la demande devrait être notifié`, async () => {
      const sendNotification = jest.fn()
      const getInfoForModificationRequested = () =>
        okAsync({
          porteurProjet: { email: 'porteur@test.test', fullName: 'Porteur de Projet' },
          nomProjet: 'nom-du-projet',
        })

      const onDélaiDemandé = makeOnDélaiDemandé({
        sendNotification,
        getInfoForModificationRequested,
        findUsersForDreal: jest.fn(),
        findProjectById: jest.fn(),
      })

      await onDélaiDemandé(
        new DélaiDemandé({
          payload: {
            demandeDélaiId: 'la-demande',
            projetId: 'le-projet',
            porteurId: 'le-porteur',
            autorité: 'dgec',
            dateAchèvementDemandée: '2022-07-12',
          },
        })
      )

      expect(sendNotification).toHaveBeenCalledTimes(1)
      expect(sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'modification-request-status-update',
          message: expect.objectContaining({
            email: 'porteur@test.test',
            name: 'Porteur de Projet',
          }),
          context: expect.objectContaining({
            modificationRequestId: 'la-demande',
            userId: 'le-porteur',
          }),
          variables: expect.objectContaining({
            status: 'envoyée',
            nom_projet: 'nom-du-projet',
            type_demande: 'delai',
            document_absent: '',
          }),
        })
      )
    })
  })
  describe(`Notifier les DREALs`, () => {
    it(`  Quand un délai est demandé à l'autorité DREAL
          Alors tous les agents de la DREAL de la région du projet devraient être notifiés`, async () => {
      const sendNotification = jest.fn()
      const getInfoForModificationRequested = () =>
        okAsync({
          porteurProjet: { email: 'porteur@test.test', fullName: 'Porteur de Projet' },
          nomProjet: 'nom-du-projet',
        })

      const findProjectById = (region: string) =>
        Promise.resolve({
          id: 'le-projet',
          nomProjet: 'nom-du-projet',
          regionProjet: 'regionA / regionB',
          departementProjet: 'département',
        } as Project)

      const findUsersForDreal = (region: string) =>
        Promise.resolve(
          region === 'regionA'
            ? [{ email: 'drealA@test.test', fullName: 'drealA' } as User]
            : [{ email: 'drealB@test.test', fullName: 'drealB' } as User]
        )

      const onDélaiDemandé = makeOnDélaiDemandé({
        sendNotification,
        getInfoForModificationRequested,
        findUsersForDreal,
        findProjectById,
      })

      await onDélaiDemandé(
        new DélaiDemandé({
          payload: {
            demandeDélaiId: 'la-demande',
            projetId: 'le-projet',
            porteurId: 'le-porteur',
            autorité: 'dreal',
            dateAchèvementDemandée: '2022-07-12',
          },
        })
      )

      expect(sendNotification).toHaveBeenCalledTimes(3)
      expect(sendNotification).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: 'admin-modification-requested',
          message: expect.objectContaining({
            email: 'drealA@test.test',
            name: 'drealA',
          }),
          context: expect.objectContaining({
            modificationRequestId: 'la-demande',
            dreal: 'regionA',
            projectId: 'le-projet',
          }),
          variables: expect.objectContaining({
            nom_projet: 'nom-du-projet',
            modification_request_url: routes.DEMANDE_PAGE_DETAILS('la-demande'),
            type_demande: 'delai',
            departement_projet: 'département',
          }),
        })
      )
      expect(sendNotification).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          type: 'admin-modification-requested',
          message: expect.objectContaining({
            email: 'drealB@test.test',
            name: 'drealB',
          }),
          context: expect.objectContaining({
            modificationRequestId: 'la-demande',
            dreal: 'regionB',
            projectId: 'le-projet',
          }),
          variables: expect.objectContaining({
            nom_projet: 'nom-du-projet',
            modification_request_url: routes.DEMANDE_PAGE_DETAILS('la-demande'),
            type_demande: 'delai',
            departement_projet: 'département',
          }),
        })
      )
    })
  })
})
