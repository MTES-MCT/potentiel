import { mediator } from 'mediateur';

import { récupérerDrealsParIdentifiantProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { TâchePlanifiéeEvent } from '@potentiel-domain/tache-planifiee';
import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { RegisterReprésentantLégalNotificationDependencies } from '.';

type HandleTâchePlanifiéeRappelInstructionÀDeuxMoisProps = {
  sendEmail: RegisterReprésentantLégalNotificationDependencies['sendEmail'];
  event: TâchePlanifiéeEvent;
  projet: {
    nom: string;
    département: string;
  };
  baseUrl: string;
};

export const handleTâchePlanifiéeRappelInstructionÀDeuxMois = async ({
  sendEmail,
  event,
  projet,
  baseUrl,
}: HandleTâchePlanifiéeRappelInstructionÀDeuxMoisProps) => {
  if (
    ReprésentantLégal.TypeTâchePlanifiéeChangementReprésentantLégal.convertirEnValueType(
      event.payload.typeTâchePlanifiée,
    ).estRappelInstructionÀDeuxMois()
  ) {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      event.payload.identifiantProjet,
    );

    const dreals = await récupérerDrealsParIdentifiantProjetAdapter(identifiantProjet);

    if (dreals.length === 0) {
      throw new TâchePlanifiéeRappelInstructionÀDeuxMoisError(
        'Aucune dreal trouvée',
        identifiantProjet.formatter(),
      );
    }

    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: {
        identifiantAppelOffre: identifiantProjet.appelOffre,
      },
    });

    if (Option.isNone(appelOffre)) {
      throw new TâchePlanifiéeRappelInstructionÀDeuxMoisError(
        `Appel d'offre non trouvée`,
        identifiantProjet.formatter(),
      );
    }

    const période = appelOffre.periodes.find((p) => p.id === identifiantProjet.période);

    if (!période) {
      throw new TâchePlanifiéeRappelInstructionÀDeuxMoisError(
        `Période non trouvée`,
        identifiantProjet.formatter(),
      );
    }

    const changement =
      await mediator.send<ReprésentantLégal.ConsulterChangementReprésentantLégalQuery>({
        type: 'Lauréat.ReprésentantLégal.Query.ConsulterChangementReprésentantLégal',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    if (Option.isNone(changement)) {
      throw new TâchePlanifiéeRappelInstructionÀDeuxMoisError(
        `Aucun changement de représentant légal à traiter`,
        identifiantProjet.formatter(),
      );
    }

    const {
      changement: {
        représentantLégal: { typeTâchePlanifiée },
      },
    } = période;

    return sendEmail({
      templateId: 6636431,
      messageSubject: `Potentiel - La demande de modification du représentant légal pour le projet ${projet.nom} dans le département ${projet.département} a été accordée automatiquement`,
      recipients: dreals,
      variables: {
        type: typeTâchePlanifiée === 'accord-automatique' ? 'accord' : 'rejet',
        nom_projet: projet.nom,
        departement_projet: projet.département,
        url: `${baseUrl}${Routes.Projet.details(identifiantProjet.formatter())}`,
      },
    });
  }
};

class TâchePlanifiéeRappelInstructionÀDeuxMoisError extends Error {
  constructor(
    public cause: string,
    public identifiantProjet: string,
  ) {
    super(
      `Impossible de traiter automatiquement la tâche planifier pour le rappel d'instruction à deux mois du changement de représentant légal`,
    );
  }
}
