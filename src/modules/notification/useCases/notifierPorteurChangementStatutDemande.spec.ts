import { makeNotifierPorteurChangementStatutDemande } from './notifierPorteurChangementStatutDemande'
import routes from '@routes'

describe(`Notifier le porteur d'un changement de statut de la demande`, () => {
  it('La notification est envoyée avec les informations fournies', async () => {
    const sendNotification = jest.fn()
    const notifierPorteurChangementStatutDemande = makeNotifierPorteurChangementStatutDemande({
      sendNotification,
    })

    notifierPorteurChangementStatutDemande({
      email: 'porteur@test.test',
      porteurId: 'porteur-id',
      status: 'envoyée',
      fullName: 'Nom du porteur',
      nomProjet: 'Nom du projet',
      hasDocument: true,
      modificationRequestId: 'id-demande',
      typeDemande: 'recours',
    })

    expect(sendNotification).toBeCalledTimes(1)
    expect(sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'modification-request-status-update',
        message: {
          email: 'porteur@test.test',
          name: 'Nom du porteur',
          subject: `Votre demande de type recours pour le projet Nom du projet`,
        },
        context: {
          modificationRequestId: 'id-demande',
          userId: 'porteur-id',
        },
        variables: {
          nom_projet: 'Nom du projet',
          type_demande: 'recours',
          status: 'envoyée',
          modification_request_url: routes.DEMANDE_PAGE_DETAILS('id-demande'),
          document_absent: undefined,
        },
      })
    )
  })
})
