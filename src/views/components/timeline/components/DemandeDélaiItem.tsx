import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import {
  ItemDate,
  ItemTitle,
  ContentArea,
  CurrentIcon,
  CancelledStepIcon,
  UnvalidatedStepIcon,
} from '.'
import { DemandeDélaiDTO } from '@modules/frise/dtos'

type DemandeDélaiItemProps = DemandeDélaiDTO

export const DemandeDélaiItem = ({
  date,
  demandeUrl,
  dateAchèvementDemandée,
  statut,
}: DemandeDélaiItemProps) => {
  const titre =
    statut === 'envoyée'
      ? 'Délai supplémentaire demandé'
      : statut === 'annulée'
      ? 'Demande délai supplémentaire annulée'
      : 'Demande délai supplémentaire rejetée'
  return (
    <>
      {statut === 'envoyée' && <CurrentIcon />}
      {statut === 'annulée' && <CancelledStepIcon />}
      {statut === 'rejetée' && <UnvalidatedStepIcon />}
      <ContentArea>
        <ItemDate date={date} />
        <>
          <ItemTitle title={titre} />
          <p className="p-0 m-0">
            Date limite d'achèvement demandée : {formatDate(dateAchèvementDemandée)}
            <br />
            <a href={demandeUrl}>Voir la demande</a>
          </p>
        </>
      </ContentArea>
    </>
  )
}
