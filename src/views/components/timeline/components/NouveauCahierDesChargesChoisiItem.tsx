import { NouveauCahierDesChargesChoisiDTO } from '@modules/frise'
import React from 'react'
import { ContentArea, ItemDate, ItemTitle, PastIcon } from '.'

export const NouveauCahierDesChargesChoisiItem = ({
  date,
  paruLe,
  alternatif,
}: NouveauCahierDesChargesChoisiDTO) => (
  <>
    <PastIcon />
    <ContentArea>
      <ItemDate date={date} />
      <ItemTitle
        title={`Choix du cahier des charges modifié${
          alternatif ? ' alternatif' : ''
        } paru le ${paruLe}`}
      />
    </ContentArea>
  </>
)
