import { DomainEvent, UniqueEntityID } from '../../core/domain'
import { err, ok, Result } from '../../core/utils'
import { EventStoreAggregate } from '../eventStore/EventStoreAggregate'
import { ProjectClaimed, ProjectClaimedByOwner, ProjectClaimFailed } from '../project/events'
import { EntityNotFoundError } from '../shared'
import { ProjectCannotBeClaimedByUserAnymore } from './errors/ProjectCantBeClaimedAnymoreByUser'
import { ProjectHasAlreadyBeenClaimed } from './errors/ProjectHasAlreadyBeenClaimed'

export interface ProjectClaim extends EventStoreAggregate {
  claim: (args: {
    claimerIsTheOwner?: boolean
    claimerInputsAreCorrect?: boolean
    attestationDesignationFileId?: string
  }) => Result<
    any,
    EntityNotFoundError | ProjectHasAlreadyBeenClaimed | ProjectCannotBeClaimedByUserAnymore
  >
}

interface ProjectClaimProps {
  hasBeenClaimed: boolean
  failedClaimsCounter: number
}

export const makeProjectClaim = (args: {
  events: DomainEvent[]
  projectId: UniqueEntityID
  userId: UniqueEntityID
}): Result<
  ProjectClaim,
  EntityNotFoundError | ProjectHasAlreadyBeenClaimed | ProjectCannotBeClaimedByUserAnymore
> => {
  const { events, projectId, userId } = args

  let lastUpdatedOn = new Date(0)

  if (!events?.length) {
    return err(new EntityNotFoundError())
  }

  const props: ProjectClaimProps = {
    hasBeenClaimed: false,
    failedClaimsCounter: 0,
  }

  const pendingEvents: DomainEvent[] = []

  for (const event of events) {
    _processEvent(event)
  }

  return ok({
    claim,
    get pendingEvents() {
      return pendingEvents
    },
    get id() {
      return projectId
    },
    get lastUpdatedOn() {
      return lastUpdatedOn
    },
  })

  function _processEvent(event: DomainEvent) {
    switch (event.type) {
      case ProjectClaimedByOwner.type:
      case ProjectClaimed.type:
        props.hasBeenClaimed = true
        break
      case ProjectClaimFailed.type:
        props.failedClaimsCounter++
        break
      default:
        // ignore other event types
        break
    }

    lastUpdatedOn = event.occurredAt
  }

  function _publishEvent(event: DomainEvent) {
    pendingEvents.push(event)
    _processEvent(event)
  }

  function claim(args: {
    claimerIsTheOwner?: boolean
    claimerInputsAreCorrect?: boolean
    attestationDesignationFileId?: string
  }) {
    const payload: any = {
      projectId: projectId.toString(),
      claimedBy: userId.toString(),
    }

    const { claimerIsTheOwner, claimerInputsAreCorrect, attestationDesignationFileId } = args

    if (props.failedClaimsCounter >= 3) return err(new ProjectCannotBeClaimedByUserAnymore())

    if (props.hasBeenClaimed) return err(new ProjectHasAlreadyBeenClaimed())

    if (claimerIsTheOwner) {
      _publishEvent(
        new ProjectClaimedByOwner({
          payload,
        })
      )

      return ok(null)
    }

    if (!claimerInputsAreCorrect) {
      _publishEvent(
        new ProjectClaimFailed({
          payload,
        })
      )
      return ok(null)
    }

    _publishEvent(
      new ProjectClaimed({
        payload: {
          ...payload,
          attestationDesignationFileId,
        },
      })
    )

    return ok(null)
  }
}
