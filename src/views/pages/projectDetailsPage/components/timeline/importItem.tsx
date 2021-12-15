import React from 'react'
import { ProjectImportedDTO } from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { ContentArea } from './ContentArea'
import { ItemTitle } from './ItemTitle'
import { PassedIcon } from './stateIcons'
import { TimelineItem } from './TimelineItem'
import { Date } from './Date'

export const ImportItem = (props: { isLastItem: boolean; event: ProjectImportedDTO }) => {
  const title = 'Projet importé'
  return (
    <TimelineItem isLastItem={props.isLastItem}>
      <PassedIcon />
      <ContentArea>
        {props.event.date && <Date date={props.event.date} />}
        <ItemTitle title="Projet Importé" />
      </ContentArea>
    </TimelineItem>
  )
}
