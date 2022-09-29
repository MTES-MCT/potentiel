import { CahierDesChargesChoisiDTO } from '@modules/frise'
import React from 'react'
import { ContentArea, ItemDate, ItemTitle, PastIcon } from '.'

export const CahierDesChargesChoisiItem = (payload: CahierDesChargesChoisiDTO) => {
  const { date, cahierDesCharges } = payload
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        {cahierDesCharges === 'initial' ? (
          <ItemTitle title={`Choix du cahier initial en vigueur à la candidature`} />
        ) : (
          <ItemTitle
            title={`Choix du cahier des charges modifié${
              payload.alternatif ? ' alternatif' : ''
            } paru le ${payload.paruLe}`}
          />
        )}
      </ContentArea>
    </>
  )
}
