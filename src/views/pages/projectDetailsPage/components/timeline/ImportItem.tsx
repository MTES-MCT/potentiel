import React from 'react'
import { ItemDate, PastIcon, ItemTitle, ContentArea } from './components'
import { ImportItemProps } from './helpers/extractImportItemProps'

export const ImportItem = ({ date }: ImportItemProps) => (
  <>
    <PastIcon />
    <ContentArea>
      {date && <ItemDate date={date} />}
      <ItemTitle title="Projet Importé" />
    </ContentArea>
  </>
)
