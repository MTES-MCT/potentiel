import { mediator } from 'mediateur';

import { Routes } from '@potentiel-applications/routes';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { listerDrealsRecipients } from '../../../helpers';

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

  const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: {
      identifiantAppelOffre: identifiantProjet.appelOffre,
    },
  });

  if (Option.isNone(appelOffre)) {
    getLogger().error("Appel d'offre non trouvé", {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'handleReprésentantLégalRappelInstructionÀDeuxMois',
    });
    return;
  }

  const période = appelOffre.periodes.find((p) => p.id === identifiantProjet.période);

  if (!période) {
    getLogger().error('Période non trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'handleReprésentantLégalRappelInstructionÀDeuxMois',
    });
    return;
  }

  const changementRègles =
    période.changement?.représentantLégal ?? appelOffre.changement.représentantLégal;

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

  if (!changementRègles) {
    return;
  }

  const messageSubject = `Potentiel - La demande de modification du représentant légal pour le projet ${nom} dans le département ${département} nécessite votre instruction`;

  await sendEmail({
    messageSubject,
    recipients: dreals,
    templateId: 6636431,
    variables: {
      type: changementRègles.typeTâchePlanifiée === 'accord-automatique' ? 'accord' : 'rejet',
      nom_projet: nom,
      departement_projet: département,
      url: `${baseUrl}${Routes.ReprésentantLégal.changement.détail(identifiantProjet.formatter(), changementEnCours.demandéLe.formatter())}`,
    },
  });
};
