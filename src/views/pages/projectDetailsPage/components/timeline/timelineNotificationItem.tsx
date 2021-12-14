import React from 'react'
import { ProjectNotifiedDTO } from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { TimelineItem } from './timelineItem'
import { User } from '../../../../../entities'

export const TimelineNotificationItem = (props: {
  event: ProjectNotifiedDTO
  isLastItem: boolean
  isCertificateAvailable: boolean
  user: User
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
