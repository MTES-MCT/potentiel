import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port.js';

import {
  ConsulterReprésentantLégalDependencies,
  registerConsulterRepresentantLegalQuery,
} from './consulter/consulterReprésentantLégal.query.js';
import { registerModifierReprésentantLégalCommand } from './modifier/modifierReprésentantLégal.command.js';
import { registerModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase.js';
import { registerDemanderChangementReprésentantLégalUseCase } from './changement/demander/demanderChangementReprésentantLégal.usecase.js';
import { registerDemanderChangementReprésentantLégalCommand } from './changement/demander/demanderChangementReprésentantLégal.command.js';
import { registerConsulterChangementReprésentantLegalQuery } from './changement/consulter/consulterChangementReprésentantLégal.query.js';
import {
  ListerChangementReprésentantLégalDependencies,
  registerListerChangementReprésentantLégalQuery,
} from './changement/lister/listerChangementReprésentantLégal.query.js';
import { registerAccorderChangementReprésentantLégalUseCase } from './changement/accorder/accorderChangementReprésentantLégal.usecase.js';
import { registerAccorderChangementReprésentantLégalCommand } from './changement/accorder/accorderChangementReprésentantLégal.command.js';
import { registerRejeterChangementReprésentantLégalUseCase } from './changement/rejeter/rejeterChangementReprésentantLégal.usecase.js';
import { registerRejeterChangementReprésentantLégalCommand } from './changement/rejeter/rejeterChangementReprésentantLégal.command.js';
import { registerAnnulerChangementReprésentantLégalCommand } from './changement/annuler/annulerChangementReprésentantLégal.command.js';
import { registerAnnulerChangementReprésentantLégalUseCase } from './changement/annuler/annulerChangementReprésentantLégal.usecase.js';
import {
  SupprimerDocumentProjetSensibleCommandDependencies,
  registerSupprimerDocumentProjetSensibleCommand,
} from './changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command.js';
import { registerCorrigerChangementReprésentantLégalUseCase } from './changement/corriger/corrigerChangementReprésentantLégal.usecase.js';
import { registerCorrigerChangementReprésentantLégalCommand } from './changement/corriger/corrigerChangementReprésentantLégal.command.js';
import { registerConsulterChangementReprésentantLegalEnCoursQuery } from './changement/consulter/consulterChangementReprésentantLégalEnCours.query.js';
import {
  ListerHistoriqueReprésentantLégalProjetDependencies,
  registerListerHistoriqueReprésentantLégalProjetQuery,
} from './listerHistorique/listerHistoriqueReprésentantLégalProjet.query.js';
import { registerEnregistrerChangementReprésentantLégalCommand } from './changement/enregistrer/enregistrerChangementReprésentantLégal.command.js';
import { registerEnregistrerChangementReprésentantLégalUseCase } from './changement/enregistrer/enregistrerChangementReprésentantLégal.usecase.js';

export type ReprésentantLégalQueryDependencies = ConsulterReprésentantLégalDependencies &
  ListerChangementReprésentantLégalDependencies &
  ListerHistoriqueReprésentantLégalProjetDependencies;

export type ReprésentantLégalCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
} & SupprimerDocumentProjetSensibleCommandDependencies;

export const registerReprésentantLégalUseCases = ({
  enregistrerDocumentSubstitut,
  getProjetAggregateRoot,
}: ReprésentantLégalCommandDependencies) => {
  registerModifierReprésentantLégalCommand(getProjetAggregateRoot);
  registerModifierReprésentantLégalUseCase();

  registerDemanderChangementReprésentantLégalCommand(getProjetAggregateRoot);
  registerDemanderChangementReprésentantLégalUseCase();

  registerAnnulerChangementReprésentantLégalCommand(getProjetAggregateRoot);
  registerAnnulerChangementReprésentantLégalUseCase();

  registerCorrigerChangementReprésentantLégalCommand(getProjetAggregateRoot);
  registerCorrigerChangementReprésentantLégalUseCase();

  registerAccorderChangementReprésentantLégalUseCase();
  registerAccorderChangementReprésentantLégalCommand(getProjetAggregateRoot);

  registerRejeterChangementReprésentantLégalCommand(getProjetAggregateRoot);
  registerRejeterChangementReprésentantLégalUseCase();

  registerEnregistrerChangementReprésentantLégalCommand(getProjetAggregateRoot);
  registerEnregistrerChangementReprésentantLégalUseCase();

  registerSupprimerDocumentProjetSensibleCommand({
    getProjetAggregateRoot,
    enregistrerDocumentSubstitut,
  });
};

export const registerReprésentantLégalQueries = (
  dependencies: ReprésentantLégalQueryDependencies,
) => {
  registerConsulterRepresentantLegalQuery(dependencies);
  registerConsulterChangementReprésentantLegalQuery(dependencies);
  registerConsulterChangementReprésentantLegalEnCoursQuery(dependencies);
  registerListerChangementReprésentantLégalQuery(dependencies);
  registerListerHistoriqueReprésentantLégalProjetQuery(dependencies);
};
