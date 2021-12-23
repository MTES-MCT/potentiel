import React from 'react'

export const GFDocumentLink = (props: { submittedBy: string }) => {
  return <a>Télécharger l'attestation de garanties financières (déposée par {props.submittedBy})</a>
}
