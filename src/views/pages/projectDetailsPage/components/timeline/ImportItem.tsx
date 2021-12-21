import React from 'react'
import { ProjectImportedDTO } from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { ItemDate, TimelineItem, PassedIcon, ItemTitle, ContentArea } from './components'

export const ImportItem = (props: { isLastItem: boolean; event: ProjectImportedDTO }) => {
  const { isLastItem, event } = props
  return (
    <TimelineItem isLastItem={isLastItem}>
      <PassedIcon />
      <ContentArea>
        {event.date && <ItemDate date={event.date} />}
        <ItemTitle title="Projet Importé" />
      </ContentArea>
    </TimelineItem>
  )
}
