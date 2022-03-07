import React from 'react'
import { ItemDate, ItemTitle, ContentArea, PastIcon, UnvalidatedStepIcon } from '.'
import { LegacyModificationsItemProps } from '../helpers'
import { formatDate } from '../../../../helpers/formatDate'

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
      actionnaire: "de modification de l'actionnariat",
      autre: 'de modification',
    }

  return (
    <>
      <ItemTitle title={`Demande ${libelleTypeDemande[modificationType]} ${status}*`} />
      {modificationType === 'delai' && (
        <>
          <p className="p-0 m-0">
            Ancienne date limite d'achèvement : {formatDate(props.ancienneDateLimiteAchevement)}
          </p>
          <p className="p-0 m-0">
            Nouvelle date limite d'achèvement : {formatDate(props.nouvelleDateLimiteAchevement)}
          </p>
        </>
      )}
      {modificationType === 'producteur' && (
        <p className="p-0 m-0">Producteur précédent : {props.producteurPrecedent}</p>
      )}
      {modificationType === 'actionnaire' && (
        <p className="p-0 m-0">Actionnaire précédent : {props.actionnairePrecedent}</p>
      )}
      {modificationType === 'autre' && (
        <p className="p-0 m-0">
          {props.column} : {props.value}
        </p>
      )}
      <p className="p-0 m-0 italic">
        *Cette démarche a été réalisée avant l'import du projet dans Potentiel
      </p>
    </>
  )
}
