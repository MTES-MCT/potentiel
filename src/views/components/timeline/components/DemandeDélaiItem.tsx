import { DemandeDélaiDTO } from '@modules/frise/dtos'
import { format } from 'date-fns'
import React from 'react'
import {
  CancelledStepIcon,
  ContentArea,
  CurrentIcon,
  ItemDate,
  ItemTitle,
  PastIcon,
  UnvalidatedStepIcon,
} from '.'

type DemandeDélaiItemProps = DemandeDélaiDTO

export const DemandeDélaiItem = (props: DemandeDélaiItemProps) => {
  const { date, demandeUrl, statut } = props

  const titre =
    statut === 'envoyée' ? 'Délai supplémentaire demandé' : `Demande délai supplémentaire ${statut}`

  return (
    <>
      {['envoyée', 'en-instruction'].includes(statut) && <CurrentIcon />}
      {statut === 'annulée' && <CancelledStepIcon />}
      {statut === 'rejetée' && <UnvalidatedStepIcon />}
      {statut === 'accordée' && <PastIcon />}

      <ContentArea>
        <ItemDate date={date} />
        <>
          <ItemTitle title={titre} />
          <p className="p-0 m-0">
            {statut !== 'accordée' ? <DélaiDemandé {...props} /> : <DélaiAccordé {...props} />}
            <br />
            {demandeUrl && <a href={demandeUrl}>Voir la demande</a>}
          </p>
        </>
      </ContentArea>
    </>
  )
}

const DélaiDemandé = (
  props: DemandeDélaiItemProps & Exclude<DemandeDélaiItemProps, { statut: 'accordée' }>
) =>
  props.dateAchèvementDemandée ? (
    <>
      Date limite d'achèvement demandée :{' '}
      {format(new Date(props.dateAchèvementDemandée), 'dd/MM/yyyy')}
    </>
  ) : (
    <>Délai demandé : {props.délaiEnMoisDemandé} mois</>
  )

const DélaiAccordé = (props: DemandeDélaiItemProps & { statut: 'accordée' }) =>
  props.délaiEnMoisAccordé ? (
    <>Délai accordé : {props.délaiEnMoisAccordé} mois</>
  ) : props.ancienneDateThéoriqueAchèvement ? (
    <>
      Ancienne date limite d'achèvement :{' '}
      {format(new Date(props.ancienneDateThéoriqueAchèvement), 'dd/MM/yyyy')}
      <br />
      Nouvelle date limite d'achèvement :{' '}
      {format(new Date(props.dateAchèvementAccordée), 'dd/MM/yyyy')}
    </>
  ) : null
