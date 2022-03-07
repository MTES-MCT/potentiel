import React from 'react'
import { ItemDate, ItemTitle, ContentArea, PastIcon, UnvalidatedStepIcon } from '.'
import { LegacyModificationsItemProps } from '../helpers'
import { formatDate } from '../../../../helpers/formatDate'

export const LegacyModificationsItem = (props: LegacyModificationsItemProps) => {
  const { status } = props
  switch (status) {
    case 'rejeté':
      return <RecoursRejected {...props} />
    case 'accepté':
      return <Accepted {...props} />
  }
}

const RecoursRejected = (props: LegacyModificationsItemProps) => {
  const { date } = props
  return (
    <>
      <UnvalidatedStepIcon />
      <ContentArea>
        <ItemDate date={date} />
        <ItemTitle title={`Recours rejeté *`} />
        <p className="p-0 m-0 italic">*Démarche réalisée avant l'import du projet dans Potentiel</p>
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
      autre: 'Modification',
    }

  return (
    <>
      <ItemTitle title={`${libelleTypeDemande[modificationType]}*`} />
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
      <p className="p-0 m-0 italic">*Démarche réalisée avant l'import du projet dans Potentiel</p>
    </>
  )
}
