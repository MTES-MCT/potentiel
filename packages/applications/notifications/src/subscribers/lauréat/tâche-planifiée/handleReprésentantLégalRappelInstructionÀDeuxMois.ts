import { mediator } from 'mediateur';

import { récupérerDrealsParIdentifiantProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { RegisterTâchePlanifiéeNotificationDependencies } from '.';

type HandleReprésentantLégalRappelInstructionÀDeuxMoisProps = {
  sendEmail: RegisterTâchePlanifiéeNotificationDependencies['sendEmail'];
  identifiantProjet: IdentifiantProjet.ValueType;
  projet: {
    nom: string;
    département: string;
  };
  baseUrl: string;
};

export const handleReprésentantLégalRappelInstructionÀDeuxMois = async ({
  sendEmail,
  identifiantProjet,
  projet: { nom, département },
  baseUrl,
}: HandleReprésentantLégalRappelInstructionÀDeuxMoisProps) => {
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

  const représentantLégal = await mediator.send<ReprésentantLégal.ConsulterReprésentantLégalQuery>({
    type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  if (Option.isNone(représentantLégal)) {
    getLogger().warn(`Aucun représentant légal n'a été trouvé pour le rappel à 2 mois`, {
      event,
    });
    return;
  }
  if (!représentantLégal.demandeEnCours) {
    getLogger().warn(`Aucune demande en cours pour le rappel à 2 mois`, {
      event,
    });
    return;
  }

  const changementReprésentantLégal =
    await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
      type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
        demandéLe: représentantLégal.demandeEnCours.demandéLe,
      },
    });

  if (Option.isNone(changementReprésentantLégal)) {
    getLogger().error(
      `Aucun changement de représentant légal n'a été trouvé pour le rappel à 2 mois`,
      {
        event,
      },
    );
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
      url: `${baseUrl}${Routes.ReprésentantLégal.changement.détail(identifiantProjet.formatter(), changementReprésentantLégal.demande.demandéLe.formatter())}`,
    },
  });
};
