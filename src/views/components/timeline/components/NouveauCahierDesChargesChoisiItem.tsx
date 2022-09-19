import { NouveauCahierDesChargesChoisiDTO } from '@modules/frise'
import React from 'react'
import { ContentArea, ItemDate, ItemTitle, PastIcon } from '.'

export const NouveauCahierDesChargesChoisiItem = ({
  date,
  paruLe,
}: NouveauCahierDesChargesChoisiDTO) => (
  <>
    <PastIcon />
    <ContentArea>
      <ItemDate date={date} />
      <ItemTitle title={`Choix du cahier des charges modifié paru le ${paruLe}`} />
    </ContentArea>
  </>
)
