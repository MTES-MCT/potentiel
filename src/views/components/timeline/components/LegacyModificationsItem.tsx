import React from 'react'
import { ItemDate, ItemTitle, ContentArea, PastIcon, UnvalidatedStepIcon } from '.'
import { LegacyModificationsItemProps } from '../helpers'
import { formatDate } from '../../../../helpers/formatDate'

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
  const accepted = status === 'acceptée'
  const title = accepted ? 'Abandon' : 'Abandon rejeté'
  return (
    <>
      {accepted ? <PastIcon /> : <UnvalidatedStepIcon />}
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title={title} />
      </ContentArea>
    </>
  )
}

type RecoursProps = LegacyModificationsItemProps & { modificationType: 'recours' }

const Recours = (props: RecoursProps) => {
  const { status, date } = props
  const accepted = status === 'acceptée'
  const title = accepted ? 'Recours' : 'Recours rejeté'
  return (
    <>
      {accepted ? <PastIcon /> : <UnvalidatedStepIcon />}
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title={title} />
      </ContentArea>
    </>
  )
}

type DelaiProps = LegacyModificationsItemProps & { modificationType: 'delai' }

const Delai = (props: DelaiProps) => {
  const { date, ancienneDateLimiteAchevement, nouvelleDateLimiteAchevement } = props
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title={`Délai supplémentaire`} />
        <p className="p-0 m-0">
          Ancienne date limite d'attestation de conformité :{' '}
          {formatDate(ancienneDateLimiteAchevement)}
        </p>
        <p className="p-0 m-0">
          Nouvelle date limite d'attestation de conformité :{' '}
          {formatDate(nouvelleDateLimiteAchevement)}
        </p>
      </ContentArea>
    </>
  )
}

type ProducteurProps = LegacyModificationsItemProps & { modificationType: 'producteur' }

const Producteur = (props: ProducteurProps) => {
  const { date, producteurPrecedent } = props
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title={`Changement de producteur`} />
        <p className="p-0 m-0">Producteur précédent : {producteurPrecedent}</p>
      </ContentArea>
    </>
  )
}

type ActionnaireProps = LegacyModificationsItemProps & { modificationType: 'actionnaire' }

const Actionnaire = (props: ActionnaireProps) => {
  const { date, actionnairePrecedent } = props
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title={`Changement d'actionnaire`} />
        <p className="p-0 m-0">Actionnaire précédent : {actionnairePrecedent}</p>
      </ContentArea>
    </>
  )
}

type AutreProps = LegacyModificationsItemProps & { modificationType: 'autre' }

const Autre = (props: AutreProps) => {
  const { date, column, value } = props
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title={`Modification du projet`} />
        <p className="p-0 m-0">
          {column} : {value}
        </p>
      </ContentArea>
    </>
  )
}
