import { DateFileAttenteDTO } from '@modules/frise'
import React from 'react'
import { ContentArea, ItemDate, ItemTitle, PastIcon } from '.'

export const DateFileAttenteItem = (props: DateFileAttenteDTO) => (
  <>
    <PastIcon />
    <ContentArea>
      <ItemDate date={props.date} />
      <ItemTitle title="Entrée en file d'attente" />
    </ContentArea>
  </>
)
