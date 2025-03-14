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

      <DetailsByType modificationRequest={modificationRequest} />

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

interface DetailsByTypeProps {
  modificationRequest: ModificationRequestPageDTO;
}

const DetailsByType = ({ modificationRequest }: DetailsByTypeProps) => {
  switch (modificationRequest.type) {
    case 'puissance':
      return <PuissanceDetails modificationRequest={modificationRequest} />;
    case 'producteur':
      return <ProducteurDetails modificationRequest={modificationRequest} />;
    case 'fournisseur':
      return <FournisseurDetails modificationRequest={modificationRequest} />;
    default:
      return null;
  }
};

interface PuissanceDetailsProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'puissance' };
}
const PuissanceDetails = ({ modificationRequest }: PuissanceDetailsProps) => {
  const { project, status, puissanceAuMomentDuDepot } = modificationRequest;
  const { puissance, puissanceInitiale, unitePuissance } = project;

  const hasPuissanceChangedSinceDepot =
    puissance !== (puissanceAuMomentDuDepot || puissanceInitiale);

  return (
    <div>
      <Heading3 className="mb-2">Nouvelle puissance</Heading3>
      <div>
        Puissance à la notification :{' '}
        <span className="font-bold">
          {puissanceInitiale} {unitePuissance}
        </span>
      </div>

      {puissanceAuMomentDuDepot && puissanceInitiale !== puissanceAuMomentDuDepot && (
        <div>
          Puissance au moment du dépôt :{' '}
          <span className="font-bold">
            {puissanceAuMomentDuDepot} {unitePuissance}
          </span>
        </div>
      )}

      {(status === 'en instruction' || status === 'envoyée') && (
        <>
          {hasPuissanceChangedSinceDepot && (
            <div>
              Puissance actuelle :{' '}
              <span className="font-bold">
                {project.puissance} {unitePuissance}
              </span>
            </div>
          )}
        </>
      )}

      <div>
        Nouvelle puissance demandée :{' '}
        <span className="font-bold">
          {modificationRequest.puissance} {unitePuissance}
        </span>
      </div>
    </div>
  );
};

interface ProducteurDetailsProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'producteur' };
}
const ProducteurDetails = ({ modificationRequest }: ProducteurDetailsProps) => {
  return (
    <div>
      <Heading3 className="mb-2">Nouveau producteur actionnaire</Heading3>
      <div>
        Nouveau producteur : <span className="font-bold">{modificationRequest.producteur}</span>
      </div>
    </div>
  );
};

interface FournisseurDetailsProps {
  modificationRequest: ModificationRequestPageDTO & { type: 'fournisseur' };
}
const FournisseurDetails = ({ modificationRequest }: FournisseurDetailsProps) => {
  return (
    <div>
      {modificationRequest.fournisseurs?.length > 0 && (
        <>
          <Heading3 className="mb-2">Nouveau(x) fournisseur(s)</Heading3>
          <ul>
            {modificationRequest.fournisseurs?.map((fournisseur, index) => (
              <li key={index}>
                {fournisseur.kind} : {fournisseur.name}
              </li>
            ))}
          </ul>
        </>
      )}
      {modificationRequest.evaluationCarbone && (
        <>
          <Heading3 className="mb-2">Nouvelle évaluation carbone</Heading3>
          <div>
            Nouvelle évaluation carbone :{' '}
            <span className="font-bold">{modificationRequest.evaluationCarbone} kg eq CO2/kWc</span>
          </div>
        </>
      )}
    </div>
  );
};
