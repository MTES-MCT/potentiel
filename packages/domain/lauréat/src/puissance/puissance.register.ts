import { LoadAggregate } from '@potentiel-domain/core';

import { registerImporterPuissanceCommand } from './importer/importerPuissance.command';
import {
  ConsulterPuissanceDependencies,
  registerConsulterPuissanceQuery,
} from './consulter/consulterPuissance.query';
import { registerModifierPuissanceCommand } from './modifier/modifierPuissance.command';
import { registerModifierPuissanceUseCase } from './modifier/modifierPuissance.usecase';
import { registerDemanderChangementPuissanceCommand } from './changement/demander/demanderChangementPuissance.command';
import { registerDemanderChangementPuissanceUseCase } from './changement/demander/demanderChangementPuissance.usecase';
import { registerConsulterChangementPuissanceQuery } from './changement/consulter/consulterChangementPuissance.query';
import { registerAnnulerChangementPuissanceCommand } from './changement/annuler/annulerChangementPuissance.command';
import { registerAnnulerChangementPuissanceUseCase } from './changement/annuler/annulerChangementPuissance.usecase';
import { registerSupprimerChangementPuissanceCommand } from './changement/supprimer/supprimerChangementPuissance.command';

export type PuissanceQueryDependencies = ConsulterPuissanceDependencies;

export type PuissanceCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerPuissanceUseCases = ({ loadAggregate }: PuissanceCommandDependencies) => {
  registerModifierPuissanceUseCase();
  registerDemanderChangementPuissanceUseCase();
  registerAnnulerChangementPuissanceUseCase();

  registerImporterPuissanceCommand(loadAggregate);
  registerModifierPuissanceCommand(loadAggregate);
  registerDemanderChangementPuissanceCommand(loadAggregate);
  registerAnnulerChangementPuissanceCommand(loadAggregate);
  registerSupprimerChangementPuissanceCommand(loadAggregate);
};

export const registerPuissanceQueries = (dependencies: PuissanceQueryDependencies) => {
  registerConsulterPuissanceQuery(dependencies);
  registerConsulterChangementPuissanceQuery(dependencies);
};
