import React from 'react'
import {
  ItemDate,
  ItemTitle,
  ContentArea,
  CurrentIcon,
  PastIcon,
  UnvalidatedStepIcon,
  InfoItem,
} from '.'
import { ModificationRequestItemProps } from '../helpers/extractModificationRequestsItemProps'
import { CancelledStepIcon } from './cancelledStepIcon'

export const ModificationRequestItem = (props: ModificationRequestItemProps) => {
  const { status } = props
  switch (status) {
    case 'envoyé':
    case 'en instruction':
      return <Submitted {...{ ...props, status }} />
    case 'rejeté':
      return <Rejected {...{ ...props, status }} />
    case 'accepté':
      return <Accepted {...{ ...props, status }} />
    case 'annulé':
      return <Cancelled {...{ ...props, status }} />
    case 'en attente de confirmation':
      return <ConfirmationRequested {...props} />
    case 'confirmé':
      return <RequestConfirmed {...props} />
  }
}

type SubmittedProps = ModificationRequestItemProps & {
  status: 'envoyé' | 'en instruction'
}

const Submitted = (props: SubmittedProps) => {
  const { date, authority, role, status } = props
  const displayWarning = (role === 'admin' && authority === 'dgec') || role === authority
  return (
    <>
      <CurrentIcon />
      <ContentArea>
        <div className="flex">
          <div className="align-center">
            <ItemDate date={date} />
          </div>
          {displayWarning && (
            <div className="align-center mb-1">
              <InfoItem message={status === 'envoyé' ? 'à traiter' : 'réponse à envoyer'} />
            </div>
          )}
        </div>
        <Details {...props} />
      </ContentArea>
    </>
  )
}

type RejectedProps = ModificationRequestItemProps & {
  status: 'rejeté'
}

const Rejected = (props: RejectedProps) => {
  const { date, url } = props
  return (
    <>
      <UnvalidatedStepIcon />
      <ContentArea>
        <ItemDate date={date} />
        <Details {...props} />
        {url && <a href={url}>Voir le courrier de réponse</a>}
      </ContentArea>
    </>
  )
}

type AcceptedProps = ModificationRequestItemProps & {
  status: 'accepté'
}

const Accepted = (props: AcceptedProps) => {
  const { date, url } = props
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <Details {...props} />
        {url && <a href={url}>Voir le courrier de réponse</a>}
      </ContentArea>
    </>
  )
}

type CancelledProps = ModificationRequestItemProps & {
  status: 'annulé'
}

const Cancelled = (props: CancelledProps) => {
  const { date } = props
  return (
    <>
      <CancelledStepIcon />
      <ContentArea>
        <ItemDate date={date} />
        <Details {...props} />
        <p className="p-0 m-0">Demande annulée par le porteur de projet</p>
      </ContentArea>
    </>
  )
}

const ConfirmationRequested = (props: ModificationRequestItemProps) => {
  const { date, url, role } = props
  return (
    <>
      <CurrentIcon />
      <ContentArea>
        <div className="flex">
          <div className="align-center">
            <ItemDate date={date} />
          </div>
          {role === 'porteur-projet' && (
            <div className="align-center mb-1">
              <InfoItem message="Abandon à confirmer" />
            </div>
          )}
        </div>
        <ItemTitle title={`Abandon en attente de confirmation`} />
        {url && <a href={url}>Voir le courrier de réponse</a>}
      </ContentArea>
    </>
  )
}

const RequestConfirmed = (props: ModificationRequestItemProps) => {
  const { date, role } = props
  return (
    <>
      <CurrentIcon />
      <ContentArea>
        <div className="flex">
          <div className="align-center">
            <ItemDate date={date} />
          </div>
          {['admin', 'dreal'].includes(role) && (
            <div className="align-center mb-1">
              <InfoItem message="à traiter" />
            </div>
          )}
        </div>
        <ItemTitle title={`Abandon confirmé par le porteur`} />
      </ContentArea>
    </>
  )
}

const Details = (
  props: { status: ModificationRequestItemProps['status'] } & (
    | { modificationType: 'delai'; delayInMonths: number }
    | { modificationType: 'puissance'; puissance: number; unitePuissance: string }
    | { modificationType: 'abandon' | 'recours' }
  )
) => {
  const { status, modificationType } = props

  const libelleTypeDemande: { [key in ModificationRequestItemProps['modificationType']]: string } =
    {
      abandon: `Abandon`,
      delai: `Délai supplémentaire`,
      recours: `Recours`,
      puissance: `Changement de puissance installée`,
    }

  return (
    <>
      <ItemTitle title={`${libelleTypeDemande[modificationType]} ${status}`} />
      {modificationType === 'delai' && (
        <p className="p-0 m-0">Délai demandé : {props.delayInMonths} mois</p>
      )}
      {modificationType === 'puissance' && (
        <p className="p-0 m-0">
          Puissance demandée : {props.puissance} {props.unitePuissance}
        </p>
      )}
    </>
  )
}
