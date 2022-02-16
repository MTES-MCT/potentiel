import { DomainEvent, EventBus } from '@core/domain'
import { errAsync, ResultAsync, wrapInfra } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import {
  ProjectDCRRemoved,
  ProjectGFRemoved,
  ProjectGFWithdrawn,
  ProjectPTFRemoved,
} from '../events'

interface RemoveStepDeps {
  shouldUserAccessProject: (args: { user: User; projectId: string }) => Promise<boolean>
  eventBus: EventBus
  isGarantiesFinancieresDeposeesALaCandidature: (projectId: string) => Promise<boolean>
}

type RemoveStepArgs = {
  type: 'ptf' | 'dcr' | 'garantie-financiere'
  projectId: string
  removedBy: User
}

export const makeRemoveStep =
  (deps: RemoveStepDeps) =>
  (args: RemoveStepArgs): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
    const { projectId, removedBy, type } = args

    return wrapInfra(deps.shouldUserAccessProject({ projectId, user: removedBy })).andThen(
      (userHasRightsToProject): ResultAsync<null, InfraNotAvailableError | UnauthorizedError> => {
        if (!userHasRightsToProject) return errAsync(new UnauthorizedError())
        if (type === 'garantie-financiere') {
          return wrapInfra(deps.isGarantiesFinancieresDeposeesALaCandidature(projectId))
            .map((isGarantiesFinancieresDeposeesALaCandidature) => {
              if (isGarantiesFinancieresDeposeesALaCandidature) {
                return new ProjectGFWithdrawn({
                  payload: {
                    projectId,
                    removedBy: removedBy.id,
                  },
                })
              }
              return new ProjectGFRemoved({
                payload: {
                  projectId,
                  removedBy: removedBy.id,
                },
              })
            })
            .andThen((event) => deps.eventBus.publish(event))
        }
        return deps.eventBus.publish(EventByType[type](args))
      }
    )
  }

const EventByType: Record<
  Exclude<RemoveStepArgs['type'], 'garantie-financiere'>,
  (args: RemoveStepArgs) => DomainEvent
> = {
  dcr: ({ projectId, removedBy }) =>
    new ProjectDCRRemoved({
      payload: {
        projectId,
        removedBy: removedBy.id,
      },
    }),
  ptf: ({ projectId, removedBy }) =>
    new ProjectPTFRemoved({
      payload: {
        projectId,
        removedBy: removedBy.id,
      },
    }),
}
