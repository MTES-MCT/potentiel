import React from 'react'
import { ItemDate, ItemTitle, ContentArea, PastIcon, UnvalidatedStepIcon } from '.'
import { LegacyModificationsItemProps } from '../helpers'
import { formatDate } from '../../../../helpers/formatDate'
import { CurrentIcon } from './CurrentIcon'

export const LegacyModificationsItem = (props: LegacyModificationsItemProps) => {
  const { modificationType } = props
  switch (modificationType) {
    case 'abandon':
      return <Abandon {...{ ...props, modificationType }} />
    case 'recours':
      return <Recours {...{ ...props, modificationType }} />
    case 'delai':
      return <Delai {...{ ...props, modificationType }} />
    case 'producteur':
      return <Producteur {...{ ...props, modificationType }} />
    case 'actionnaire':
      return <Actionnaire {...{ ...props, modificationType }} />
    case 'autre':
      return <Autre {...{ ...props, modificationType }} />
  }
}

type AbandonProps = LegacyModificationsItemProps & { modificationType: 'abandon' }

const Abandon = (props: AbandonProps) => {
  const { status, date } = props
  const titleStatus =
    status === 'acceptée' ? 'accepté' : status === 'accord-de-principe' ? 'à accorder' : 'rejeté'
  return (
    <>
      <StepIcon status={status} />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title={`Abandon ${titleStatus}`} />
      </ContentArea>
    </>
  )
}

type RecoursProps = LegacyModificationsItemProps & { modificationType: 'recours' }

const Recours = (props: RecoursProps) => {
  const { status, date } = props
  const titleStatus =
    status === 'acceptée' ? 'accepté' : status === 'accord-de-principe' ? 'à accorder' : 'rejeté'
  return (
    <>
      <StepIcon status={status} />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title={`Recours ${titleStatus}`} />
      </ContentArea>
    </>
  )
}

type DelaiProps = LegacyModificationsItemProps & { modificationType: 'delai' }

const Delai = (props: DelaiProps) => {
  const { date, status } = props
  const notRejected = status === 'acceptée' || status === 'accord-de-principe'
  const titleStatus =
    status === 'acceptée' ? 'accepté' : status === 'accord-de-principe' ? 'à accorder' : 'rejeté'
  return (
    <>
      <StepIcon status={status} />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title={`Délai supplémentaire ${titleStatus}`} />
        {notRejected && (
          <>
            <p className="p-0 m-0">
              Ancienne date limite d'attestation de conformité :{' '}
              {formatDate(props.ancienneDateLimiteAchevement)}
            </p>
            <p className="p-0 m-0">
              Nouvelle date limite d'attestation de conformité :{' '}
              {formatDate(props.nouvelleDateLimiteAchevement)}
            </p>
          </>
        )}
      </ContentArea>
    </>
  )
}

type ProducteurProps = LegacyModificationsItemProps & { modificationType: 'producteur' }

const Producteur = (props: ProducteurProps) => {
  const { date, producteurPrecedent, status } = props
  const titleStatus =
    status === 'acceptée' ? 'accepté' : status === 'accord-de-principe' ? 'à accorder' : 'rejeté'
  return (
    <>
      <StepIcon status={status} />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title={`Changement de producteur ${titleStatus}`} />
        <p className="p-0 m-0">Producteur précédent : {producteurPrecedent}</p>
      </ContentArea>
    </>
  )
}

type ActionnaireProps = LegacyModificationsItemProps & { modificationType: 'actionnaire' }

const Actionnaire = (props: ActionnaireProps) => {
  const { date, actionnairePrecedent, status } = props
  const titleStatus = status === 'accord-de-principe' ? 'à accorder' : status
  return (
    <>
      <StepIcon status={status} />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title={`Modification de l'actionnariat ${titleStatus}`} />
        <p className="p-0 m-0">Actionnaire précédent : {actionnairePrecedent}</p>
      </ContentArea>
    </>
  )
}

type AutreProps = LegacyModificationsItemProps & { modificationType: 'autre' }

const Autre = (props: AutreProps) => {
  const { date, column, value, status } = props
  const titleStatus = status === 'accord-de-principe' ? 'à accorder' : status
  return (
    <>
      <StepIcon status={status} />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title={`Modification du projet ${titleStatus}`} />
        <p className="p-0 m-0">
          {column} : {value}
        </p>
      </ContentArea>
    </>
  )
}

const StepIcon = (props: { status: LegacyModificationsItemProps['status'] }) => {
  const { status } = props
  console.log(status)
  return (
    <>
      {status === 'acceptée' && <PastIcon />}
      {status === 'accord-de-principe' && <CurrentIcon />}
      {status === 'rejetée' && <UnvalidatedStepIcon />}
    </>
  )
}
