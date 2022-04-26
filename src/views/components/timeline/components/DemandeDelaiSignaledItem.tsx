import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { ItemDate, ItemTitle, ContentArea, PastIcon, UnvalidatedStepIcon, CurrentIcon } from '.'
import { makeDocumentUrl } from '../helpers'

type DemandeDelaiSignaledItemProps = {
  date: number
  attachment?: { id: string; name: string }
  notes?: string
} & (
  | {
      status: 'acceptée'
      newCompletionDueOn: number
    }
  | {
      status: 'rejetée'
    }
  | {
      status: 'accord-de-principe'
    }
)

export const DemandeDelaiSignaledItem = (props: DemandeDelaiSignaledItemProps) => {
  switch (props.status) {
    case 'acceptée':
      return <Accepted {...props} />

    case 'rejetée':
      return <Rejected {...props} />

    case 'accord-de-principe':
      return <AccordPrincipe {...props} />
  }
}

type RejectedProps = Extract<DemandeDelaiSignaledItemProps, { status: 'rejetée' }>

const Rejected = ({ date, attachment, notes }: RejectedProps) => (
  <>
    <UnvalidatedStepIcon />
    <ContentArea>
      <ItemDate date={date} />
      <>
        <ItemTitle title="Délai supplémentaire rejeté" />
        {notes && <p className="p-0 m-0 italic">Note : {notes}</p>}
      </>
      {attachment && (
        <a href={makeDocumentUrl(attachment.id, attachment.name)}>Voir le courrier de réponse</a>
      )}
    </ContentArea>
  </>
)

type AccordPrincipeProps = Extract<DemandeDelaiSignaledItemProps, { status: 'accord-de-principe' }>

const AccordPrincipe = ({ date, attachment, notes }: AccordPrincipeProps) => (
  <>
    <CurrentIcon />
    <ContentArea>
      <ItemDate date={date} />
      <>
        <ItemTitle title="Délai supplémentaire à accorder" />
        {notes && <p className="p-0 m-0 italic">Note : {notes}</p>}
      </>
      {attachment && (
        <a href={makeDocumentUrl(attachment.id, attachment.name)}>Voir le courrier de réponse</a>
      )}
    </ContentArea>
  </>
)

type AcceptedProps = Extract<DemandeDelaiSignaledItemProps, { status: 'acceptée' }>

const Accepted = ({ date, newCompletionDueOn, attachment, notes }: AcceptedProps) => (
  <>
    <PastIcon />
    <ContentArea>
      <ItemDate date={date} />
      <>
        <ItemTitle title="Délai supplémentaire accepté" />
        <p className="p-0 m-0">
          Date d'attestation de conformité demandée : {formatDate(newCompletionDueOn)}
        </p>
        {notes && <p className="p-0 m-0 italic">Note : {notes}</p>}
      </>
      {attachment && (
        <a href={makeDocumentUrl(attachment.id, attachment.name)}>Voir le courrier de réponse</a>
      )}
    </ContentArea>
  </>
)
