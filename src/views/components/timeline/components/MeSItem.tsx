import React from 'react'
import { ContentArea, ItemTitle, NextUpIcon } from '.'

export const MeSItem = () => {
  return (
    <>
      <NextUpIcon />
      <ContentArea>
        <ItemTitle title="Mise en service" />
        <span aria-disabled className="disabled-action">
          Indiquer la date (fonctionnalité bientôt disponible sur Potentiel)
        </span>
      </ContentArea>
    </>
  )
}
