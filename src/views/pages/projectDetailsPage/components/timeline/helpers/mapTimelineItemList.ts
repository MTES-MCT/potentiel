import {
  ProjectCertificateDTO,
  ProjectEventDTO,
  ProjectEventListDTO,
  ProjectGFDueDateSetDTO,
  ProjectGFSubmittedDTO,
  ProjectImportedDTO,
  ProjectNotifiedDTO,
} from '../../../../../../modules/frise/dtos/ProjectEventListDTO'

type TimelineItem = DesignationItem | ImportItem | GarantieFinanciereItem

type DesignationItem = {
  type: 'designation'
  events: (ProjectNotifiedDTO | ProjectCertificateDTO)[]
  date: number
}

type ImportItem = {
  type: 'import'
  events: ProjectImportedDTO[]
  date: number
}

type GarantieFinanciereItem = {
  type: 'garantiesFinancieres'
  event: ProjectGFSubmittedDTO | ProjectGFDueDateSetDTO
  date: number
}

const isDesignation = (item: TimelineItem): item is DesignationItem => item.type === 'designation'

type TimelineItemList = TimelineItem[]

type MapTimelineItemList = (projectEventList: ProjectEventListDTO) => TimelineItemList

export const mapTimelineItemList: MapTimelineItemList = (projectEventList) => {
  const timelineItemList: TimelineItemList = []
  const { events } = projectEventList

  for (const event of events) {
    makeDesignationPackage(event)
    makeImportPackage(event)
    makeGarantiesFinancieresPackage(event)
  }

  function makeDesignationPackage(event: ProjectEventDTO) {
    switch (event.type) {
      case 'ProjectNotified':
        timelineItemList.push({
          events: [event],
          date: event.date,
          type: 'designation',
        })
        const importIndex = timelineItemList.findIndex((group) => group.type === 'import')
        if (importIndex !== -1) {
          timelineItemList.splice(importIndex, 1)
        }
        break
      case 'ProjectCertificateGenerated':
      case 'ProjectCertificateRegenerated':
      case 'ProjectCertificateUpdated':
      case 'ProjectClaimed':
        const designation = timelineItemList.find(isDesignation)
        designation?.events.push(event)
        break
    }
  }

  function makeImportPackage(event: ProjectEventDTO) {
    switch (event.type) {
      case 'ProjectImported':
        const hasDesignation = timelineItemList.some(isDesignation)
        if (!hasDesignation) {
          timelineItemList.push({
            events: [event],
            date: event.date,
            type: 'import',
          })
        }
        break
    }
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
