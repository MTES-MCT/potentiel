import { récupérerDrealsParIdentifiantProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { RegisterReprésentantLégalNotificationDependencies } from '.';

type HandleChangementReprésentantLégalAnnuléProps = {
  sendEmail: RegisterReprésentantLégalNotificationDependencies['sendEmail'];
  event: ReprésentantLégal.ChangementReprésentantLégalAnnuléEvent;
  projet: {
    nom: string;
    département: string;
  };
  baseUrl: string;
};

export const handleChangementReprésentantLégalAnnulé = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: HandleChangementReprésentantLégalAnnuléProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);

  if (dreals.length === 0) {
    getLogger().error('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'handleChangementReprésentantLégalAnnulé',
    });
    return;
  }

  return sendEmail({
    templateId: 6640592,
    messageSubject: `Potentiel - Annulation de la demande de modification du représentant légal pour le projet ${projet.nom} situé dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
    },
  });
};
