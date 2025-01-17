import { LoadAggregate } from '@potentiel-domain/core';

import { registerImporterReprésentantLégalCommand } from './importer/importerReprésentantLégal.command';
import {
  ConsulterReprésentantLégalDependencies,
  registerConsulterRepresentantLegalQuery,
} from './consulter/consulterReprésentantLégal.query';
import { registerModifierReprésentantLégalCommand } from './modifier/modifierReprésentantLégal.command';
import { registerModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase';
import { registerDemanderChangementReprésentantLégalUseCase } from './changement/demander/demanderChangementReprésentantLégal.usecase';
import { registerDemanderChangementReprésentantLégalCommand } from './changement/demander/demanderChangementReprésentantLégal.command';
import { registerConsulterChangementReprésentantLegalQuery } from './changement/consulter/consulterChangementReprésentantLégal.query';
import {
  ListerChangementReprésentantLégalDependencies,
  registerListerChangementReprésentantLégalQuery,
} from './changement/lister/listerChangementReprésentantLégal.query';
import { registerAccorderChangementReprésentantLégalUseCase } from './changement/accorder/accorderChangementReprésentantLégal.usecase';
import { registerAccorderChangementReprésentantLégalCommand } from './changement/accorder/accorderChangementReprésentantLégal.command';
import { registerRejeterChangementReprésentantLégalUseCase } from './changement/rejeter/rejeterChangementReprésentantLégal.usecase';
import { registerRejeterChangementReprésentantLégalCommand } from './changement/rejeter/rejeterChangementReprésentantLégal.command';
import { registerSupprimerChangementReprésentantLégalCommand } from './changement/supprimer/supprimerChangementReprésentantLégal.command';
import { registerAnnulerChangementReprésentantLégalCommand } from './changement/annuler/annulerChangementReprésentantLégal.command';
import { registerAnnulerChangementReprésentantLégalUseCase } from './changement/annuler/annulerChangementReprésentantLégal.usecase';

export type ReprésentantLégalQueryDependencies = ConsulterReprésentantLégalDependencies &
  ListerChangementReprésentantLégalDependencies;

export type ReprésentantLégalCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerReprésentantLégalUseCases = ({
  loadAggregate,
}: ReprésentantLégalCommandDependencies) => {
  // Commands
  registerImporterReprésentantLégalCommand(loadAggregate);
  registerModifierReprésentantLégalCommand(loadAggregate);
  registerDemanderChangementReprésentantLégalCommand(loadAggregate);
  registerAnnulerChangementReprésentantLégalCommand(loadAggregate);
  registerAccorderChangementReprésentantLégalCommand(loadAggregate);
  registerRejeterChangementReprésentantLégalCommand(loadAggregate);
  registerSupprimerChangementReprésentantLégalCommand(loadAggregate);

  // UseCases
  registerModifierReprésentantLégalUseCase();
  registerDemanderChangementReprésentantLégalUseCase();
  registerAnnulerChangementReprésentantLégalUseCase(loadAggregate);
  registerAccorderChangementReprésentantLégalUseCase();
  registerRejeterChangementReprésentantLégalUseCase();
};

export const registerReprésentantLégalQueries = (
  dependencies: ReprésentantLégalQueryDependencies,
) => {
  registerConsulterRepresentantLegalQuery(dependencies);
  registerConsulterChangementReprésentantLegalQuery(dependencies);
  registerListerChangementReprésentantLégalQuery(dependencies);
};
