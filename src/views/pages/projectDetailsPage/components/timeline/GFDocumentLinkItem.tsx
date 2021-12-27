import React from 'react'
import { ProjectGFSubmittedDTO } from '../../../../../modules/frise/dtos/ProjectEventListDTO'
import ROUTES from '../../../../../routes'

export const GFDocumentLinkItem = (props: { event: ProjectGFSubmittedDTO }) => {
  const { submittedBy, fileId, filename } = props.event
  const GFDocumentLink = makeGFDocumentLink(fileId, filename)
  return <a href={GFDocumentLink}>Télécharger l'attestation de garanties financières</a>
}

const makeGFDocumentLink = (fileId: string, filename: string): string => {
  return ROUTES.DOWNLOAD_PROJECT_FILE(fileId, filename)
}
