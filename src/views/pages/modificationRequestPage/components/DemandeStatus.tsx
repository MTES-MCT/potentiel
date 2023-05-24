import { DownloadLink, Form, SecondaryButton, StatutDemandeModification } from '@components';
import { ModificationRequestPageDTO } from '@modules/modificationRequest';
import { UserRole } from '@modules/users';
import ROUTES from '@routes';
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
    case 'delai':
      return ROUTES.ADMIN_ANNULER_DELAI_REJETE({
        modificationRequestId: id,
      });
    case 'recours':
      return ROUTES.ADMIN_ANNULER_RECOURS_REJETE({
        modificationRequestId: id,
      });
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
    ['delai', 'recours', 'puissance'].includes(type) &&
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
      <StatusForDelai modificationRequest={modificationRequest} />
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

interface StatusForDelaiProps {
  modificationRequest: ModificationRequestPageDTO;
}
const StatusForDelai = ({ modificationRequest }: StatusForDelaiProps) => {
  const { project } = modificationRequest;
  if (
    modificationRequest.type === 'delai' &&
    modificationRequest.status === 'acceptée' &&
    modificationRequest.acceptanceParams
  ) {
    const {
      acceptanceParams: { delayInMonths, dateAchèvementAccordée },
    } = modificationRequest;

    if (delayInMonths) {
      return (
        <div>
          L‘administration vous accorde un délai{' '}
          <b>{delayInMonths ? `de ${delayInMonths} mois.` : '.'}</b> Votre date d'achèvement
          théorique est actuellement au <b>{helpers.afficherDate(project.completionDueOn)}</b>.
        </div>
      );
    }

    if (dateAchèvementAccordée) {
      return (
        <div>
          L‘administration vous accorde un report de date limite d'achèvement au{' '}
          <span className="font-bold">
            {helpers.afficherDate(new Date(dateAchèvementAccordée))}
          </span>
          .
        </div>
      );
    }

    return null;
  }

  return null;
};
