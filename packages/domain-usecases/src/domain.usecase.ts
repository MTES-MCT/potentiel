import { GestionnaireRéseauUseCase } from './gestionnaireRéseau/gestionnaireRéseau.usecase';
import { GestionnaireRéseauProjetUseCase } from './projet/lauréat/gestionnaireRéseau/gestionnaireRéseauProjet.usecase';
import { RaccordementUsecase } from './raccordement/raccordement.usecase';
import { AbandonUsecase } from './projet/lauréat/abandon/abandon.usecase';
import { LoadAggregate, Publish } from '@potentiel-domain/core';
import { ProjetDependencies } from './projet/projet.setup';
import { registerRejeterAbandonUseCase } from './projet/lauréat/abandon/rejeter/rejeterAbandon.usecase';
import { registerAccorderAbandonCommand } from './projet/lauréat/abandon/accorder/accorderAbandon.command';
import { registerAccorderAbandonUseCase } from './projet/lauréat/abandon/accorder/accorderAbandon.usecase';
import { registerAnnulerAbandonCommand } from './projet/lauréat/abandon/annuler/annulerAbandon.command';
import { registerAnnulerAbandonUseCase } from './projet/lauréat/abandon/annuler/annulerAbandon.usecase';
import { registerAnnulerRejetAbandonUseCase } from './projet/lauréat/abandon/annuler/annulerRejetAbandon.usecase';
import { registerConfirmerAbandonCommand } from './projet/lauréat/abandon/confirmer/confirmerAbandon.command';
import { registerConfirmerAbandonUseCase } from './projet/lauréat/abandon/confirmer/confirmerAbandon.usecase';
import { registerDemanderAbandonCommand } from './projet/lauréat/abandon/demander/demanderAbandon.command';
import { registerDemanderAbandonAvecRecandidatureUseCase } from './projet/lauréat/abandon/demander/demanderAbandon.usecase';
import { registerDemanderConfirmationAbandonCommand } from './projet/lauréat/abandon/demander/demanderConfirmationAbandon.command';
import { registerDemanderConfirmationAbandonUseCase } from './projet/lauréat/abandon/demander/demanderConfirmationAbandon.usecase';
import { registerRejeterAbandonCommand } from './projet/lauréat/abandon/rejeter/rejeterAbandon.command';

export type DomainUseCase =
  | AbandonUsecase
  | GestionnaireRéseauUseCase
  | GestionnaireRéseauProjetUseCase
  | RaccordementUsecase;

export type UseCaseDependencies = {
  common: {
    publish: Publish;
    loadAggregate: LoadAggregate;
  };
  projet: Omit<ProjetDependencies, keyof UseCaseDependencies['common'] | 'subscribe'>;
};

export const registerUsecases = ({ common, projet }: UseCaseDependencies) => {
  registerDemanderAbandonCommand({
    ...common,
    ...projet,
  });
  registerAccorderAbandonCommand({
    ...common,
    ...projet,
  });
  registerConfirmerAbandonCommand({
    ...common,
    ...projet,
  });
  registerDemanderConfirmationAbandonCommand({
    ...common,
    ...projet,
  });
  registerRejeterAbandonCommand({
    ...common,
    ...projet,
  });
  registerAnnulerAbandonCommand({
    ...common,
    ...projet,
  });

  registerDemanderAbandonAvecRecandidatureUseCase();
  registerAccorderAbandonUseCase();
  registerConfirmerAbandonUseCase();
  registerDemanderConfirmationAbandonUseCase();
  registerRejeterAbandonUseCase();
  registerAnnulerAbandonUseCase();
  registerAnnulerRejetAbandonUseCase();
};
