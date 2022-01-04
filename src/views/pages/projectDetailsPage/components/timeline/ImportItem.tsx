import React from 'react'
import { ProjectImportedDTO } from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { ItemDate, TimelineItem, PastIcon, ItemTitle, ContentArea } from './components'

export const ImportItem = (props: {
  isLastItem: boolean
  event: ProjectImportedDTO
  groupIndex: number
}) => {
  const { isLastItem, event, groupIndex } = props
  return (
    <TimelineItem isLastItem={isLastItem} groupIndex={groupIndex}>
      <PastIcon />
      <ContentArea>
        {event.date && <ItemDate date={event.date} />}
        <ItemTitle title="Projet Importé" />
      </ContentArea>
    </TimelineItem>
  )
}
