import React from 'react'
import { ProjectImportedDTO } from '../../../../modules/frise/dtos/ProjectEventListDTO'
import { TimelineItem } from './timelineItem'

export const TimelineProjectImportedItem = (props: {
  isLastItem: boolean
  event: ProjectImportedDTO
}) => {
  const title = 'Projet importé'
  return <TimelineItem isLastItem={props.isLastItem} event={props.event} title={title} />
}
