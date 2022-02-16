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

type SubmittedProps = 
  ModificationRequestItemProps & {
    status: 'envoyée' | 'en instruction'
  }


const Submitted = (props: SubmittedProps) => {
  const { date, authority, role, modificationType, status } = props
  return (
    <>
      <CurrentIcon />
      <ContentArea>
        <div className="flex">
          <div className="align-center">
            <ItemDate date={date} />
          </div>
          {role === authority && (
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
        <p className="p-0 m-0">
          Autorité concernée : <span className="uppercase">{authority}</span>
        </p>
      </ContentArea>
    </>
  )
}

const Rejected = (props: ModificationRequestItemProps) => {
  const { date, url, authority, modificationType } = props
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
        <p className="p-0 m-0">
          Autorité concernée : <span className="uppercase">{authority}</span>
        </p>
        {url && <a href={url}>Voir le courrier de réponse</a>}
      </ContentArea>
    </>
  )
}

const Accepted = (props: ModificationRequestItemProps) => {
  const { date, authority, url, modificationType } = props
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
        <p className="p-0 m-0">
          Autorité concernée : <span className="uppercase">{authority}</span>
        </p>
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
        <p className="p-0 m-0">Demande annulée par le porteur de projet</p>
      </ContentArea>
    </>
  )
}
