import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { ProjectNotifiedDTO } from '../../../../modules/frise/dtos/ProjectEventListDTO'
import { TimelineItem } from './timelineItem'

export const TimelineProjectImportedItem = (props: {
  isLastItem: boolean
  event: ProjectNotifiedDTO
}) => {
  return (
    <TimelineItem isLastItem={props.isLastItem}>
      <span className="text-sm font-semibold tracking-wide uppercase">
        {formatDate(props.event.date)}
      </span>
      <span className="text-sm font-semibold tracking-wide uppercase">Projet importé</span>
    </TimelineItem>
  )
}
