import React from 'react'
import { ItemDate, ItemTitle, ContentArea, CurrentIcon } from './'
import { ModificationRequestItemProps } from '../helpers/extractModificationRequestsItemProps'

export const DelaiItem = ({ date, delayInMonths }: ModificationRequestItemProps) => (
  <>
    <CurrentIcon />
    <ContentArea>
      {date && <ItemDate date={date} />}
      <ItemTitle title={`Demande de prolongation de délai déposée (${delayInMonths} mois)`} />
    </ContentArea>
  </>
)
