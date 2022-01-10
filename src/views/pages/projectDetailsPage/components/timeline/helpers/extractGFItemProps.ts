import {
  ProjectEventDTO,
  ProjectGFDueDateSetDTO,
  ProjectGFSubmittedDTO,
} from '../../../../../../modules/frise'

import ROUTES from '../../../../../../routes'

export const extractGFItemProps = (events: ProjectEventDTO[], now: number) => {
  const projectGFSubmitted = events.find(isProjectGFSubmitted)
  if (projectGFSubmitted) {
    const { date, variant: role, fileId, filename } = projectGFSubmitted
    return {
      type: 'garantiesFinancieres',
      date,
      status: 'submitted',
      role,
      url: makeGFDocumentLink(fileId, filename),
    }
  }
  const projectGFDueDateSet = events.find(isProjectGFDueDateSet)
  return projectGFDueDateSet
    ? {
        type: 'garantiesFinancieres',
        date: projectGFDueDateSet.date,
        status: projectGFDueDateSet.date < now ? 'hasPassed' : 'due',
        role: projectGFDueDateSet.variant,
      }
    : null
}

const isProjectGFDueDateSet = (event: ProjectEventDTO): event is ProjectGFDueDateSetDTO =>
  event.type === 'ProjectGFDueDateSet'

const isProjectGFSubmitted = (event: ProjectEventDTO): event is ProjectGFSubmittedDTO =>
  event.type === 'ProjectGFSubmitted'

const makeGFDocumentLink = (fileId: string, filename: string): string => {
  return ROUTES.DOWNLOAD_PROJECT_FILE(fileId, filename)
}
