import { UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { ProjectDCRSubmitted, ProjectGFSubmitted, ProjectPTFSubmitted } from '@modules/project'

type StepSubmittedEvent = ProjectPTFSubmitted | ProjectDCRSubmitted | ProjectGFSubmitted

const StepTypeByEventType: Record<StepSubmittedEvent['type'], string> = {
  [ProjectPTFSubmitted.type]: 'ptf',
  [ProjectDCRSubmitted.type]: 'dcr',
  [ProjectGFSubmitted.type]: 'garantie-financiere',
}

const StepDateByEvent = (event: StepSubmittedEvent): Date => {
  switch (event.type) {
    case ProjectPTFSubmitted.type:
      return event.payload.ptfDate
    case ProjectDCRSubmitted.type:
      return event.payload.dcrDate
    case ProjectGFSubmitted.type:
      return event.payload.gfDate
  }
}

const StepDetailsByEvent = (event: StepSubmittedEvent): Record<string, any> | undefined => {
  if (event.type === ProjectDCRSubmitted.type) {
    return { numeroDossier: event.payload.numeroDossier }
  }
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
      details: StepDetailsByEvent(event),
    })
  } catch (e) {
    logger.error(e)
  }
}
