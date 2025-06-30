import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest';
import React, { ComponentProps } from 'react';
import ROUTES from '../../../../routes';
import { DownloadLink, ExternalLink, Heading2, Heading3 } from '../../../components';
import { afficherDate } from '../../../helpers';

type DemandeDetailsProps = ComponentProps<'div'> & {
  modificationRequest: ModificationRequestPageDTO;
};

export const DemandeDetails = ({ modificationRequest, className = '' }: DemandeDetailsProps) => {
  const { requestedBy, requestedOn, justification, attachmentFile, cahierDesCharges } =
    modificationRequest;

  return (
    <div className={`${className}`}>
      <Heading2>Détail de la demande</Heading2>
      <Heading3 className="mb-2">Contexte</Heading3>
      <div>
        Demande déposée par <span className="font-bold">{requestedBy}</span> le{' '}
        <span className="font-bold">{afficherDate(requestedOn)}</span>
      </div>
      {cahierDesCharges && (
        <div>
          Instruction selon le cahier des charges{' '}
          {cahierDesCharges.type === 'initial'
            ? 'initial (en vigueur à la candidature)'
            : `${
                cahierDesCharges.alternatif ? 'alternatif' : ''
              } modifié rétroactivement et publié le ${cahierDesCharges.paruLe}`}{' '}
          (<ExternalLink href={cahierDesCharges.url}>voir le cahier des charges</ExternalLink>)
        </div>
      )}

      {justification && (
        <>
          <Heading3 className="mb-2">Explications du porteur de projet</Heading3>
          <p className="m-0 italic">{`"${justification}"`}</p>
        </>
      )}

      {attachmentFile && (
        <div className="mt-4">
          <DownloadLink
            fileUrl={ROUTES.DOWNLOAD_PROJECT_FILE(attachmentFile.id, attachmentFile.filename)}
          >
            Télécharger la pièce-jointe
          </DownloadLink>
        </div>
      )}
    </div>
  );
};
