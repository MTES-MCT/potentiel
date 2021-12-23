import React from 'react'
import ROUTES from '../../../../../routes'

export const GFDocumentLinkItem = (props: {
  submittedBy: string
  fileId: string
  filename: string
}) => {
  const { submittedBy, fileId, filename } = props
  const GFDocumentLink = makeGFDocumentLink(fileId, filename)
  return (
    <a href={GFDocumentLink}>
      Télécharger l'attestation de garanties financières (déposée par {submittedBy})
    </a>
  )
}

const makeGFDocumentLink = (fileId: string, filename: string): string => {
  return ROUTES.DOWNLOAD_PROJECT_FILE(fileId, filename)
}
