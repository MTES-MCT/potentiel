import {
  ProjectEventDTO,
  ProjectEventListDTO,
  ProjectGFDueDateSetDTO,
  ProjectGFSubmittedDTO,
} from '../../../../../../modules/frise/dtos/ProjectEventListDTO'

type TimelineItem = GarantieFinanciereItem

type GarantieFinanciereItem = {
  type: 'garantiesFinancieres'
  event: ProjectGFSubmittedDTO | ProjectGFDueDateSetDTO
  date: number
}

type TimelineItemList = TimelineItem[]

type MapTimelineItemList = (projectEventList: ProjectEventListDTO) => TimelineItemList

export const mapTimelineItemList: MapTimelineItemList = (projectEventList) => {
  const timelineItemList: TimelineItemList = []
  const { events } = projectEventList

  for (const event of events) {
    makeGarantiesFinancieresPackage(event)
  }

  function makeGarantiesFinancieresPackage(event: ProjectEventDTO) {
    switch (event.type) {
      case 'ProjectGFSubmitted':
      case 'ProjectGFDueDateSet':
        const groupIndex = timelineItemList.findIndex(
          (group) => group.type === 'garantiesFinancieres'
        )
        if (groupIndex !== -1) {
          timelineItemList.splice(groupIndex, 1)
        }
        timelineItemList.push({
          event,
          date: event.date,
          type: 'garantiesFinancieres',
        })
        break
    }
  }

  return timelineItemList
}
