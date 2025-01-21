import {
  DownloadLink,
  Form,
  SecondaryButton,
  StatutDemandeModification,
} from '../../../components';
import { ModificationRequestPageDTO } from '../../../../modules/modificationRequest';
import { UserRole } from '../../../../modules/users';
import ROUTES from '../../../../routes';
import React from 'react';
import * as helpers from '../../../helpers';

type DemandeStatusProps = {
  modificationRequest: ModificationRequestPageDTO;
  role: UserRole;
};

function getAdminAnulerRejetDemandeRoute({ type, id }) {
  if (!type) {
    return;
  }

  switch (type) {
    case 'puissance':
      return ROUTES.ADMIN_ANNULER_CHANGEMENT_DE_PUISSANCE_REJETE;
    default:
      return;
  }
}

export const DemandeStatus = ({ modificationRequest, role }: DemandeStatusProps) => {
  const {
    respondedOn,
    respondedBy,
    cancelledOn,
    cancelledBy,
    responseFile,
    status,
    type,
    authority = null,
  } = modificationRequest;
  const afficherBoutonAnnulerRejet =
    (['admin', 'dgec-validateur'].includes(role) ||
      (role === 'dreal' && authority && authority === role)) &&
    ['recours', 'puissance'].includes(type) &&
    status === 'rejetée';

  return (
    <StatutDemandeModification statutDemande={status} className="my-4">
      <span className="font-bold">{helpers.ModificationRequestStatusTitle[status]}</span>{' '}
      {respondedOn && respondedBy && `par ${respondedBy} le ${helpers.afficherDate(respondedOn)}`}
      {afficherBoutonAnnulerRejet && (
        <Form
          method="post"
          action={getAdminAnulerRejetDemandeRoute({ type, id: modificationRequest.id })}
          className="mt-4"
        >
          <SecondaryButton
            type="submit"
            value={modificationRequest.id}
            name={type === 'puissance' ? 'demandeChangementDePuissanceId' : 'modificationRequestId'}
            confirmation='Êtes-vous sûr de vouloir passer le statut de la demande en statut "envoyée" ?'
          >
            Annuler le rejet de la demande
          </SecondaryButton>
        </Form>
      )}
      {cancelledOn && cancelledBy && `par ${cancelledBy} le ${helpers.afficherDate(cancelledOn)}`}
      {responseFile && (
        <div className="mt-4">
          <DownloadLink
            fileUrl={ROUTES.DOWNLOAD_PROJECT_FILE(responseFile.id, responseFile.filename)}
          >
            Télécharger le courrier de réponse
          </DownloadLink>
        </div>
      )}
    </StatutDemandeModification>
  );
};
