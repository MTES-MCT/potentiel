import React from 'react'
import { formatDate } from '../../../../helpers/formatDate'
import { ItemDate, ItemTitle, ContentArea, PastIcon, UnvalidatedStepIcon } from '.'
import { makeDocumentUrl } from '../helpers'

type DemandeDelaiSignaledItemProps = {
  isAccepted: boolean
  date: number
  newCompletionDueOn: number
  attachment?: { id: string; name: string }
  notes?: string
}

export const DemandeDelaiSignaledItem = (props: DemandeDelaiSignaledItemProps) => {
  return props.isAccepted ? <Accepted {...props} /> : <Rejected {...props} />
}

type RejectedProps = DemandeDelaiSignaledItemProps

const Rejected = ({ date, newCompletionDueOn, attachment, notes }: RejectedProps) => (
  <>
    <UnvalidatedStepIcon />
    <ContentArea>
      <ItemDate date={date} />
      <>
        <ItemTitle title="Délai supplémentaire rejeté" />
        <p className="p-0 m-0">
          Date d'attestation de conformité demandée {formatDate(newCompletionDueOn)}
        </p>
        {notes && <p className="p-0 m-0 italic">Note : {notes}</p>}
      </>
      {attachment && (
        <a href={makeDocumentUrl(attachment.id, attachment.name)}>Voir le courrier de réponse</a>
      )}
    </ContentArea>
  </>
)

type AcceptedProps = DemandeDelaiSignaledItemProps

const Accepted = ({ date, newCompletionDueOn, attachment, notes }: AcceptedProps) => (
  <>
    <PastIcon />
    <ContentArea>
      <ItemDate date={date} />
      <>
        <ItemTitle title="Délai supplémentaire accepté" />
        <p className="p-0 m-0">
          Date d'attestation de conformité demandée {formatDate(newCompletionDueOn)}
        </p>
        {notes && <p className="p-0 m-0 italic">Note : {notes}</p>}
      </>
      {attachment && (
        <a href={makeDocumentUrl(attachment.id, attachment.name)}>Voir le courrier de réponse</a>
      )}
    </ContentArea>
  </>
)
