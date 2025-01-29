import { mediator } from 'mediateur';

import { récupérerDrealsParIdentifiantProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { RegisterTâchePlanifiéeNotificationDependencies } from '.';

type HandleReprésentantLégalRappelInstructionÀDeuxMoisNotificationProps = {
  sendEmail: RegisterTâchePlanifiéeNotificationDependencies['sendEmail'];
  identifiantProjet: IdentifiantProjet.ValueType;
  projet: {
    nom: string;
    département: string;
  };
  baseUrl: string;
};

export const représentantLégalRappelInstructionÀDeuxMoisNotification = async ({
  sendEmail,
  identifiantProjet,
  projet: { nom, département },
  baseUrl,
}: HandleReprésentantLégalRappelInstructionÀDeuxMoisNotificationProps) => {
  const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);

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

  const changementEnCours =
    await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalEnCoursQuery>({
      type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégalEnCours',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

  if (Option.isNone(changementEnCours)) {
    getLogger().error('Aucune demande de changement de représentant légal en cours trouvée', {
      identifiantProjet: identifiantProjet.formatter(),
      application: 'notifications',
      fonction: 'représentantLégalRappelInstructionÀDeuxMoisNotification',
    });
    return;
  }

  const {
    changement: {
      représentantLégal: { typeTâchePlanifiée },
    },
  } = période;

  const messageSubject = `Potentiel - La demande de modification du représentant légal pour le projet ${nom} dans le département ${département} nécessite votre instruction`;

  await sendEmail({
    messageSubject,
    recipients: dreals,
    templateId: 6636431,
    variables: {
      type: typeTâchePlanifiée === 'accord-automatique' ? 'accord' : 'rejet',
      nom_projet: nom,
      departement_projet: département,
      url: `${baseUrl}${Routes.ReprésentantLégal.changement.détail(identifiantProjet.formatter(), changementEnCours.demandéLe.formatter())}`,
    },
  });
};
