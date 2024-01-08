import { GestionnaireRéseauProjetUseCase } from './projet/lauréat/gestionnaireRéseau/gestionnaireRéseauProjet.usecase';
import { RaccordementUsecase } from './raccordement/raccordement.usecase';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { ProjetDependencies } from './projet/projet.setup';

export type DomainUseCase = GestionnaireRéseauProjetUseCase | RaccordementUsecase;

export type UseCaseDependencies = {
  common: {
    publish: Publish;
    loadAggregate: LoadAggregate;
  };
  projet: Omit<ProjetDependencies, keyof UseCaseDependencies['common'] | 'subscribe'>;
};
