import { DateFileAttenteDTO } from '@modules/frise'
import React from 'react'
import { ContentArea, ItemDate, ItemTitle, NextUpIcon } from '.'

export const DateFileAttenteItem = (props: DateFileAttenteDTO) => (
  <>
    <NextUpIcon />
    <ContentArea>
      <ItemDate date={props.date} />
      <ItemTitle title="Mise en file d'attente" />
    </ContentArea>
  </>
)
