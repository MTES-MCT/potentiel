import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { getProjectDataForProjectPage } from './getProjectDataForProjectPage'
import { v4 as uuid } from 'uuid'
import { User } from '@entities'
import { USER_ROLES } from '@modules/users'

const { Project } = models

describe(`Récupérer les données de consultation d'un projet`, () => {
  beforeEach(resetDatabase)

  describe(`Données de gestionnaire de réseau`, () => {
    describe(`Ne pas récupérer les données de gestionnaire de réseau pour les ademe, caisse des dépôts`, () => {
      for (const role of ['ademe', 'caisse-des-dépôts']) {
        it(`Lorsqu'un utilisateur ${role} récupère les donnèes d'un projet
            Alors aucune donnée de gestionnaire de réseau ne devrait être récupérée`, async () => {
          const idProjet = uuid()

          await Project.create(
            makeFakeProject({
              id: idProjet,
              appelOffreId: 'Fessenheim',
              notifiedOn: 1234,
              numeroGestionnaire: 'NUM-GEST-RESEAU',
            })
          )

          const donnéesProjet = (
            await getProjectDataForProjectPage({
              projectId: idProjet,
              user: { role } as User,
            })
          )._unsafeUnwrap()

          expect(donnéesProjet.gestionnaireDeRéseau).toBeUndefined()
        })
      }
    })

    describe(`Ne pas récupérer les données de gestionnaire de réseau si aucun identifiant n'est renseigné`, () => {
      it(`Étant donné un projet sans identifiant de gestionnaire de réseau
            Lorsqu'un porteur de projet récupère les donnèes d'un projet
            Alors aucune donnée de gestionnaire de réseau ne devrait être récupérée`, async () => {
        const idProjet = uuid()

        await Project.create(
          makeFakeProject({
            id: idProjet,
            appelOffreId: 'Fessenheim',
            notifiedOn: 1234,
            numeroGestionnaire: undefined,
          })
        )

        const donnéesProjet = (
          await getProjectDataForProjectPage({
            projectId: idProjet,
            user: { role: 'admin' } as User,
          })
        )._unsafeUnwrap()

        expect(donnéesProjet.gestionnaireDeRéseau).toBeUndefined()
      })
    })

    describe(`Récupérer les données de gestionnaire de réseau pour tous les utilisateurs sauf les ademe et caisse des dépôts`, () => {
      for (const role of USER_ROLES.filter((ur) => !['ademe', 'caisse-des-dépôts'].includes(ur))) {
        it(`Lorsqu'un utilisateur ${role} récupère les donnèes d'un projet
            Alors les données de gestionnaire de réseau devrait être récupérées`, async () => {
          const idProjet = uuid()

          await Project.create(
            makeFakeProject({
              id: idProjet,
              appelOffreId: 'Fessenheim',
              notifiedOn: 1234,
              numeroGestionnaire: 'NUM-GEST-RESEAU',
              dateMiseEnService: new Date('2023-12-31'),
              dateFileAttente: new Date('2022-06-30'),
            })
          )

          const donnéesProjet = (
            await getProjectDataForProjectPage({
              projectId: idProjet,
              user: { role } as User,
            })
          )._unsafeUnwrap()

          expect(donnéesProjet.gestionnaireDeRéseau).toEqual({
            numeroGestionnaire: 'NUM-GEST-RESEAU',
          })
        })
      }
    })
  })
})
