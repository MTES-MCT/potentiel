import { ProjectDataForProjectClaim } from '.'
import { DomainEvent, UniqueEntityID } from '../../core/domain'
import { err, ok, Result } from '../../core/utils'
import { EventStoreAggregate } from '../../core/domain/EventStoreAggregate'
import { EntityNotFoundError } from '../shared'
import {
  ClaimerIdentityCheckHasFailedError,
  MissingAttestationDesignationError,
  ProjectHasAlreadyBeenClaimedError,
} from './errors'
import { ProjectCannotBeClaimedByUserAnymoreError } from './errors'
import { ProjectClaimedByOwner, ProjectClaimFailed, ProjectClaimed } from './events'

export interface ProjectClaim extends EventStoreAggregate {
  claim: (args: {
    projectEmail: string
    claimerEmail: string
    userInputs: {
      prix?: number
      numeroCRE?: string
    }
    projectData: ProjectDataForProjectClaim
    attestationDesignationFileId?: string
  }) => Result<
    any,
    | EntityNotFoundError
    | ProjectHasAlreadyBeenClaimedError
    | ProjectCannotBeClaimedByUserAnymoreError
    | ClaimerIdentityCheckHasFailedError
  >
}

interface ProjectClaimProps {
  hasBeenClaimed: boolean
  failedClaimsCounter: number
}

export const makeProjectClaim = (args: {
  events?: DomainEvent[]
  id: UniqueEntityID
}): Result<
  ProjectClaim,
  | EntityNotFoundError
  | ProjectHasAlreadyBeenClaimedError
  | ProjectCannotBeClaimedByUserAnymoreError
  | ClaimerIdentityCheckHasFailedError
> => {
  const { events, id } = args

  let lastUpdatedOn = new Date(0)

  const props: ProjectClaimProps = {
    hasBeenClaimed: false,
    failedClaimsCounter: 0,
  }

  const pendingEvents: DomainEvent[] = []

  if (events) {
    for (const event of events) {
      _processEvent(event)
    }
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
      numeroCRE?: string
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
      claimerEmail,
    }

    if (props.failedClaimsCounter >= MAX_ALLOWED_ATTEMPTS)
      return err(new ProjectCannotBeClaimedByUserAnymoreError(projectName))

    if (props.hasBeenClaimed) return err(new ProjectHasAlreadyBeenClaimedError(projectName))

    const claimerIsTheOwner = projectEmail === claimerEmail

    if (claimerIsTheOwner) {
      _publishEvent(
        new ProjectClaimedByOwner({
          payload,
        })
      )

      return ok(projectName)
    }

    if (!attestationDesignationFileId)
      return err(new MissingAttestationDesignationError(projectName))

    const claimerInputsAreCorrect = _checkClaimerInputsAreCorrect(userInputs, projectData)

    if (!claimerInputsAreCorrect) {
      const remainingAttempts = MAX_ALLOWED_ATTEMPTS - (props.failedClaimsCounter + 1)
      return err(new ClaimerIdentityCheckHasFailedError(projectName, remainingAttempts))
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
    userInputs: { prix?: number; numeroCRE?: string },
    project: ProjectDataForProjectClaim
  ): boolean {
    const isPrixReferenceCorrect = userInputs.prix === project.prixReference
    const isNumeroCRECorrect = userInputs.numeroCRE === project.numeroCRE

    return isPrixReferenceCorrect && isNumeroCRECorrect
  }
}
