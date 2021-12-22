import React from 'react'
import { ProjectCertificateDTO, ProjectNotifiedDTO } from '../../../../../modules/frise/dtos'
import { Date, TimelineItem, PassedIcon, ItemTitle, ContentArea } from './components'
import { getLatestCertificateEvent } from './helpers'
import { Project } from '../../../../../entities'
import { AttestationDesignationItem } from '.'

export const DesignationItem = (props: {
  events: (ProjectNotifiedDTO | ProjectCertificateDTO)[]
  isLastItem: boolean
  projectId: Project['id']
}) => {
  const { events, isLastItem, projectId } = props
  const notificationEvent = events.find(
    (event): event is ProjectNotifiedDTO => event.type === 'ProjectNotified'
  )
  const latestCertificateEvent = getLatestCertificateEvent(events)

  return notificationEvent ? (
    <TimelineItem isLastItem={isLastItem}>
      <PassedIcon />
      <ContentArea>
        <Date date={notificationEvent.date} />
        <ItemTitle title="Notification de résultat" />
        {latestCertificateEvent && (
          <AttestationDesignationItem
            latestCertificateEvent={latestCertificateEvent}
            projectId={projectId}
          />
        )}
      </ContentArea>
    </TimelineItem>
  ) : null
}
