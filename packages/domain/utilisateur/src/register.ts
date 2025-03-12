import { LoadAggregate } from '@potentiel-domain/core';

import {
  ConsulterUtilisateurDependencies,
  registerConsulterUtilisateurQuery,
} from './consulter/consulterUtilisateur.query';
import { registerInviterPorteurCommand } from './inviter/inviterPorteur.command';
import { registerInviterPorteurUseCase } from './inviter/inviterPorteur.usecase';
import {
  ListerUtilisateursDependencies,
  registerListerUtilisateursQuery,
} from './lister/listerUtilisateurs.query';
import {
  registerTrouverUtilisateurQuery,
  TrouverUtilisateurDependencies,
} from './trouver/trouverUtilisateur.query';
import {
  VérifierAccèsProjetDependencies,
  registerVérifierAccèsProjetQuery,
} from './vérifierAccèsProjet/vérifierAccèsProjet.query';
import { registerInviterUseCase } from './inviter/inviter.usecase';
import { registerInviterCommand } from './inviter/inviter.command';
import { registerRéclamerProjetCommand } from './réclamer/réclamerProjet.command';
import { registerRéclamerProjetUseCase } from './réclamer/réclamerProjet.usecase';
import { registerRetirerAccèsProjetCommand } from './retirer/retirerAccèsProjet.command';
import { registerRetirerAccèsProjetUseCase } from './retirer/retirerAccèsProjet.usecase';
import {
  ListerProjetsÀRéclamerDependencies,
  registerListerProjetsÀRéclamerQuery,
} from './lister/listerProjetsÀRéclamer.query';

type UtilisateurQueryDependencies = ConsulterUtilisateurDependencies &
  ListerUtilisateursDependencies &
  VérifierAccèsProjetDependencies &
  TrouverUtilisateurDependencies &
  ListerProjetsÀRéclamerDependencies;

export const registerUtilisateurQueries = (dependencies: UtilisateurQueryDependencies) => {
  registerConsulterUtilisateurQuery(dependencies);
  registerListerUtilisateursQuery(dependencies);
  registerTrouverUtilisateurQuery(dependencies);
  registerVérifierAccèsProjetQuery(dependencies);

  registerListerProjetsÀRéclamerQuery(dependencies);
};

export type UtilisateurCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerUtiliseurUseCases = ({ loadAggregate }: UtilisateurCommandDependencies) => {
  registerInviterUseCase();
  registerInviterPorteurUseCase();
  registerRéclamerProjetUseCase();
  registerRetirerAccèsProjetUseCase();

  registerInviterCommand(loadAggregate);
  registerInviterPorteurCommand(loadAggregate);
  registerRéclamerProjetCommand(loadAggregate);
  registerRetirerAccèsProjetCommand(loadAggregate);
};
