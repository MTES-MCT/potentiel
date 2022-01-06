import React from 'react'
import { ItemDate, TimelineItem, PastIcon, ItemTitle, ContentArea } from './components'

export type ImportItemProps = {
  isLastItem: boolean
  groupIndex: number
  date: number
}

export const ImportItem = ({ isLastItem, date, groupIndex }: ImportItemProps) => (
  <TimelineItem isLastItem={isLastItem} groupIndex={groupIndex}>
    <PastIcon />
    <ContentArea>
      {date && <ItemDate date={date} />}
      <ItemTitle title="Projet Importé" />
    </ContentArea>
  </TimelineItem>
)
