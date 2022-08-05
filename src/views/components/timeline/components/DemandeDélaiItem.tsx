import { DemandeDélaiDTO } from '@modules/frise/dtos'
import React from 'react'
import {
  CancelledStepIcon,
  ContentArea,
  CurrentIcon,
  InfoItem,
  ItemDate,
  ItemTitle,
  PastIcon,
  UnvalidatedStepIcon,
} from '.'
import { formatDate } from '../../../../helpers/formatDate'

type DemandeDélaiItemProps = DemandeDélaiDTO

export const DemandeDélaiItem = (props: DemandeDélaiItemProps) => {
  const { date, demandeUrl, dateAchèvementDemandée, statut, actionAttendue } = props

  const titre =
    statut === 'envoyée' ? 'Délai supplémentaire demandé' : `Demande délai supplémentaire ${statut}`
  return (
    <>
      {statut === 'envoyée' && <CurrentIcon />}
      {statut === 'annulée' && <CancelledStepIcon />}
      {statut === 'rejetée' && <UnvalidatedStepIcon />}
      {statut === 'accordée' && <PastIcon />}

      <ContentArea>
        <div className="flex">
          <div className="align-center">
            <ItemDate date={date} />
          </div>
          {actionAttendue && (
            <div className="align-center mb-1">
              <InfoItem message={actionAttendue} />
            </div>
          )}
        </div>
        <>
          <ItemTitle title={titre} />
          <p className="p-0 m-0">
            {statut !== 'accordée' ? (
              <>Date limite d'achèvement demandée : {formatDate(dateAchèvementDemandée)}</>
            ) : (
              <>
                Ancienne date limite d'achèvement :{' '}
                {formatDate(new Date(props.ancienneDateThéoriqueAchèvement))}
                <br />
                Nouvelle date limite d'achèvement :{' '}
                {formatDate(new Date(props.dateAchèvementAccordée))}
              </>
            )}
            <br />
            {demandeUrl && <a href={demandeUrl}>Voir la demande</a>}
          </p>
        </>
      </ContentArea>
    </>
  )
}
