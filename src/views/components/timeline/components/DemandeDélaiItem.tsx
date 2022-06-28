import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { ItemDate, ItemTitle, ContentArea, CurrentIcon, CancelledStepIcon } from '.'
import { DemandeDélaiDTO } from 'src/modules/frise/dtos'

type DemandeDélaiItemProps = DemandeDélaiDTO

export const DemandeDélaiItem = (props: DemandeDélaiItemProps) => {
  switch (props.statut) {
    case 'envoyée':
      return <DemandeEnvoyée {...props} />
    case 'annulée':
      return <DemandeAnnulée {...props} />
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
          Date limite d'attestation d'achèvement souhaitée : {formatDate(dateAchèvementDemandée)}
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
