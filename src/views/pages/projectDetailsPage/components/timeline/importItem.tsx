import React from 'react'
import { ProjectImportedDTO } from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { ContentArea } from './contentArea'
import { ItemTitle } from './itemTitle'
import { PassedIcon } from './stateIcons'
import { TimelineItem } from './timelineItem'
import { Date } from './date'

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
