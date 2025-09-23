import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients } from '../../../helpers';
import { getCahierDesChargesLauréat } from '../../../helpers/getCahierDesChargesLauréat';

import { RegisterTâchePlanifiéeNotificationDependencies } from '.';

type HandleReprésentantLégalRappelInstructionÀDeuxMoisNotificationProps = {
  sendEmail: RegisterTâchePlanifiéeNotificationDependencies['sendEmail'];
  identifiantProjet: IdentifiantProjet.ValueType;
  projet: {
    nom: string;
    département: string;
    région: string;
  };
  baseUrl: string;
};

export const représentantLégalRappelInstructionÀDeuxMoisNotification = async ({
  sendEmail,
  identifiantProjet,
  projet: { nom, région, département },
  baseUrl,
}: HandleReprésentantLégalRappelInstructionÀDeuxMoisNotificationProps) => {
  const dreals = await listerDrealsRecipients(région);
  const cahierDesCharges = await getCahierDesChargesLauréat(identifiantProjet);

  const règlesChangement = cahierDesCharges.getRèglesChangements('représentantLégal');
  if (!règlesChangement.instructionAutomatique) {
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
      fonction: 'représentantLégalRappelInstructionÀDeuxMoisNotification',
    });
    return;
  }

  const messageSubject = `Potentiel - La demande de modification du représentant légal pour le projet ${nom} dans le département ${département} nécessite votre instruction`;

  await sendEmail({
    messageSubject,
    recipients: dreals,
    templateId: 6636431,
    variables: {
      type: règlesChangement.instructionAutomatique,
      nom_projet: nom,
      departement_projet: département,
      url: `${baseUrl}${Routes.ReprésentantLégal.changement.détails(identifiantProjet.formatter(), changementEnCours.demandéLe.formatter())}`,
    },
  });
};
