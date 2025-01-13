import { LoadAggregate } from '@potentiel-domain/core';

import { registerImporterActionnaireCommand } from './importer/importerActionnaire.command';
import {
  ConsulterActionnaireDependencies,
  registerConsulterActionnaireQuery,
} from './consulter/consulterActionnaire.query';
import { registerAccorderDemandeChangementActionnaireCommand } from './changement/accorder/accorderChangementActionnairet.command';
import { registerAccorderDemandeChangementActionnaireUseCase } from './changement/accorder/accorderChangementActionnaire.usecase';
import { registerAnnulerDemandeChangementCommand } from './changement/annuler/annulerChangementActionnaire.command';
import { registerAnnulerDemandeChangementActionnaireUseCase } from './changement/annuler/annulerChangementActionnaire.usecase';
import { registerConsulterDemandeChangementActionnaireQuery } from './changement/consulter/consulterDemandeChangementActionnaire.query';
import { registerDemanderChangementActionnaireCommand } from './changement/demander/demandeChangementActionnaire.command';
import { registerDemanderChangementActionnaireUseCase } from './changement/demander/demandeChangementActionnaire.usecase';
import { registerRejeterDemandeChangementActionnaireCommand } from './changement/rejeter/rejeterChangementActionnaire.command';
import { registerRejeterDemandeChangementActionnaireUseCase } from './changement/rejeter/rejeterChangementActionnaire.usecase';
import {
  registerModifierActionnaireCommand,
  RécupérerTypeActionnariatParIdentifiantProjetPort,
} from './modifier/modifierActionnaire.command';
import { registerTransmettreActionnaireUseCase } from './transmettre/transmettreActionnaire.usecase';
import { registerTransmettreActionnaireCommand } from './transmettre/transmettreActionnaire.command';
import { registerModifierActionnaireUseCase } from './modifier/modifierActionnaire.usecase';
import {
  ListerChangementActionnaireDependencies,
  registerListerChangementActionnaireQuery,
} from './changement/lister/listerChangementActionnaire.query';

export type ActionnaireQueryDependencies = ConsulterActionnaireDependencies &
  ListerChangementActionnaireDependencies;

export type ActionnaireCommandDependencies = {
  loadAggregate: LoadAggregate;
  récupérerTypeActionnariatParIdentifiantProjet: RécupérerTypeActionnariatParIdentifiantProjetPort;
};

export const registerActionnaireUseCases = ({
  loadAggregate,
  récupérerTypeActionnariatParIdentifiantProjet,
}: ActionnaireCommandDependencies) => {
  registerImporterActionnaireCommand(loadAggregate);
  registerTransmettreActionnaireCommand(loadAggregate);
  registerModifierActionnaireCommand({
    loadAggregate,
    récupérerTypeActionnariatParIdentifiantProjet,
  });
  registerDemanderChangementActionnaireCommand(loadAggregate);
  registerAnnulerDemandeChangementCommand(loadAggregate);
  registerAccorderDemandeChangementActionnaireCommand(loadAggregate);
  registerRejeterDemandeChangementActionnaireCommand(loadAggregate);

  registerTransmettreActionnaireUseCase();
  registerModifierActionnaireUseCase();
  registerDemanderChangementActionnaireUseCase();
  registerAnnulerDemandeChangementActionnaireUseCase();
  registerAccorderDemandeChangementActionnaireUseCase();
  registerRejeterDemandeChangementActionnaireUseCase();
};

export const registerActionnaireQueries = (dependencies: ActionnaireQueryDependencies) => {
  registerConsulterActionnaireQuery(dependencies);
  registerConsulterDemandeChangementActionnaireQuery(dependencies);
  registerListerChangementActionnaireQuery(dependencies);
};
