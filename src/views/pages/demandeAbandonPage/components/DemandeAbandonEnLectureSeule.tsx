import React from 'react';
import { DemandeAbandonPageDTO } from '../../../../modules/modificationRequest';
import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import routes from '../../../../routes';
import {
  LegacyPageTemplate,
  Heading1,
  ErrorBox,
  SuccessBox,
  Heading2,
  ProjectInfo,
  StatutDemandeModification,
  DownloadLink,
} from '../../../components';
import { ModificationRequestStatusTitle, afficherDate } from '../../../helpers';
import { DemandeDetails } from '../../modificationRequestPage/components';

export const DemandeAbandonEnLectureSeule = ({
  demandeAbandon,
  utilisateur,
  success,
  error,
}: {
  demandeAbandon: DemandeAbandonPageDTO;
  utilisateur: UtilisateurReadModel;
  error?: string;
  success?: string;
}) => (
  <LegacyPageTemplate user={utilisateur} currentPage="list-requests">
    <Heading1>Je demande un abandon de mon projet</Heading1>
    {error && <ErrorBox title={error} />}
    {success && <SuccessBox title={success} />}

    <div className="flex flex-col gap-4">
      <div>
        <Heading2>Concernant le projet</Heading2>
        <ProjectInfo project={demandeAbandon.project} className="mb-3" />
      </div>

      {utilisateur.role !== 'dreal' && <DemandeDetails modificationRequest={demandeAbandon} />}
      <StatutDemandeModification statutDemande={demandeAbandon.status} className="my-4">
        <span className="font-bold">{ModificationRequestStatusTitle[demandeAbandon.status]}</span>{' '}
        {demandeAbandon.respondedOn &&
          demandeAbandon.respondedBy &&
          `par ${demandeAbandon.respondedBy} le ${afficherDate(demandeAbandon.respondedOn)}`}
        {demandeAbandon.cancelledOn &&
          demandeAbandon.cancelledBy &&
          `par ${demandeAbandon.cancelledBy} le ${afficherDate(demandeAbandon.cancelledOn)}`}
        {demandeAbandon.responseFile && demandeAbandon.status !== 'demande confirmée' && (
          <div className="mt-2">
            <DownloadLink
              fileUrl={routes.DOWNLOAD_PROJECT_FILE(
                demandeAbandon.responseFile.id,
                demandeAbandon.responseFile.filename,
              )}
            >
              Télécharger le courrier de réponse
            </DownloadLink>
          </div>
        )}
      </StatutDemandeModification>
    </div>
  </LegacyPageTemplate>
);
