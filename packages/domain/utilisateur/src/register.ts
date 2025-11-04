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
import { registerInviterUseCase } from './inviter/inviterUtilisateur.usecase';
import { registerInviterCommand } from './inviter/inviterUtilisateur.command';
import { registerDésactiverUseCase } from './désactiver/désactiverUtilisateur.usecase';
import { registerDésactiverCommand } from './désactiver/désactiverUtilisateur.command';
import { registerRéactiverUseCase } from './réactiver/réactiverUtilisateur.usecase';
import { registerRéactiverCommand } from './réactiver/réactiverUtilisateur.command';
import { registerCréerPorteurUseCase } from './créer/créerPorteur.usecase';
import { registerCréerPorteurCommand } from './créer/créerPorteur.command';

type UtilisateurQueryDependencies = ConsulterUtilisateurDependencies &
  ListerUtilisateursDependencies &
  TrouverUtilisateurDependencies;

export const registerUtilisateurQueries = (dependencies: UtilisateurQueryDependencies) => {
  registerConsulterUtilisateurQuery(dependencies);
  registerListerUtilisateursQuery(dependencies);
  registerTrouverUtilisateurQuery(dependencies);
};

export type UtilisateurCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerUtilisateurUseCases = ({ loadAggregate }: UtilisateurCommandDependencies) => {
  registerInviterUseCase();
  registerInviterCommand(loadAggregate);

  registerInviterPorteurUseCase();
  registerInviterPorteurCommand(loadAggregate);

  registerDésactiverUseCase();
  registerDésactiverCommand(loadAggregate);

  registerRéactiverUseCase();
  registerRéactiverCommand(loadAggregate);

  registerCréerPorteurUseCase();
  registerCréerPorteurCommand(loadAggregate);
};
