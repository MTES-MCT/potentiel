import React from 'react';
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest';
import { DownloadLink } from '../../../components';
import ROUTES from '../../../../routes';

interface DownloadResponseTemplateProps {
  modificationRequest: ModificationRequestPageDTO;
}
export const DownloadResponseTemplate = ({
  modificationRequest: { id, project },
}: DownloadResponseTemplateProps) => (
  <div className="mb-4">
    <DownloadLink fileUrl={ROUTES.TELECHARGER_MODELE_REPONSE(project, id)}>
      Télécharger un modèle de réponse (document word/docx)
    </DownloadLink>
  </div>
);
