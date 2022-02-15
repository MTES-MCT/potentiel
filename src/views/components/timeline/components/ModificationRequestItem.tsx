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
      return <Submitted {...props} />
    case 'rejetée':
      return <Rejected {...props} />
    case 'acceptée':
      return <Accepted {...props} />
    case 'annulée':
      return <Cancelled {...props} />
  }
}

type SubmittedProps = {
  status: ModificationRequestItemProps['status']
  date: number
  delayInMonths?: number
  authority: 'dgec' | 'dreal'
  role: ModificationRequestItemProps['role']
}
const Submitted = ({ status, date, delayInMonths, authority, role }: SubmittedProps) => {
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
        {delayInMonths && (
          <>
            <ItemTitle title={`Demande de prolongation de délai ${status}`} />
            <p className="p-0 m-0">Délai demandé : {delayInMonths} mois</p>
          </>
        )}
        <p className="p-0 m-0">
          Autorité concernée : <span className="uppercase">{authority}</span>
        </p>
      </ContentArea>
    </>
  )
}

type RejectedProps = {
  date: number
  delayInMonths?: number
  authority: 'dgec' | 'dreal'
  url?: ModificationRequestItemProps['url']
}
const Rejected = ({ date, delayInMonths, url, authority }: RejectedProps) => {
  return (
    <>
      <UnvalidatedStepIcon />
      <ContentArea>
        <ItemDate date={date} />
        {delayInMonths && (
          <>
            <ItemTitle title={`Demande de prolongation de délai rejetée`} />
            <p className="p-0 m-0">Délai demandé : {delayInMonths} mois</p>
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

type AcceptedProps = {
  date: number
  delayInMonths?: number
  authority: 'dgec' | 'dreal'
  url?: ModificationRequestItemProps['url']
}
const Accepted = ({ date, delayInMonths, authority, url }: AcceptedProps) => {
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        {delayInMonths && (
          <>
            <ItemTitle title={`Demande de prolongation de délai acceptée`} />
            <p className="p-0 m-0">Délai demandé : {delayInMonths} mois</p>
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

type CancelledProps = {
  date: number
  delayInMonths?: number
}
const Cancelled = ({ date, delayInMonths }: CancelledProps) => {
  return (
    <>
      <CancelledStepIcon />
      <ContentArea>
        <ItemDate date={date} />
        {delayInMonths && (
          <>
            <ItemTitle title={`Demande de prolongation de délai annulée`} />
            <p className="p-0 m-0">Délai demandé : {delayInMonths} mois</p>
          </>
        )}
        <p className="p-0 m-0">Demande annulée par le porteur de projet</p>
      </ContentArea>
    </>
  )
}
