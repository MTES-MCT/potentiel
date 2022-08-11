import React from 'react'
import { Project } from '@entities'
import { ModificationRequestPageDTO } from '@modules/modificationRequest'
import { DownloadIcon } from '../../../components'
import ROUTES from '@routes'

interface DownloadResponseTemplateProps {
  modificationRequest: ModificationRequestPageDTO
}
export const DownloadResponseTemplate = ({
  modificationRequest: { id, project },
}: DownloadResponseTemplateProps) => (
  <div className="mb-4">
    <DownloadIcon />
    <a href={ROUTES.TELECHARGER_MODELE_REPONSE(project, id)} download={true}>
      Télécharger un modèle de réponse
    </a>
  </div>
)
