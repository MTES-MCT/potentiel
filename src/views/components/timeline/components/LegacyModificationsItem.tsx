import React from 'react'
import { ItemDate, ItemTitle, ContentArea, PastIcon, UnvalidatedStepIcon } from '.'
import { LegacyModificationsItemProps } from '../helpers'
import { formatDate } from '../../../../helpers/formatDate'

export const LegacyModificationsItem = (props: LegacyModificationsItemProps) => {
  const { status } = props
  switch (status) {
    case 'rejetée':
      return <Rejected {...props} />
    case 'acceptée':
      return <Accepted {...props} />
  }
}

const Rejected = (props: LegacyModificationsItemProps) => {
  const { date, modificationType } = props
  return (
    <>
      <UnvalidatedStepIcon />
      <ContentArea>
        <ItemDate date={date} />
        {modificationType === 'abandon' && <ItemTitle title={`Abandon rejeté`} />}
        {modificationType === 'recours' && <ItemTitle title={`Recours rejeté`} />}
      </ContentArea>
    </>
  )
}

const Accepted = (props: LegacyModificationsItemProps) => {
  const { date } = props
  return (
    <>
      <PastIcon />
      <ContentArea>
        <ItemDate date={date} />
        <Details {...props} />
      </ContentArea>
    </>
  )
}

const Details = (props: LegacyModificationsItemProps) => {
  const { modificationType } = props

  const libelleTypeDemande: { [key in LegacyModificationsItemProps['modificationType']]: string } =
    {
      abandon: `Abandon`,
      delai: `Delai supplémentaire`,
      recours: `Recours`,
      producteur: 'Changement de producteur',
      actionnaire: "Modification de l'actionnariat",
      autre: 'Modification du projet',
    }

  return (
    <>
      <ItemTitle title={`${libelleTypeDemande[modificationType]}`} />
      {modificationType === 'delai' && (
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
    </>
  )
}
