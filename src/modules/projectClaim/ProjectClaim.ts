import { DomainEvent, UniqueEntityID } from '../../core/domain'
import { err, logger, ok, Result } from '../../core/utils'
import { EventStoreAggregate } from '../eventStore/EventStoreAggregate'
import { ProjectDataForProjectClaim } from '../project'
import { ProjectClaimed } from '../project/events'
import { EntityNotFoundError } from '../shared'
import {
  ClaimerIdentityCheckHasFailed,
  MissingAttestationDesignation,
  ProjectHasAlreadyBeenClaimed,
} from './errors'
import { ProjectCannotBeClaimedByUserAnymore } from './errors'
import { ProjectClaimedByOwner, ProjectClaimFailed } from './events'

export interface ProjectClaim extends EventStoreAggregate {
  claim: (args: {
    projectEmail: string
    claimerEmail: string
    userInputs: {
      prix?: number
      codePostal?: string
    }
    projectData: ProjectDataForProjectClaim
    attestationDesignationFileId?: string
  }) => Result<
    any,
    | EntityNotFoundError
    | ProjectHasAlreadyBeenClaimed
    | ProjectCannotBeClaimedByUserAnymore
    | ClaimerIdentityCheckHasFailed
  >
}

interface ProjectClaimProps {
  hasBeenClaimed: boolean
  failedClaimsCounter: number
}

export const makeProjectClaim = (args: {
  events: DomainEvent[]
  id: UniqueEntityID
}): Result<
  ProjectClaim,
  | EntityNotFoundError
  | ProjectHasAlreadyBeenClaimed
  | ProjectCannotBeClaimedByUserAnymore
  | ClaimerIdentityCheckHasFailed
> => {
  const { events, id } = args

  let lastUpdatedOn = new Date(0)
  // ASK PA : events = []
  // if (!events?.length) {
  //   return err(new EntityNotFoundError())
  // }

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
      return id
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
    projectEmail: string
    claimerEmail: string
    userInputs: {
      prix?: number
      codePostal?: string
    }
    projectData: ProjectDataForProjectClaim
    attestationDesignationFileId?: string
  }): ReturnType<ProjectClaim['claim']> {
    const MAX_ALLOWED_ATTEMPTS = 3

    const {
      projectEmail,
      claimerEmail,
      userInputs,
      projectData,
      attestationDesignationFileId,
    } = args

    const { projectId, claimedBy } = JSON.parse(id.toString())

    const { nomProjet: projectName } = projectData

    const payload: any = {
      projectId,
      claimedBy,
    }

    if (props.failedClaimsCounter >= MAX_ALLOWED_ATTEMPTS)
      return err(new ProjectCannotBeClaimedByUserAnymore(projectName))

    if (props.hasBeenClaimed) return err(new ProjectHasAlreadyBeenClaimed(projectName))

    const claimerIsTheOwner = projectEmail === claimerEmail

    if (claimerIsTheOwner) {
      _publishEvent(
        new ProjectClaimedByOwner({
          payload,
        })
      )

      return ok(projectName)
    }

    if (!attestationDesignationFileId) return err(new MissingAttestationDesignation(projectName))

    const claimerInputsAreCorrect = _checkClaimerInputsAreCorrect(userInputs, projectData)

    if (!claimerInputsAreCorrect) {
      const remainingAttempts = MAX_ALLOWED_ATTEMPTS - (props.failedClaimsCounter + 1)
      return err(new ClaimerIdentityCheckHasFailed(projectName, remainingAttempts))
    }

    _publishEvent(
      new ProjectClaimed({
        payload: {
          ...payload,
          attestationDesignationFileId,
        },
      })
    )

    return ok(projectName)
  }

  function _checkClaimerInputsAreCorrect(
    userInputs: { prix?: number; codePostal?: string },
    project: ProjectDataForProjectClaim
  ): boolean {
    return (
      userInputs.prix === project.prixReference &&
      userInputs.codePostal === project.codePostalProjet
    )
  }
}

export const makeClaimProjectAggregateId = (args: { projectId: string; claimedBy: string }) => {
  const { projectId, claimedBy } = args
  const key = { projectId, claimedBy }

  return JSON.stringify(key, Object.keys(key).sort()) // This makes the stringify stable (key order)
}
