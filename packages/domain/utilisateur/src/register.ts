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
import {
  ListerProjetsÀRéclamerDependencies,
  registerListerProjetsÀRéclamerQuery,
} from './lister/listerProjetsÀRéclamer.query';
import { registerListerPorteursQuery } from './lister/listerPorteurs.query';
import { registerDésactiverUseCase } from './désactiver/désactiverUtilisateur.usecase';
import { registerDésactiverCommand } from './désactiver/désactiverUtilisateur.command';
import { registerRéactiverUseCase } from './réactiver/réactiverUtilisateur.usecase';
import { registerRéactiverCommand } from './réactiver/réactiverUtilisateur.command';

type UtilisateurQueryDependencies = ConsulterUtilisateurDependencies &
  ListerUtilisateursDependencies &
  TrouverUtilisateurDependencies &
  ListerProjetsÀRéclamerDependencies;

export const registerUtilisateurQueries = (dependencies: UtilisateurQueryDependencies) => {
  registerConsulterUtilisateurQuery(dependencies);
  registerListerUtilisateursQuery(dependencies);
  registerTrouverUtilisateurQuery(dependencies);
  registerListerProjetsÀRéclamerQuery(dependencies);
  registerListerPorteursQuery(dependencies);
};

export type UtilisateurCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerUtilisateurUseCases = ({ loadAggregate }: UtilisateurCommandDependencies) => {
  registerInviterUseCase();
  registerInviterPorteurUseCase();
  registerDésactiverUseCase();
  registerRéactiverUseCase();

  registerInviterCommand(loadAggregate);
  registerInviterPorteurCommand(loadAggregate);
  registerDésactiverCommand(loadAggregate);
  registerRéactiverCommand(loadAggregate);
};
