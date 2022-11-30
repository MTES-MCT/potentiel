import { EventStore, Repository, UniqueEntityID } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { userIs } from '@modules/users'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { GarantiesFinancièresValidées } from '../events'
import { Project } from '../Project'
import { GFDéjàValidéesError } from '../errors'

interface ValiderGFDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>

  publishToEventStore: EventStore['publish']
  projectRepo: Repository<Project>
}

type ValiderGFArgs = {
  projetId: string
  validéesPar: User
}

export const PermissionValiderGF = {
  nom: 'valider-gf',
  description: 'Valider les garanties financières',
}

export const makeValiderGF =
  ({ projectRepo, shouldUserAccessProject, publishToEventStore }: ValiderGFDeps) =>
  (args: ValiderGFArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { projetId, validéesPar } = args

    return wrapInfra(shouldUserAccessProject({ projectId: projetId, user: validéesPar })).andThen(
      (
        userHasRightsToProject
      ): ResultAsync<null, InfraNotAvailableError | UnauthorizedError | GFDéjàValidéesError> => {
        if (!userHasRightsToProject || !userIs('dreal')(validéesPar)) {
          return errAsync(new UnauthorizedError())
        }

        return projectRepo.load(new UniqueEntityID(projetId)).andThen((projet) => {
          if (projet.GFValidées) {
            return errAsync(new GFDéjàValidéesError())
          }
          return publishToEventStore(
            new GarantiesFinancièresValidées({
              payload: { projetId, validéesPar: validéesPar.id },
            })
          )
        })
      }
    )
  }
