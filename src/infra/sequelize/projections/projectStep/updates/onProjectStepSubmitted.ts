import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { ProjectGFSubmitted, ProjectGFUploaded, ProjectPTFSubmitted } from '@modules/project'

type StepSubmittedEvent = ProjectPTFSubmitted | ProjectGFSubmitted | ProjectGFUploaded

const StepTypeByEventType: Record<StepSubmittedEvent['type'], string> = {
  [ProjectPTFSubmitted.type]: 'ptf',
  [ProjectGFSubmitted.type]: 'garantie-financiere',
  [ProjectGFUploaded.type]: 'garantie-financiere',
}

const StepDateByEvent = (event: StepSubmittedEvent): Date => {
  switch (event.type) {
    case ProjectPTFSubmitted.type:
      return event.payload.ptfDate
    case ProjectGFSubmitted.type:
    case ProjectGFUploaded.type:
      return event.payload.gfDate
  }
}

const getStatus = (event: StepSubmittedEvent) => {
  return event.type === ProjectGFUploaded.type ? 'validé' : 'à traiter'
}

export const onProjectStepSubmitted = (models) => async (event: StepSubmittedEvent) => {
  const { ProjectStep } = models

  const { projectId, fileId, submittedBy } = event.payload

  try {
    await ProjectStep.create({
      id: new UniqueEntityID().toString(),
      type: StepTypeByEventType[event.type],
      projectId,
      stepDate: StepDateByEvent(event),
      fileId,
      submittedBy,
      submittedOn: event.occurredAt,
      status: getStatus(event),
    })
  } catch (e) {
    logger.error(e)
  }
}
