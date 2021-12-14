import {
  ProjectEventDTO,
  ProjectEventListDTO,
} from '../../../../../modules/frise/dtos/ProjectEventListDTO'

type TimelineItem = {
  events: ProjectEventDTO[]
  date?: number
}

type TimelineItemList = TimelineItem[]

type MapTimelineItemList = (projectEventList: ProjectEventListDTO) => TimelineItemList

export const mapTimelineItemList: MapTimelineItemList = (projectEventList) => {
  const projectNotifiedEvent = projectEventList.events.find(
    (event) => event.type === 'ProjectNotified'
  )
  return projectNotifiedEvent
    ? [
        {
          events: projectEventList.events,
          date: projectNotifiedEvent.date,
        },
      ]
    : []
}
