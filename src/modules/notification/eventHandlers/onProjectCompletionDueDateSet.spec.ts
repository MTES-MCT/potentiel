import { ProjectCompletionDueDateSet } from '@modules/project'
import makeFakeProject from '../../../__tests__/fixtures/project'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { makeOnProjectCompletionDueDateSet } from './onProjectCompletionDueDateSet'

describe(`Notification handler onProjectCompletionDueDateSet`, () => {
  describe(`Notifier l'application du délai de 18 mois relatif au CDC 2022`, () => {
    const sendNotification = jest.fn()
    const porteur1 = makeFakeUser({
      email: 'email1@test.test',
      id: 'user-1',
      fullName: 'nom_porteur1',
    })
    const porteur2 = makeFakeUser({
      email: 'email2@test.test',
      id: 'user-2',
      fullName: 'nom_porteur2',
    })
    const projetId = 'projetId'
    const getProjectUsers = jest.fn(async () => [porteur1, porteur2])
    const getProjectById = jest.fn(async () =>
      makeFakeProject({ id: projetId, nomProjet: 'nom_projet' })
    )
    describe(`Notifier les porteurs`, () => {
      it(`Etant donné un projet suivi par deux porteurs,
    alors ils devraient tous les deux être notifiés de l'ajout du délai`, async () => {
        const onProjectCompletionDueDateSet = makeOnProjectCompletionDueDateSet({
          sendNotification,
          getProjectUsers,
          getProjectById,
        })
        const évènement = new ProjectCompletionDueDateSet({
          payload: {
            projectId: projetId,
            completionDueOn: new Date('2025-01-01').getTime(),
            reason: 'délaiCdc2022',
          },
        })
        await onProjectCompletionDueDateSet(évènement)

        expect(sendNotification).toHaveBeenCalledTimes(2)

        expect(sendNotification).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            type: 'pp-delai-cdc-2022-appliqué',
            context: expect.objectContaining({ projetId, utilisateurId: 'user-1' }),
            variables: expect.objectContaining({
              nom_projet: 'nom_projet',
              projet_url: expect.anything(),
            }),
            message: expect.objectContaining({
              email: 'email1@test.test',
              name: 'nom_porteur1',
              subject: `Potentiel - Nouveau délai appliqué pour votre projet nom_projet`,
            }),
          })
        )

        expect(sendNotification).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            type: 'pp-delai-cdc-2022-appliqué',
            context: expect.objectContaining({ projetId, utilisateurId: 'user-2' }),
            variables: expect.objectContaining({
              nom_projet: 'nom_projet',
              projet_url: expect.anything(),
            }),
            message: expect.objectContaining({
              email: 'email2@test.test',
              name: 'nom_porteur2',
              subject: `Potentiel - Nouveau délai appliqué pour votre projet nom_projet`,
            }),
          })
        )
      })
    })
  })
})
