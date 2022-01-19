import React from 'react'
import { Project } from '@entities'
import { ProjectEventListDTO } from '@modules/frise'
import { TimelineItem, DesignationItem, GFItem, ImportItem, PTFItem, DCRItem } from './components'
import {
  extractDCRItemProps,
  extractDesignationItemProps,
  extractGFItemProps,
  extractImportItemProps,
  extractPTFItemProps,
} from './helpers'

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
    extractDCRItemProps(events, now),
    extractPTFItemProps(events),
  ]
    .filter(isNotNull)
    .sort(sortItemProps)

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
                return <GFItem {...{ ...props, projectId }} />

              case 'demande-complete-de-raccordement':
                return <DCRItem {...{ ...props, projectId }} />

              case 'proposition-technique-et-financiere':
                return <PTFItem {...{ ...props, projectId }} />
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

const hasDateProperty = (props: unknown): props is { date: any } =>
  props && typeof props === 'object' ? props.hasOwnProperty('date') : false

const sortItemProps = (a: unknown, b: unknown) => {
  const A_IS_GREATER_THAN_B = 1
  const A_IS_LESS_THAN_B = -1

  if (!hasDateProperty(a)) {
    return A_IS_GREATER_THAN_B
  }

  if (!hasDateProperty(b)) {
    return A_IS_LESS_THAN_B
  }

  return a.date - b.date
}
