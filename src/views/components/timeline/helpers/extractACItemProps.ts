import { DemandeDelaiSignaledDTO, is, ProjectEventDTO, ProjectStatus } from '@modules/frise'
import { or } from '@core/utils'

export type ACItemProps = {
  type: 'attestation-de-conformite'
  date: number
  covidDelay?: true
}

export const extractACItemProps = (
  events: ProjectEventDTO[],
  project: { status: ProjectStatus }
): ACItemProps | null => {
  if (project.status !== 'Classé') {
    return null
  }

  const completionDueOnEvents = events
    .filter(or(is('ProjectCompletionDueDateSet'), is('CovidDelayGranted')))
    .sort((a, b) => a.date - b.date)

  const latestEvent = completionDueOnEvents.pop()

  const hasCovidDelay = events.find(is('CovidDelayGranted'))

  if (latestEvent) {
    return {
      type: 'attestation-de-conformite',
      date: latestEvent.date,
      ...(hasCovidDelay && { covidDelay: true }),
    }
  }

  return null
}
