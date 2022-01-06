import React from 'react'
import { Project } from '../../../../../entities'
import {
  ProjectCertificateDTO,
  ProjectClaimedDTO,
  ProjectEventDTO,
  ProjectEventListDTO,
  ProjectGFSubmittedDTO,
  ProjectNotifiedDTO,
} from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { getLatestCertificateEvent, mapTimelineItemList } from './helpers'
import { DesignationItem, DesignationItemProps } from './DesignationItem'
import { ImportItem } from './ImportItem'
import { GarantieFinanciereItem } from './GarantiesFinancieresItem'
import ROUTES from '../../../../../routes'
import { TimelineItem } from './components'

export type TimelineProps = {
  projectEventList: ProjectEventListDTO
  projectId: Project['id']
}

export const Timeline = (props: TimelineProps) => {
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
              return props ? (
                <TimelineItem key={groupIndex} isLastItem={isLastItem}>
                  <DesignationItem {...props} />
                </TimelineItem>
              ) : null

            case 'import':
              return (
                <TimelineItem key={groupIndex} isLastItem={isLastItem}>
                  <ImportItem {...timelineItem} />
                </TimelineItem>
              )

            case 'garantiesFinancieres':
              const { event: gfSubmittedEvent, date } = timelineItem

              const documentLink = isProjectGFSubmitted(gfSubmittedEvent)
                ? makeGFDocumentLink(gfSubmittedEvent.fileId, gfSubmittedEvent.filename)
                : undefined

              const dueDate = gfSubmittedEvent.type === 'ProjectGFDueDateSet' ? date : undefined
              const deadlineHaspassed = dueDate ? new Date().getTime() > dueDate : undefined

              return (
                <TimelineItem key={groupIndex} isLastItem={isLastItem}>
                  <GarantieFinanciereItem
                    userRole={gfSubmittedEvent.variant}
                    projectId={projectId}
                    date={date}
                    dueDate={dueDate}
                    deadlineHaspassed={deadlineHaspassed}
                    documentLink={documentLink}
                  />
                </TimelineItem>
              )
          }
        })}
      </ol>
    </nav>
  )
}

const isProjectGFSubmitted = (event: ProjectEventDTO): event is ProjectGFSubmittedDTO =>
  event.type === 'ProjectGFSubmitted'

const makeGFDocumentLink = (fileId: string, filename: string): string => {
  return ROUTES.DOWNLOAD_PROJECT_FILE(fileId, filename)
}

const getDesignationItemProps: (
  projectId: string,
  notifiedOrCertificateEvents: (ProjectCertificateDTO | ProjectNotifiedDTO)[]
) => DesignationItemProps | undefined = (projectId, notifiedOrCertificateEvents) => {
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
