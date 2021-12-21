import React from 'react'
import { ProjectImportedDTO } from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { Date, TimelineItem, PassedIcon, ItemTitle, ContentArea } from './components'

export const ImportItem = (props: { isLastItem: boolean; event: ProjectImportedDTO }) => (
  <TimelineItem isLastItem={props.isLastItem}>
    <PassedIcon />
    <ContentArea>
      {props.event.date && <Date date={props.event.date} />}
      <ItemTitle title="Projet Importé" />
    </ContentArea>
  </TimelineItem>
)
