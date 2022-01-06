import React from 'react'
import { ItemDate, PastIcon, ItemTitle, ContentArea } from './components'

export type ImportItemProps = {
  date: number
}

export const ImportItem = ({ date }: ImportItemProps) => (
  <>
    <PastIcon />
    <ContentArea>
      {date && <ItemDate date={date} />}
      <ItemTitle title="Projet Importé" />
    </ContentArea>
  </>
)
