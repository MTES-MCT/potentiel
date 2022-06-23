import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { ItemDate, ItemTitle, ContentArea, CurrentIcon } from '.'
import { DemandeDélaiDTO } from 'src/modules/frise/dtos'

type DemandeDélaiItemProps = DemandeDélaiDTO

export const DemandeDélaiItem = (props: DemandeDélaiItemProps) => {
  return <DemandeEnvoyée {...props} />
}

type DemandeEnvoyéeProps = DemandeDélaiItemProps

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
