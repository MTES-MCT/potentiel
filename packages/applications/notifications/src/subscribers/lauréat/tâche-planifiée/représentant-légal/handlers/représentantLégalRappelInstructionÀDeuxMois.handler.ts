import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import {
  listerDrealsRecipients,
  getCahierDesChargesLauréat,
  getLauréat,
  getBaseUrl,
} from '#helpers';
import { sendEmail } from '#sendEmail';

import { TâchePlanifiéeReprésentantLégalNotificationProps } from '../tâche-planifiée.représentantLégal.notifications.js';

export const handleReprésentantLégalRappelInstructionÀDeuxMois = async ({
  identifiantProjet,
}: TâchePlanifiéeReprésentantLégalNotificationProps) => {
  const lauréat = await getLauréat(identifiantProjet.formatter());

  const cahierDesCharges = await getCahierDesChargesLauréat(identifiantProjet);

  const règlesChangement = cahierDesCharges.getRèglesChangements('représentantLégal');

  if (!règlesChangement.instructionAutomatique) {
    getLogger().error(
      "Aucune règle d'instruction automatique pour le changement de représentant légal trouvée",
      {
        identifiantProjet: identifiantProjet.formatter(),
        application: 'notifications',
      },
    );
    return;
  }

  const changementEnCours =
    await mediator.send<Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalEnCoursQuery>(
      {
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégalEnCours',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      },
    );

  if (Option.isNone(changementEnCours)) {
    getLogger().error('Aucune demande de changement de représentant légal en cours trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
    });
    return;
  }

  const drealsRecipients = await listerDrealsRecipients(lauréat.région);

  await sendEmail({
    key: 'lauréat/représentant-légal/rappel_instruction_2_mois',
    recipients: drealsRecipients,
    values: {
      nom_projet: lauréat.nom,
      appel_offre: lauréat.identifiantProjet.appelOffre,
      période: lauréat.identifiantProjet.période,
      departement_projet: lauréat.département,
      type_instruction_automatique:
        règlesChangement.instructionAutomatique === 'accord' ? 'acceptation' : 'refus',
      url: `${getBaseUrl()}${Routes.ReprésentantLégal.changement.détails(identifiantProjet.formatter(), changementEnCours.demandéLe.formatter())}`,
    },
  });
};
