import { DownloadLink, SecondaryButton } from '@components';
import { ModificationRequestPageDTO } from '@modules/modificationRequest';
import { UserRole } from '@modules/users';
import ROUTES from '@routes';
import React from 'react';
import { formatDateToString } from '../../../../helpers/formatDateToString';
import {
  ModificationRequestColorByStatus,
  ModificationRequestStatusTitle,
  ModificationRequestTitleColorByStatus,
} from '../../../helpers';

interface DemandeStatusProps {
  modificationRequest: ModificationRequestPageDTO;
  role: UserRole;
}

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
    <div
      className={'notification ' + (status ? ModificationRequestColorByStatus[status] : '')}
      style={{ color: ModificationRequestTitleColorByStatus[status] }}
    >
      <span
        style={{
          fontWeight: 'bold',
        }}
      >
        {ModificationRequestStatusTitle[status]}
      </span>{' '}
      {respondedOn && respondedBy && `par ${respondedBy} le ${formatDateToString(respondedOn)}`}
      {afficherBoutonAnnulerRejet && (
        <form
          method="post"
          action={getAdminAnulerRejetDemandeRoute({ type, id: modificationRequest.id })}
          className="m-0 mt-4"
        >
          <SecondaryButton
            type="submit"
            value={modificationRequest.id}
            name={type === 'puissance' ? 'demandeChangementDePuissanceId' : 'modificationRequestId'}
            onClick={(e) => {
              if (
                !confirm(
                  'Êtes-vous sûr de vouloir passer le statut de la demande en statut "envoyée" ?',
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            Annuler le rejet de la demande
          </SecondaryButton>
        </form>
      )}
      {cancelledOn && cancelledBy && `par ${cancelledBy} le ${formatDateToString(cancelledOn)}`}
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
    </div>
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
          théorique est actuellement au <b>{formatDateToString(project.completionDueOn)}</b>.
        </div>
      );
    }

    if (dateAchèvementAccordée) {
      return (
        <div>
          L‘administration vous accorde un report de date limite d'achèvement au{' '}
          <span className="font-bold">{formatDateToString(new Date(dateAchèvementAccordée))}</span>.
        </div>
      );
    }

    return null;
  }

  return null;
};
