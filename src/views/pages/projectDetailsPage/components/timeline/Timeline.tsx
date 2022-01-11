import React from 'react'
import { Project } from '../../../../../entities'
import { ProjectEventListDTO } from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import { TimelineItem } from './components'
import { DesignationItem } from './DesignationItem'
import { GarantieFinanciereItem } from './GarantiesFinancieresItem'
import { extractDesignationItemProps, extractGFItemProps, extractImportItemProps } from './helpers'
import { ImportItem } from './ImportItem'

export type TimelineProps = {
  projectEventList: ProjectEventListDTO
  projectId: Project['id']
  now: number
}

function isNotNull<T>(arg: T): arg is Exclude<T, null> {
  return arg !== null
}

export const Timeline = (props: TimelineProps) => {
  const { projectEventList, projectId, now } = props

  const { events } = projectEventList

  const itemProps = [
    extractDesignationItemProps(events, projectId),
    extractImportItemProps(events),
    extractGFItemProps(events, now),
  ]
    .filter(isNotNull)
    .sort((a, b) => a.date - b.date)

  const groupCount = itemProps.length

  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden list-none">
        {itemProps
          .map((props) => {
            const { type } = props

            switch (type) {
              case 'designation':
                return <DesignationItem {...props} />

              case 'import':
                return <ImportItem {...props} />

              case 'garantiesFinancieres':
                return <GarantieFinanciereItem {...{ ...props, projectId }} />
            }
          })
          .map((component, groupIndex) => (
            <TimelineItem key={groupIndex} isLastItem={groupIndex === groupCount - 1}>
              {component}
            </TimelineItem>
          ))}
      </ol>
    </nav>
  )
}
