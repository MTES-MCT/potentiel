import React from 'react'
import {
  ProjectCertificateGeneratedDTO,
  ProjectCertificateRegeneratedDTO,
  ProjectCertificateUpdatedDTO,
  ProjectNotifiedDTO,
} from '../../../../../modules/frise/dtos'
import { TimelineItem } from './timelineItem'
import { User } from '../../../../../entities'

export const TimelineNotificationItem = (props: {
  events: (
    | ProjectNotifiedDTO
    | ProjectCertificateGeneratedDTO
    | ProjectCertificateRegeneratedDTO
    | ProjectCertificateUpdatedDTO
  )[]
  isLastItem: boolean
}) => {
  const itemTitle = 'Notification de résultat'
  const documentTitle = "Télécharger l'attestation de désignation"
  //const documentLink = props.user.role === 'porteur-projet' ?

  return (
    <TimelineItem
      isLastItem={props.isLastItem}
      event={props.event}
      title={itemTitle}
      documentAvailable={props.isCertificateAvailable}
      documentTitle={documentTitle}
    />
  )
}
