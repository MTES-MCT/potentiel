import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email } from '@potentiel-domain/common';
import type { UserFiltersType } from '@potentiel-domain/utilisateur';

import type { GetNombreDemandesÀInstruire } from './getNombreDemandesÀInstruire.port.js';
import type { GetScopeProjetUtilisateur } from './getScopeProjetUtilisateur.port.js';
import type { AutoritéCompétente } from './lauréat/abandon/index.js';

export type ConsulterNombreDemandesÀInstruireReadModel = Array<{
  domain: AppelOffre.DomainesConcernésParMiseÀJourAvecInstruction;
  total: number;
  new: number;
}>;

export type ConsulterNombreDemandesÀInstruireQuery = Message<
  'Projet.Query.ConsulterNombreDemandesÀInstruire',
  {
    utilisateur: Email.RawType;
    appelOffre?: Array<string>;
    autoritéCompétente: AutoritéCompétente.RawType;
    filtres?: UserFiltersType;
  },
  ConsulterNombreDemandesÀInstruireReadModel
>;

export type ConsulterNombreDemandesÀInstruireDependencies = {
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
  getNombreDemandesÀInstruire: GetNombreDemandesÀInstruire;
};

export const registerConsulterNombreDemandesÀInstruireQuery = ({
  getScopeProjetUtilisateur,
  getNombreDemandesÀInstruire,
}: ConsulterNombreDemandesÀInstruireDependencies) => {
  const handler: MessageHandler<ConsulterNombreDemandesÀInstruireQuery> = async ({
    autoritéCompétente,
    utilisateur,
    filtres,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const nombreDemandes = await getNombreDemandesÀInstruire(
      autoritéCompétente,
      DateTime.now().retirerNombreDeMois(1).formatter(),
      scope.régions,
      filtres,
    );

    return nombreDemandes;
  };

  mediator.register('Projet.Query.ConsulterNombreDemandesÀInstruire', handler);
};
