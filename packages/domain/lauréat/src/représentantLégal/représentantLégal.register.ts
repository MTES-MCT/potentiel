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
import {
  SupprimerDocumentProjetSensibleCommandDependencies,
  registerSupprimerDocumentProjetSensibleCommand,
} from './changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';
import { registerCorrigerChangementReprésentantLégalUseCase } from './changement/corriger/corrigerChangementReprésentantLégal.usecase';
import { registerCorrigerChangementReprésentantLégalCommand } from './changement/corriger/corrigerChangementReprésentantLégal.command';
import { registerConsulterChangementReprésentantLegalEnCoursQuery } from './changement/consulter/consulterChangementReprésentantLégalEnCours.query';

export type ReprésentantLégalQueryDependencies = ConsulterReprésentantLégalDependencies &
  ListerChangementReprésentantLégalDependencies;

export type ReprésentantLégalCommandDependencies = {
  loadAggregate: LoadAggregate;
} & SupprimerDocumentProjetSensibleCommandDependencies;

export const registerReprésentantLégalUseCases = ({
  loadAggregate,
  supprimerDocumentProjetSensible,
}: ReprésentantLégalCommandDependencies) => {
  // Commands
  registerImporterReprésentantLégalCommand(loadAggregate);
  registerModifierReprésentantLégalCommand(loadAggregate);
  registerDemanderChangementReprésentantLégalCommand(loadAggregate);
  registerAnnulerChangementReprésentantLégalCommand(loadAggregate);
  registerCorrigerChangementReprésentantLégalCommand(loadAggregate);
  registerAccorderChangementReprésentantLégalCommand(loadAggregate);
  registerRejeterChangementReprésentantLégalCommand(loadAggregate);
  registerSupprimerChangementReprésentantLégalCommand(loadAggregate);
  registerSupprimerDocumentProjetSensibleCommand({
    loadAggregate,
    supprimerDocumentProjetSensible,
  });

  // UseCases
  registerModifierReprésentantLégalUseCase();
  registerDemanderChangementReprésentantLégalUseCase();
  registerAnnulerChangementReprésentantLégalUseCase();
  registerCorrigerChangementReprésentantLégalUseCase();
  registerAccorderChangementReprésentantLégalUseCase();
  registerRejeterChangementReprésentantLégalUseCase();
};

export const registerReprésentantLégalQueries = (
  dependencies: ReprésentantLégalQueryDependencies,
) => {
  registerConsulterRepresentantLegalQuery(dependencies);
  registerConsulterChangementReprésentantLegalQuery(dependencies);
  registerConsulterChangementReprésentantLegalEnCoursQuery(dependencies);
  registerListerChangementReprésentantLégalQuery(dependencies);
};
