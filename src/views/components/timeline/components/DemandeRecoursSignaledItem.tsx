import React from 'react'
import { ItemDate, ItemTitle, ContentArea, UnvalidatedStepIcon, PastIcon } from '.'
import { makeDocumentUrl } from '../helpers'

type DemandeRecoursSignaledItemProps = {
  date: number
  attachment?: { id: string; name: string }
  notes?: string
  status: 'acceptée' | 'rejetée'
}

export const DemandeRecoursSignaledItem = ({
  status,
  date,
  attachment,
  notes,
}: DemandeRecoursSignaledItemProps) => (
  <>
    <StatusIcon {...{ status }} />
    <ContentArea>
      <ItemDate date={date} />
      <>
        <ItemTitle title={`Recours ${status === 'acceptée' ? 'accepté' : 'rejeté'}`} />
        {notes && <p className="p-0 m-0 italic">Note : {notes}</p>}
      </>
      {attachment && (
        <a href={makeDocumentUrl(attachment.id, attachment.name)}>Voir le courrier de réponse</a>
      )}
    </ContentArea>
  </>
)

type StatusIconProps = {
  status: DemandeRecoursSignaledItemProps['status']
}
const StatusIcon = ({ status }: StatusIconProps) => {
  switch (status) {
    case 'acceptée':
      return <PastIcon />
    case 'rejetée':
      return <UnvalidatedStepIcon />
  }
}
