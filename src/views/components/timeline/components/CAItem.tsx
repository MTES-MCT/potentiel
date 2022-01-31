import React from 'react'
import { ContentArea, ItemTitle, NextUpIcon } from '.'

export const CAItem = () => {
  return (
    <>
      <NextUpIcon />
      <ContentArea>
        <ItemTitle title="Contrat d'achat" />
        <span aria-disabled className="disabled-action">
          Indiquer la date de signature (fonctionnalité bientôt disponible sur Potentiel)
        </span>
      </ContentArea>
    </>
  )
}
