import React from 'react'
import {
  ItemDate,
  ItemTitle,
  ContentArea,
  CurrentIcon,
  PastIcon,
  UnvalidatedStepIcon,
  WarningItem,
} from '.'
import { ModificationRequestItemProps } from '../helpers/extractModificationRequestsItemProps'
import { CancelledStepIcon } from './cancelledStepIcon'

export const ModificationRequestItem = (props: ModificationRequestItemProps) => {
  const { status } = props
  switch (status) {
    case 'envoyée':
    case 'en instruction':
      return <Submitted {...{ ...props, status }} />
    case 'rejetée':
      return <Rejected {...props} />
    case 'acceptée':
      return <Accepted {...props} />
    case 'annulée':
      return <Cancelled {...props} />
  }
}

type SubmittedProps = ModificationRequestItemProps & {
  status: 'envoyée' | 'en instruction'
}

const Submitted = (props: SubmittedProps) => {
  const { date, authority, role, modificationType, status } = props
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
              <WarningItem message={status === 'envoyée' ? 'à traiter' : 'réponse à envoyer'} />
            </div>
          )}
        </div>
        {modificationType === 'delai' && (
          <>
            <ItemTitle title={`Demande de prolongation de délai ${status}`} />
            <p className="p-0 m-0">Délai demandé : {props.delayInMonths} mois</p>
          </>
        )}
        {modificationType === 'abandon' && <ItemTitle title={`Demande d'abandon ${status}`} />}
        {modificationType === 'recours' && <ItemTitle title={`Demande de recours ${status}`} />}
      </ContentArea>
    </>
  )
}

const Rejected = (props: ModificationRequestItemProps) => {
  const { date, url, modificationType } = props
  return (
    <>
      <UnvalidatedStepIcon />
      <ContentArea>
        <ItemDate date={date} />
        {modificationType === 'delai' && (
          <>
            <ItemTitle title={`Demande de prolongation de délai rejetée`} />
            <p className="p-0 m-0">Délai demandé : {props.delayInMonths} mois</p>
          </>
        )}
        {modificationType === 'abandon' && <ItemTitle title={`Demande d'abandon rejetée`} />}
        {modificationType === 'recours' && <ItemTitle title={`Demande de recours rejetée`} />}
        {url && <a href={url}>Voir le courrier de réponse</a>}
      </ContentArea>
    </>
  )
}

const Accepted = (props: ModificationRequestItemProps) => {
  const { date, url, modificationType } = props
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        {modificationType === 'delai' && (
          <>
            <ItemTitle title={`Demande de prolongation de délai acceptée`} />
            <p className="p-0 m-0">Délai demandé : {props.delayInMonths} mois</p>
          </>
        )}
        {modificationType === 'abandon' && <ItemTitle title={`Demande d'abandon acceptée`} />}
        {modificationType === 'recours' && <ItemTitle title={`Demande de recours acceptée`} />}
        {url && <a href={url}>Voir le courrier de réponse</a>}
      </ContentArea>
    </>
  )
}

const Cancelled = (props: ModificationRequestItemProps) => {
  const { date, modificationType } = props
  return (
    <>
      <CancelledStepIcon />
      <ContentArea>
        <ItemDate date={date} />
        {modificationType === 'delai' && (
          <>
            <ItemTitle title={`Demande de prolongation de délai annulée`} />
            <p className="p-0 m-0">Délai demandé : {props.delayInMonths} mois</p>
          </>
        )}
        {modificationType === 'abandon' && <ItemTitle title={`Demande d'abandon annulée`} />}
        {modificationType === 'recours' && <ItemTitle title={`Demande de recours annulée`} />}
        <p className="p-0 m-0">Demande annulée par le porteur de projet</p>
      </ContentArea>
    </>
  )
}
