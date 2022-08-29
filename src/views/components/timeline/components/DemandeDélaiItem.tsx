import { Link } from '@components'
import { DemandeDélaiDTO } from '@modules/frise/dtos'
import { format } from 'date-fns'
import React from 'react'
import {
  CancelledStepIcon,
  ContentArea,
  CurrentIcon,
  InfoItem,
  ItemDate,
  ItemTitle,
  PastIcon,
  UnvalidatedStepIcon,
} from '.'

type DemandeDélaiItemProps = DemandeDélaiDTO

export const DemandeDélaiItem = (props: DemandeDélaiItemProps) => {
  const { date, demandeUrl, statut, actionRequise } = props

  const titre =
    statut === 'envoyée'
      ? 'Délai supplémentaire demandé'
      : statut === 'en-instruction'
      ? 'Demande de délai supplémentaire en instruction'
      : `Demande de délai supplémentaire ${statut}`

  return (
    <>
      {['envoyée', 'en-instruction'].includes(statut) && <CurrentIcon />}
      {statut === 'annulée' && <CancelledStepIcon />}
      {statut === 'rejetée' && <UnvalidatedStepIcon />}
      {statut === 'accordée' && <PastIcon />}

      <ContentArea>
        <div className="flex">
          <div className="align-center">
            <ItemDate date={date} />
          </div>
          {actionRequise && (
            <div className="align-center mb-1">
              <InfoItem message={actionRequise} />
            </div>
          )}
        </div>
        <>
          <ItemTitle title={titre} />
          <p className="p-0 m-0">
            {statut !== 'accordée' ? <DélaiDemandé {...props} /> : <DélaiAccordé {...props} />}
            <br />
            {demandeUrl && <Link href={demandeUrl}>Voir la demande</Link>}
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
