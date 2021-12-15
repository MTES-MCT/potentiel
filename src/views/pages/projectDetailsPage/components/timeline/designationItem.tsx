import React from 'react'
import {
  ProjectCertificateGeneratedDTO,
  ProjectCertificateRegeneratedDTO,
  ProjectCertificateUpdatedDTO,
  ProjectEventDTO,
  ProjectNotifiedDTO,
} from '../../../../../modules/frise/dtos'
import { TimelineItem } from './timelineItem'
import { PassedIcon } from './stateIcons'
import { ContentArea } from './contentArea'
import { Date } from './date'
import { ItemTitle } from './itemTitle'
import { formatDate } from '../../../../../helpers/formatDate'

export const DesignationItem = (props: {
  events: (
    | ProjectNotifiedDTO
    | ProjectCertificateGeneratedDTO
    | ProjectCertificateRegeneratedDTO
    | ProjectCertificateUpdatedDTO
  )[]
  isLastItem: boolean
}) => {
  const notification = props.events.find((event) => event.type === 'ProjectNotified')

  const getLatestCertificateEvent = (events: ProjectEventDTO[]) => {
    const certificateEvents: ProjectEventDTO[] = []
    for (const event of events) {
      if (
        [
          'ProjectCertificateGenerated',
          'ProjectCertificateRegenerated',
          'ProjectCertificateUpdated',
        ].includes(event.type)
      ) {
        certificateEvents.push(event)
      }
    }
    return certificateEvents[certificateEvents.length - 1]
  }

  return (
    <TimelineItem isLastItem={props.isLastItem}>
      <PassedIcon />
      <ContentArea>
        {notification?.date && <Date date={notification?.date} />}
        <ItemTitle title="Notification de résultat" />
        {getLatestCertificateEvent(props.events) && (
          <a>
            Télécharger l'attestation de désignation (éditée le{' '}
            <span>{formatDate(getLatestCertificateEvent(props.events).date)})</span>
          </a>
        )}
      </ContentArea>
    </TimelineItem>
  )
}
