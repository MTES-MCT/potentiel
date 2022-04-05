import React from 'react'
import { ItemDate, ItemTitle, ContentArea, PastIcon, UnvalidatedStepIcon } from '.'
import { LegacyModificationsItemProps, makeDocumentUrl } from '../helpers'
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

const LegacyModificationContainer = (
  props: LegacyModificationsItemProps & { children: React.ReactNode }
) => {
  const { status, date, courrier, children } = props
  return (
    <>
      <StepIcon status={status} />
      <ContentArea>
        <ItemDate date={date} />
        {children}
        {courrier && (
          <div>
            <a href={makeDocumentUrl(courrier.id, courrier.name)} download>
              Télécharger le courrier
            </a>
          </div>
        )}
      </ContentArea>
    </>
  )
}

type AbandonProps = LegacyModificationsItemProps & { modificationType: 'abandon' }

const Abandon = (props: AbandonProps) => {
  const { status } = props
  const titleStatus =
    status === 'acceptée' ? 'accepté' : status === 'accord-de-principe' ? 'à accorder' : 'rejeté'
  return (
    <LegacyModificationContainer {...props}>
      <ItemTitle title={`Abandon ${titleStatus}`} />
    </LegacyModificationContainer>
  )
}

type RecoursProps = LegacyModificationsItemProps & { modificationType: 'recours' }

const Recours = (props: RecoursProps) => {
  const { status, motifElimination } = props
  const titleStatus =
    status === 'acceptée' ? 'accepté' : status === 'accord-de-principe' ? 'à accorder' : 'rejeté'
  return (
    <LegacyModificationContainer {...props}>
      <ItemTitle title={`Recours ${titleStatus}`} />
      {motifElimination !== '' && <p>Motif de l'élimination : {motifElimination}</p>}
    </LegacyModificationContainer>
  )
}

type DelaiProps = LegacyModificationsItemProps & { modificationType: 'delai' }

const Delai = (props: DelaiProps) => {
  const { status } = props
  const titleStatus =
    status === 'acceptée' ? 'accepté' : status === 'accord-de-principe' ? 'à accorder' : 'rejeté'
  return (
    <LegacyModificationContainer {...props}>
      <ItemTitle title={`Délai supplémentaire ${titleStatus}`} />
      {status === 'acceptée' && (
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
    </LegacyModificationContainer>
  )
}

type ProducteurProps = LegacyModificationsItemProps & { modificationType: 'producteur' }

const Producteur = (props: ProducteurProps) => {
  const { producteurPrecedent, status } = props
  const titleStatus =
    status === 'acceptée' ? 'accepté' : status === 'accord-de-principe' ? 'à accorder' : 'rejeté'
  return (
    <LegacyModificationContainer {...props}>
      <ItemTitle title={`Changement de producteur ${titleStatus}`} />
      <p className="p-0 m-0">Producteur précédent : {producteurPrecedent}</p>
    </LegacyModificationContainer>
  )
}

type ActionnaireProps = LegacyModificationsItemProps & { modificationType: 'actionnaire' }

const Actionnaire = (props: ActionnaireProps) => {
  const { actionnairePrecedent, status } = props
  const titleStatus = status === 'accord-de-principe' ? 'à accorder' : status
  return (
    <LegacyModificationContainer {...props}>
      <ItemTitle title={`Modification de l'actionnariat ${titleStatus}`} />
      {actionnairePrecedent !== '' && (
        <p className="p-0 m-0">Actionnaire précédent : {actionnairePrecedent}</p>
      )}
    </LegacyModificationContainer>
  )
}

type AutreProps = LegacyModificationsItemProps & { modificationType: 'autre' }

const Autre = (props: AutreProps) => {
  const { column, value, status } = props
  const titleStatus = status === 'accord-de-principe' ? 'à accorder' : status
  return (
    <LegacyModificationContainer {...props}>
      <ItemTitle title={`Modification du projet ${titleStatus}`} />
      <p className="p-0 m-0">
        {column} : {value}
      </p>
    </LegacyModificationContainer>
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
