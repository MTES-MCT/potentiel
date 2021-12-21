import React from 'react'
import { ProjectGFSubmittedDTO } from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import routes from '../../../../../routes'
import { TimelineItem, ItemTitle, ItemDate, ContentArea, PassedIcon } from './components'

export const GarantieFinanciereItem = (props: {
  isLastItem: boolean
  events: ProjectGFSubmittedDTO[]
}) => {
  return (
    <TimelineItem isLastItem={props.isLastItem}>
      <PassedIcon />
      <ContentArea>
        <ItemTitle title="Garantie Financière" />
        <ItemDate date={props.events[0].date} />
        <a>Télécharger l'attestation (déposée par {props.events[0].submittedBy})</a>
      </ContentArea>
    </TimelineItem>
  )
}
