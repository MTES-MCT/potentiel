import React from 'react'
import { formatDate } from '../../../../../helpers/formatDate'
import {
  ProjectCertificateGeneratedDTO,
  ProjectCertificateRegeneratedDTO,
  ProjectCertificateUpdatedDTO,
  ProjectNotifiedDTO,
} from '../../../../../modules/frise/dtos'
import { Date, TimelineItem, PassedIcon, ItemTitle, ContentArea } from './components'
import { getLatestCertificateEvent } from './helpers'
import ROUTES from '../../../../../routes'
import { ProjectDataForProjectPage } from '../../../../../modules/project/dtos'
import { User } from '../../../../../entities'

export const DesignationItem = (props: {
  events: (
    | ProjectNotifiedDTO
    | ProjectCertificateGeneratedDTO
    | ProjectCertificateRegeneratedDTO
    | ProjectCertificateUpdatedDTO
  )[]
  isLastItem: boolean
  project: ProjectDataForProjectPage
  user: User
}) => {
  const notificationEvent = props.events.find((event) => event.type === 'ProjectNotified')
  const certificateEvent = getLatestCertificateEvent(props.events)
  const certificateLink =
    props.user.role === 'porteur-projet'
      ? ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES(props.project)
      : props.user.role === 'admin' || 'dgec'
      ? ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS(props.project)
      : null

  return (
    <TimelineItem isLastItem={props.isLastItem}>
      <PassedIcon />
      <ContentArea>
        {notificationEvent?.date && <Date date={notificationEvent?.date} />}
        <ItemTitle title="Notification de résultat" />
        {certificateEvent && certificateLink && (
          <a href={certificateLink}>
            Télécharger l'attestation de désignation (éditée le{' '}
            <span>{formatDate(certificateEvent.date)})</span>
          </a>
        )}
      </ContentArea>
    </TimelineItem>
  )
}
