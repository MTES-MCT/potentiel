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
  return [
    {
      events: projectEventList.events,
      date: projectEventList.events.find((event) => (event.type = 'ProjectNotified'))?.date,
    },
  ]
}
