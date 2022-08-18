import React from 'react'
import { ProjectStatus } from '@modules/frise'
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

type ComponentProps = ModificationRequestItemProps & {
  projectStatus: ProjectStatus
}

export const ModificationRequestItem = (props: ComponentProps) => {
  const { status, projectStatus } = props
  switch (status) {
    case 'envoyée':
    case 'en instruction':
      return <Submitted {...{ ...props, status, projectStatus }} />
    case 'rejetée':
      return <Rejected {...{ ...props, status }} />
    case 'acceptée':
      return <Accepted {...{ ...props, status }} />
    case 'annulée':
      return <Cancelled {...{ ...props, status }} />
    case 'en attente de confirmation':
      return <ConfirmationRequested {...props} />
    case 'demande confirmée':
      return <RequestConfirmed {...props} />
  }
}

type SubmittedProps = ComponentProps & {
  status: 'envoyée' | 'en instruction'
}

const Submitted = (props: SubmittedProps) => {
  const { date, authority, role, status, projectStatus } = props
  const roleRequiresAction =
    (role === 'admin' && authority === 'dgec') ||
    role === authority ||
    (role === 'dgec-validateur' && authority === 'dgec')
  const isAbandoned = projectStatus === 'Abandonné'
  return (
    <>
      <CurrentIcon />
      <ContentArea>
        <div className="flex">
          <div className="align-center">
            <ItemDate date={date} />
          </div>
          {roleRequiresAction && !isAbandoned && (
            <div className="align-center mb-1">
              <InfoItem message={status === 'envoyée' ? 'à traiter' : 'réponse à envoyer'} />
            </div>
          )}
        </div>
        <Details {...props} />
      </ContentArea>
    </>
  )
}

type RejectedProps = ModificationRequestItemProps & {
  status: 'rejetée'
}

const Rejected = (props: RejectedProps) => {
  const { date, responseUrl } = props
  return (
    <>
      <UnvalidatedStepIcon />
      <ContentArea>
        <ItemDate date={date} />
        <Details {...props} />
        {responseUrl && <a href={responseUrl}>Voir le courrier de réponse</a>}
      </ContentArea>
    </>
  )
}

type AcceptedProps = ModificationRequestItemProps & {
  status: 'acceptée'
}

const Accepted = (props: AcceptedProps) => {
  const { date, responseUrl } = props
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <Details {...props} />
        {responseUrl && <a href={responseUrl}>Voir le courrier de réponse</a>}
      </ContentArea>
    </>
  )
}

type CancelledProps = ModificationRequestItemProps & {
  status: 'annulée'
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
  const { date, responseUrl, role, detailsUrl } = props
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
        {responseUrl && <a href={responseUrl}>Voir le courrier de réponse</a>}
        <a href={detailsUrl}>Voir la demande</a>
      </ContentArea>
    </>
  )
}

const RequestConfirmed = (props: ModificationRequestItemProps) => {
  const { date, role, detailsUrl } = props
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
        <a href={detailsUrl}>Voir la demande</a>
      </ContentArea>
    </>
  )
}

const Details = (
  props: {
    status: ModificationRequestItemProps['status']
    authority: ModificationRequestItemProps['authority']
    role: ModificationRequestItemProps['role']
    detailsUrl: string
  } & (
    | { modificationType: 'delai'; delayInMonths: number }
    | { modificationType: 'puissance'; puissance: number; unitePuissance: string }
    | { modificationType: 'abandon' | 'recours' }
  )
) => {
  const { status, modificationType, detailsUrl, authority = undefined, role } = props

  const libelleTypeDemande: { [key in ModificationRequestItemProps['modificationType']]: string } =
    {
      abandon: `Abandon`,
      delai: `Délai supplémentaire`,
      recours: `Recours`,
      puissance: `Changement de puissance installée`,
    }

  const libelleStatus: { [key in ModificationRequestItemProps['status']]: string } = {
    envoyée: `demandé`,
    acceptée: `accepté`,
    rejetée: `rejeté`,
    annulée: `annulé`,
    'demande confirmée': `confirmé`,
    'en attente de confirmation': `en attente de confirmation`,
    'en instruction': `en instruction`,
  }

  function showDemandeButton() {
    if (!authority || role !== 'dreal') {
      return true
    }

    return role === authority
  }

  return (
    <>
      <ItemTitle title={`${libelleTypeDemande[modificationType]} ${libelleStatus[status]}`} />
      {modificationType === 'delai' && (
        <p className="p-0 m-0">
          {status === 'acceptée' ? 'Délai accordé' : 'Délai demandé'} : {props.delayInMonths} mois
        </p>
      )}
      {modificationType === 'puissance' && (
        <p className="p-0 m-0">
          Puissance demandée : {props.puissance} {props.unitePuissance}
        </p>
      )}
      {showDemandeButton() && <a href={detailsUrl}>Voir la demande</a>}
    </>
  )
}
