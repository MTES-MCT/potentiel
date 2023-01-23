import React from 'react'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'
import { DownloadIcon, Link } from '@components'
import ROUTES from '@routes'

interface DownloadResponseTemplateProps {
  modificationRequest: ModificationRequestPageDTO
}
export const DownloadResponseTemplate = ({
  modificationRequest: { id, project },
}: DownloadResponseTemplateProps) => (
  <div className="mb-4">
    <DownloadIcon />
    <Link href={ROUTES.TELECHARGER_MODELE_REPONSE(project, id)} download>
      Télécharger un modèle de réponse
    </Link>
  </div>
)
