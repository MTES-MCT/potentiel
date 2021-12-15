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

export const DesignationItem = (props: {
  events: (
    | ProjectNotifiedDTO
    | ProjectCertificateGeneratedDTO
    | ProjectCertificateRegeneratedDTO
    | ProjectCertificateUpdatedDTO
  )[]
  isLastItem: boolean
}) => {
  const notificationEvent = props.events.find((event) => event.type === 'ProjectNotified')
  const certificateEvent = getLatestCertificateEvent(props.events)

  return (
    <TimelineItem isLastItem={props.isLastItem}>
      <PassedIcon />
      <ContentArea>
        {notificationEvent?.date && <Date date={notificationEvent?.date} />}
        <ItemTitle title="Notification de résultat" />
        {certificateEvent && (
          <a>
            Télécharger l'attestation de désignation (éditée le{' '}
            <span>{formatDate(certificateEvent.date)})</span>
          </a>
        )}
      </ContentArea>
    </TimelineItem>
  )
}
