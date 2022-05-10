import React from 'react'
import { ItemDate, ItemTitle, ContentArea, UnvalidatedStepIcon } from '.'
import { makeDocumentUrl } from '../helpers'

type DemandeRecoursSignaledItemProps = {
  date: number
  attachment?: { id: string; name: string }
  notes?: string
  status: 'rejetée'
}

export const DemandeRecoursSignaledItem = ({
  date,
  attachment,
  notes,
}: DemandeRecoursSignaledItemProps) => (
  <>
    <UnvalidatedStepIcon />
    <ContentArea>
      <ItemDate date={date} />
      <>
        <ItemTitle title="Recours rejeté" />
        {notes && <p className="p-0 m-0 italic">Note : {notes}</p>}
      </>
      {attachment && (
        <a href={makeDocumentUrl(attachment.id, attachment.name)}>Voir le courrier de réponse</a>
      )}
    </ContentArea>
  </>
)
