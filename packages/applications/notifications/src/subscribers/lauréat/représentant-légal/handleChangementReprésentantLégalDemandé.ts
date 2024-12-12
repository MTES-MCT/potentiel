import { récupérerDrealsParIdentifiantProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Routes } from '@potentiel-applications/routes';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { RegisterReprésentantLégalNotificationDependencies } from '.';

type HandleChangementReprésentantLégalDemandéProps = {
  sendEmail: RegisterReprésentantLégalNotificationDependencies['sendEmail'];
  event: ReprésentantLégal.ChangementReprésentantLégalDemandéEvent;
  projet: {
    nom: string;
    département: string;
  };
  baseUrl: string;
};

export const handleChangementReprésentantLégalDemandé = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: HandleChangementReprésentantLégalDemandéProps) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(event.payload.identifiantProjet);
  const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);

  if (dreals.length === 0) {
    getLogger().error('Aucune dreal trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'handleChangementReprésentantLégalDemandé',
    });
    return;
  }

  return sendEmail({
    templateId: 6553655,
    messageSubject: `Potentiel - Demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département}`,
    recipients: dreals,
    variables: {
      nom_projet: projet.nom,
      departement_projet: projet.département,
      url: `${baseUrl}${Routes.ReprésentantLégal.demandeChangement.détail(identifiantProjet.formatter())}`,
    },
  });
};
