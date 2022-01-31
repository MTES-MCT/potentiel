import React from 'react'
import { ProjectEventListDTO } from '@modules/frise'
import {
  TimelineItem,
  DesignationItem,
  GFItem,
  ImportItem,
  PTFItem,
  DCRItem,
  ACItem,
  CAItem,
  CRItem,
  MeSItem,
} from './components'
import {
  ACItemProps,
  CAItemProps,
  CRItemProps,
  DCRItemProps,
  DesignationItemProps,
  extractACItemProps,
  extractCAItemProps,
  extractCRItemProps,
  extractDCRItemProps,
  extractDesignationItemProps,
  extractGFItemProps,
  extractImportItemProps,
  extractMeSItemProps,
  extractPTFItemProps,
  GFItemProps,
  ImportItemProps,
  MeSItemProps,
  PTFItemProps,
} from './helpers'

export type TimelineProps = {
  projectEventList: ProjectEventListDTO
  now: number
}

type ItemProps =
  | ImportItemProps
  | DesignationItemProps
  | GFItemProps
  | DCRItemProps
  | ACItemProps
  | PTFItemProps
  | CRItemProps
  | MeSItemProps
  | CAItemProps

type UndatedItemProps = ItemProps & { date: undefined }

export const Timeline = ({
  projectEventList: {
    events,
    project: { id: projectId, isLaureat },
  },
  now,
}: TimelineProps) => {
  const PTFItemProps = extractPTFItemProps(events, { isLaureat })

  const itemProps: ItemProps[] = [
    extractDesignationItemProps(events, projectId),
    extractImportItemProps(events),
    extractGFItemProps(events, now),
    extractDCRItemProps(events, now),
    extractACItemProps(events),
    PTFItemProps?.status === 'submitted' ? PTFItemProps : null,
  ]
    .filter(isNotNull)
    .sort((a, b) => a.date - b.date)

  PTFItemProps?.status === 'not-submitted' &&
    insertBefore(itemProps, 'attestation-de-conformite', PTFItemProps)
  insertBefore(itemProps, 'attestation-de-conformite', extractCRItemProps(events, { isLaureat }))
  insertAfter(itemProps, 'attestation-de-conformite', extractCAItemProps(events, { isLaureat }))
  insertAfter(itemProps, 'attestation-de-conformite', extractMeSItemProps(events, { isLaureat }))

  const timelineItems = itemProps.map((props) => {
    const { type } = props

    switch (type) {
      case 'designation':
        return <DesignationItem {...props} />

      case 'import':
        return <ImportItem {...props} />

      case 'garanties-financieres':
        return <GFItem {...{ ...props, projectId }} />

      case 'demande-complete-de-raccordement':
        return <DCRItem {...{ ...props, projectId }} />

      case 'proposition-technique-et-financiere':
        return <PTFItem {...{ ...props, projectId }} />

      case 'convention-de-raccordement':
        return <CRItem />

      case 'attestation-de-conformite':
        return <ACItem {...props} />

      case 'mise-en-service':
        return <MeSItem />

      case 'contrat-achat':
        return <CAItem />
    }
  })

  return (
    <aside aria-label="Progress">
      <ol role="list" className="pl-0 overflow-hidden list-none mb-0">
        {timelineItems.map((component, groupIndex) => (
          <TimelineItem key={groupIndex} isLastItem={groupIndex === timelineItems.length - 1}>
            {component}
          </TimelineItem>
        ))}
      </ol>
    </aside>
  )
}

function isNotNull<T>(arg: T): arg is Exclude<T, null> {
  return arg !== null
}

function insertBefore(
  itemProps: ItemProps[],
  referenceType: ItemProps['type'],
  item: UndatedItemProps | null
) {
  if (itemProps.findIndex((props) => props.type === referenceType) !== -1) {
    if (item) {
      itemProps.splice(
        itemProps.findIndex((props) => props.type === referenceType),
        0,
        item
      )
    }
  }
}

function insertAfter(
  itemProps: ItemProps[],
  referenceType: ItemProps['type'],
  item: UndatedItemProps | null
) {
  if (itemProps.findIndex((props) => props.type === referenceType) !== -1) {
    if (item) {
      itemProps.splice(itemProps.findIndex((props) => props.type === referenceType) + 1, 0, item)
    }
  }
}
