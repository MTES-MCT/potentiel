import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import {
  ItemDate,
  ItemTitle,
  ContentArea,
  CurrentIcon,
  CancelledStepIcon,
  UnvalidatedStepIcon,
  PastIcon,
} from '.'
import { DemandeDélaiDTO } from '@modules/frise/dtos'

type DemandeDélaiItemProps = DemandeDélaiDTO

export const DemandeDélaiItem = (props: DemandeDélaiItemProps) => {
  const { date, demandeUrl, dateAchèvementDemandée, statut } = props

  const titre =
    statut === 'envoyée'
      ? 'Délai supplémentaire demandé'
      : statut === 'annulée'
      ? 'Demande délai supplémentaire annulée'
      : statut === 'rejetée'
      ? 'Demande délai supplémentaire rejetée'
      : 'Demande délai supplémentaire accordée'
  return (
    <>
      {statut === 'envoyée' && <CurrentIcon />}
      {statut === 'annulée' && <CancelledStepIcon />}
      {statut === 'rejetée' && <UnvalidatedStepIcon />}
      {statut === 'accordée' && <PastIcon />}

      <ContentArea>
        <ItemDate date={date} />
        <>
          <ItemTitle title={titre} />
          <p className="p-0 m-0">
            Date limite d'achèvement demandée : {formatDate(dateAchèvementDemandée)}
            {statut === 'accordée' && (
              <>Date limite d'achèvement accordée : {formatDate(props.dateAchèvementAccordée)}</>
            )}
            <br />
            <a href={demandeUrl}>Voir la demande</a>
          </p>
        </>
      </ContentArea>
    </>
  )
}
