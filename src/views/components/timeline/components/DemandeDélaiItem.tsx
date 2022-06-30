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

export const DemandeDélaiItem = (props: DemandeDélaiItemProps) => {
  switch (props.statut) {
    case 'envoyée':
      return <DemandeEnvoyée {...props} />
    case 'annulée':
      return <DemandeAnnulée {...props} />
    case 'rejetée':
      return <DemandeRejetée {...props} />
  }
}

type DemandeEnvoyéeProps = DemandeDélaiItemProps & { statut: 'envoyée' }

const DemandeEnvoyée = ({ date, dateAchèvementDemandée }: DemandeEnvoyéeProps) => (
  <>
    <CurrentIcon />
    <ContentArea>
      <ItemDate date={date} />
      <>
        <ItemTitle title="Délai supplémentaire demandé" />
        <p className="p-0 m-0">
          Date limite d'achèvement demandée : {formatDate(dateAchèvementDemandée)}
        </p>
      </>
    </ContentArea>
  </>
)

type DemandeAnnuléeProps = DemandeDélaiItemProps & { statut: 'annulée' }

const DemandeAnnulée = ({ date }: DemandeAnnuléeProps) => (
  <>
    <CancelledStepIcon />
    <ContentArea>
      <ItemDate date={date} />
      <>
        <ItemTitle title="Demande de délai supplémentaire annulée" />
      </>
    </ContentArea>
  </>
)

type DemandeRejetéeProps = DemandeDélaiItemProps & { statut: 'rejetée' }

const DemandeRejetée = ({ date, dateAchèvementDemandée }: DemandeRejetéeProps) => (
  <>
    <UnvalidatedStepIcon />
    <ContentArea>
      <ItemDate date={date} />
      <>
        <ItemTitle title="Demande de délai supplémentaire rejetée" />
        <p className="p-0 m-0">
          Date limite d'achèvement demandée : {formatDate(dateAchèvementDemandée)}
        </p>
      </>
    </ContentArea>
  </>
)
