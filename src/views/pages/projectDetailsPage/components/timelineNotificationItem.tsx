import React from 'react'
import { ProjectNotifiedDTO } from '../../../../modules/frise/dtos/ProjectEventListDTO'
import { TimelineItem } from './timelineItem'

export const TimelineNotificationItem = (props: {
  event: ProjectNotifiedDTO
  isLastItem: boolean
}) => {
  const title = 'Notification de résultat'
  return <TimelineItem isLastItem={props.isLastItem} event={props.event} title={title} />
}
