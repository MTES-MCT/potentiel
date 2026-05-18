import type { LoadAggregate } from '@potentiel-domain/core';

import {
  type ConsulterUtilisateurDependencies,
  registerConsulterUtilisateurQuery,
} from './consulter/consulterUtilisateur.query.js';
import { registerCréerPorteurCommand } from './créer/créerPorteur.command.js';
import { registerDésactiverCommand } from './désactiver/désactiverUtilisateur.command.js';
import { registerDésactiverUseCase } from './désactiver/désactiverUtilisateur.usecase.js';
import { registerInviterPorteurCommand } from './inviter/inviterPorteur.command.js';
import { registerInviterPorteurUseCase } from './inviter/inviterPorteur.usecase.js';
import { registerInviterCommand } from './inviter/inviterUtilisateur.command.js';
import { registerInviterUseCase } from './inviter/inviterUtilisateur.usecase.js';
import {
  type ListerUtilisateursDependencies,
  registerListerUtilisateursQuery,
} from './lister/listerUtilisateurs.query.js';
import { registerModifierRôleCommand } from './modifierRôle/modifierRôleUtilisateur.command.js';
import { registerModifierRôleUseCase } from './modifierRôle/modifierRôleUtilisateur.usecase.js';
import { registerRéactiverCommand } from './réactiver/réactiverUtilisateur.command.js';
import { registerRéactiverUseCase } from './réactiver/réactiverUtilisateur.usecase.js';
import {
  registerTrouverUtilisateurQuery,
  type TrouverUtilisateurDependencies,
} from './trouver/trouverUtilisateur.query.js';

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

  registerModifierRôleUseCase();
  registerModifierRôleCommand(loadAggregate);

  registerCréerPorteurCommand(loadAggregate);
};
