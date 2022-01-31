import React from 'react'
import { ContentArea, ItemTitle, NextUpIcon } from '.'

export const CRItem = () => {
  return (
    <>
      <NextUpIcon />
      <ContentArea>
        <ItemTitle title="Convention de raccordement" />
        <span aria-disabled className="disabled-action">
          Indiquer la date de signature (fonctionnalité bientôt disponible sur Potentiel)
        </span>
      </ContentArea>
    </>
  )
}
