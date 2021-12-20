import React from 'react'
import { formatDate } from '../../../../../helpers/formatDate'
import {
  ProjectCertificateDTO,
  ProjectCertificateGeneratedDTO,
  ProjectCertificateRegeneratedDTO,
  ProjectCertificateUpdatedDTO,
  ProjectNotifiedDTO,
} from '../../../../../modules/frise/dtos'
import { Date, TimelineItem, PassedIcon, ItemTitle, ContentArea } from './components'
import { getLatestCertificateEvent } from './helpers'
import { Project, User } from '../../../../../entities'
import { makeCertificateLink } from './helpers/makeCertificateLink'

export const DesignationItem = (props: {
  events: (
    | ProjectNotifiedDTO
    | ProjectCertificateDTO
    | ProjectCertificateGeneratedDTO
    | ProjectCertificateRegeneratedDTO
    | ProjectCertificateUpdatedDTO
  )[]
  isLastItem: boolean
  user: User
  projectId: Project['id']
}) => {
  const projectId = props.projectId
  const notificationEvent = props.events.find(
    (event): event is ProjectNotifiedDTO => event.type === 'ProjectNotified'
  )
  const latestCertificateEvent = getLatestCertificateEvent(props.events)
  const certificateLink = makeCertificateLink(latestCertificateEvent, projectId)

  return notificationEvent ? (
    <TimelineItem isLastItem={props.isLastItem}>
      <PassedIcon />
      <ContentArea>
        <Date date={notificationEvent.date} />
        <ItemTitle title="Notification de résultat" />
        {latestCertificateEvent && certificateLink && (
          <a href={certificateLink}>
            Télécharger l'attestation de désignation (éditée le{' '}
            <span>{formatDate(latestCertificateEvent.date)})</span>
          </a>
        )}
      </ContentArea>
    </TimelineItem>
  ) : null
}
