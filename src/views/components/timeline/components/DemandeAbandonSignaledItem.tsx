import React from 'react'
import { ItemDate, ItemTitle, ContentArea, PastIcon, UnvalidatedStepIcon, CurrentIcon } from '.'
import { makeDocumentUrl } from '../helpers'

type DemandeAbandonSignaledItemProps = {
  date: number
  status: 'acceptée' | 'rejetée' | 'à accorder'
  attachment?: { id: string; name: string }
  notes?: string
}

export const DemandeAbandonSignaledItem = ({
  status,
  date,
  notes,
  attachment,
}: DemandeAbandonSignaledItemProps) => {
  return (
    <>
      <StatusIcon {...{ status }} />
      <ContentArea>
        <ItemDate date={date} />
        <>
          <ItemTitle title={`Demande d'abandon ${status}`} />
          {notes && <p className="p-0 m-0 italic">Note : {notes}</p>}
        </>
        {attachment && (
          <a href={makeDocumentUrl(attachment.id, attachment.name)}>Voir le courrier de réponse</a>
        )}
      </ContentArea>
    </>
  )
}

type StatusIconProps = {
  status: DemandeAbandonSignaledItemProps['status']
}
const StatusIcon = ({ status }: StatusIconProps) => {
  switch (status) {
    case 'acceptée':
      return <PastIcon />
    case 'rejetée':
      return <UnvalidatedStepIcon />
    case 'à accorder':
      return <CurrentIcon />
  }
}
