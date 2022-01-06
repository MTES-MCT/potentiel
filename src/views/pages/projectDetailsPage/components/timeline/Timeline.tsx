import React from 'react'
import { Project } from '../../../../../entities'
import {
  ProjectCertificateDTO,
  ProjectClaimedDTO,
  ProjectEventListDTO,
  ProjectNotifiedDTO,
} from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { getLatestCertificateEvent, mapTimelineItemList } from './helpers'
import { DesignationItem, DesignationItemProps } from './DesignationItem'
import { ImportItem } from './ImportItem'
import { GarantieFinanciereItem } from './GarantiesFinancieresItem'
import ROUTES from '../../../../../routes'

export const Timeline = (props: {
  projectEventList: ProjectEventListDTO
  projectId: Project['id']
}) => {
  const { projectEventList, projectId } = props

  const timelineItemList = mapTimelineItemList(projectEventList).sort((a, b) => a.date - b.date)

  const groupCount = timelineItemList.length

  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden list-none">
        {timelineItemList.map((timelineItem, groupIndex) => {
          const isLastItem = groupIndex === groupCount - 1
          const { type } = timelineItem

          switch (type) {
            case 'designation':
              const { events: notifiedOrCertificateEvents } = timelineItem
              const props = getDesignationItemProps(projectId, notifiedOrCertificateEvents)
              return props ? <DesignationItem {...{ ...props, isLastItem, groupIndex }} /> : null

            case 'import':
              const { events: importedEvents } = timelineItem
              return (
                <ImportItem
                  event={importedEvents[0]}
                  isLastItem={isLastItem}
                  groupIndex={groupIndex}
                />
              )
            case 'garantiesFinancieres':
              const { event: gfSubmittedEvent, date } = timelineItem

              return (
                <GarantieFinanciereItem
                  isLastItem={isLastItem}
                  projectId={projectId}
                  event={gfSubmittedEvent}
                  groupIndex={groupIndex}
                  date={date}
                />
              )
          }
        })}
      </ol>
    </nav>
  )
}

const getDesignationItemProps: (
  projectId: string,
  notifiedOrCertificateEvents: (ProjectCertificateDTO | ProjectNotifiedDTO)[]
) => Omit<Omit<DesignationItemProps, 'isLastItem'>, 'groupIndex'> | undefined = (
  projectId,
  notifiedOrCertificateEvents
) => {
  const notificationEvent = notifiedOrCertificateEvents.find(isProjectNotified)

  if (notificationEvent) {
    const { date } = notificationEvent

    const certificateEvent = getLatestCertificateEvent(notifiedOrCertificateEvents)

    const attestation = certificateEvent && {
      date: certificateEvent.date,
      certificateLink: makeCertificateLink(certificateEvent, projectId),
      claimedBy: isProjectClaimed(certificateEvent) ? certificateEvent.claimedBy : undefined,
    }

    return {
      date,
      attestation,
    }
  }

  return undefined
}

const isProjectNotified = (
  event: ProjectCertificateDTO | ProjectNotifiedDTO
): event is ProjectNotifiedDTO => event.type === 'ProjectNotified'

const isProjectClaimed = (event: ProjectCertificateDTO): event is ProjectClaimedDTO =>
  event.type === 'ProjectClaimed'

const makeCertificateLink = (
  latestCertificateEvent: ProjectCertificateDTO,
  projectId: Project['id']
) => {
  const { certificateFileId, nomProjet, potentielIdentifier, variant } = latestCertificateEvent
  if (variant === 'admin' || variant === 'dgec') {
    return ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS({
      id: projectId,
      certificateFileId,
      email: latestCertificateEvent.email,
      potentielIdentifier,
    })
  }

  return ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES({
    id: projectId,
    certificateFileId,
    nomProjet,
    potentielIdentifier,
  })
}
