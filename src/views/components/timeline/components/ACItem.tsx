import React from 'react'
import { ContentArea, ItemDate, ItemTitle, NextUpIcon } from '.'
import { ACItemProps } from '../helpers'
export const ACItem = ({ date }: ACItemProps) => {
  return (
    <>
      <NextUpIcon />
      <ContentArea>
        {date && <ItemDate date={date} />}
        <ItemTitle title="Attestation de conformité" />
        <span aria-disabled className="disabled-action">
          Transmettre l'attestation (fonctionnalité bientôt disponible sur Potentiel)
        </span>
      </ContentArea>
    </>
  )
}
