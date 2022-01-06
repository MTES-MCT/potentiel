import React from 'react'
import { ProjectCertificateDTO, ProjectNotifiedDTO } from '../../../../../modules/frise/dtos'
import { ItemDate, TimelineItem, PastIcon, ItemTitle, ContentArea } from './components'
import { getLatestCertificateEvent } from './helpers'
import { Project } from '../../../../../entities'
import { AttestationDesignationItem } from '.'

export const DesignationItem = (props: {
  events: (ProjectNotifiedDTO | ProjectCertificateDTO)[]
  isLastItem: boolean
  projectId: Project['id']
  groupIndex: number
}) => {
  const { events, isLastItem, projectId, groupIndex } = props
  const notificationEvent = events.find(isProjectNotified)
  const latestCertificateEvent = getLatestCertificateEvent(events)

  return notificationEvent ? (
    <TimelineItem isLastItem={isLastItem} groupIndex={groupIndex}>
      <PastIcon />
      <ContentArea>
        <ItemDate date={notificationEvent.date} />
        <ItemTitle title="Notification de résultat" />
        {latestCertificateEvent && (
          <AttestationDesignationItem
            certificateEvent={latestCertificateEvent}
            projectId={projectId}
          />
        )}
      </ContentArea>
    </TimelineItem>
  ) : null
}

const isProjectNotified = (
  event: ProjectCertificateDTO | ProjectNotifiedDTO
): event is ProjectNotifiedDTO => event.type === 'ProjectNotified'
