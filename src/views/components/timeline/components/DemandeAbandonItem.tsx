import { DemandeAbandonDTO } from '@modules/frise/dtos'
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

type DemandeAbandonItemProps = DemandeAbandonDTO

export const DemandeAbandonItem = (props: DemandeAbandonItemProps) => {
  const { date, demandeUrl, statut, actionRequise } = props

  const titre =
    statut === 'demande confirmée'
      ? `Demande d'abandon confirmée par le porteur`
      : `Demande d'abandon ${statut}`

  return (
    <>
      {['envoyée', 'demande confirmée', 'en attente de confirmation'].includes(statut) && (
        <CurrentIcon />
      )}
      {statut === 'annulée' && <CancelledStepIcon />}
      {statut === 'rejetée' && <UnvalidatedStepIcon />}
      {statut === 'accordée' && <PastIcon />}

      <ContentArea>
        <div className="flex">
          <div className="align-center">
            <ItemDate date={date} />
          </div>
          {actionRequise && (
            <div className="align-center mb-1">
              <InfoItem message={actionRequise} />
            </div>
          )}
        </div>
        <>
          <ItemTitle title={titre} />
          <p className="p-0 m-0">{demandeUrl && <a href={demandeUrl}>Voir la demande</a>}</p>
        </>
      </ContentArea>
    </>
  )
}
