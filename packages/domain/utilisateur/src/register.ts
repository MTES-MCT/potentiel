import type { LoadAggregate } from '@potentiel-domain/core';

import {
  type ConsulterUtilisateurDependencies,
  registerConsulterUtilisateurQuery,
} from './consulter/consulterUtilisateur.query';
import { registerCréerPorteurCommand } from './créer/créerPorteur.command';
import { registerCréerPorteurUseCase } from './créer/créerPorteur.usecase';
import { registerDésactiverCommand } from './désactiver/désactiverUtilisateur.command';
import { registerDésactiverUseCase } from './désactiver/désactiverUtilisateur.usecase';
import { registerInviterPorteurCommand } from './inviter/inviterPorteur.command';
import { registerInviterPorteurUseCase } from './inviter/inviterPorteur.usecase';
import { registerInviterCommand } from './inviter/inviterUtilisateur.command';
import { registerInviterUseCase } from './inviter/inviterUtilisateur.usecase';
import {
  type ListerPorteursDependencies,
  registerListerPorteursQuery,
} from './lister/listerPorteurs.query';
import {
  type ListerUtilisateursDependencies,
  registerListerUtilisateursQuery,
} from './lister/listerUtilisateurs.query';
import { registerRéactiverCommand } from './réactiver/réactiverUtilisateur.command';
import { registerRéactiverUseCase } from './réactiver/réactiverUtilisateur.usecase';
import {
  registerTrouverUtilisateurQuery,
  type TrouverUtilisateurDependencies,
} from './trouver/trouverUtilisateur.query';

type UtilisateurQueryDependencies = ConsulterUtilisateurDependencies &
  ListerUtilisateursDependencies &
  ListerPorteursDependencies &
  TrouverUtilisateurDependencies;

export const registerUtilisateurQueries = (dependencies: UtilisateurQueryDependencies) => {
  registerConsulterUtilisateurQuery(dependencies);
  registerListerUtilisateursQuery(dependencies);
  registerListerPorteursQuery(dependencies);
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
