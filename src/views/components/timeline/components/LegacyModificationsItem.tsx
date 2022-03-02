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
import { LegacyModificationsItemProps } from '../helpers'
import { CancelledStepIcon } from './cancelledStepIcon'

export const LegacyModificationsItem = (props: LegacyModificationsItemProps) => {
  const { status } = props
  switch (status) {
    case 'rejetée':
      return <Rejected {...{ ...props, status }} />
    case 'acceptée':
      return <Accepted {...{ ...props, status }} />
  }
}

type RejectedProps = LegacyModificationsItemProps & {
  status: 'rejetée'
}

const Rejected = (props: RejectedProps) => {
  const { date, status } = props
  return (
    <>
      <UnvalidatedStepIcon />
      <ContentArea>
        <ItemDate date={date} />
        <Title {...{ ...props, status }} />
      </ContentArea>
    </>
  )
}

type AcceptedProps = LegacyModificationsItemProps & {
  status: 'acceptée'
}

const Accepted = (props: AcceptedProps) => {
  const { date } = props
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <Title {...props} />
      </ContentArea>
    </>
  )
}

const Title = (props: LegacyModificationsItemProps) => {
  const { status, modificationType } = props

  const libelleTypeDemande: { [key in LegacyModificationsItemProps['modificationType']]: string } =
    {
      abandon: `d'abandon`,
      delai: `de prolongation de délai`,
      recours: `de recours`,
      producteur: 'de changement de producteur',
      actionnaire: "de changement d'actionnaire",
    }

  return (
    <>
      <ItemTitle title={`Demande ${libelleTypeDemande[modificationType]} ${status}`} />
      <p className="p-0 m-0">
        Cette démarche a été réalisée avant l'import du projet dans Potentiel
      </p>
      {modificationType === 'delai' && (
        <p className="p-0 m-0">Délai demandé : {props.delayInMonths} mois</p>
      )}
      {modificationType === 'producteur' && (
        <p className="p-0 m-0">Producteur précédent : {props.producteurPrecedent}</p>
      )}
      {modificationType === 'actionnaire' && (
        <p className="p-0 m-0">Actionnaire précédent : {props.actionnairePrecedent}</p>
      )}
    </>
  )
}
