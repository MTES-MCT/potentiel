import { is, ProjectEventDTO, ProjectStatus } from '@modules/frise'
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
    const demandeDelaiSignaledEventApplicable = events
      .filter(is('DemandeDelaiSignaled'))
      .filter(
        (e) => e.isAccepted && e.isNewDateApplicable && e.newCompletionDueOn > latestEvent.date
      )
      .sort((a, b) => a.newCompletionDueOn - b.newCompletionDueOn)
      .pop()

    return {
      type: 'attestation-de-conformite',
      date: demandeDelaiSignaledEventApplicable
        ? demandeDelaiSignaledEventApplicable.newCompletionDueOn
        : latestEvent.date,
      ...(hasCovidDelay && { covidDelay: true }),
    }
  }

  return null
}
