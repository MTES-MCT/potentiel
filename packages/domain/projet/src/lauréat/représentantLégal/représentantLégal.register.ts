import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

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
import { registerAnnulerChangementReprésentantLégalCommand } from './changement/annuler/annulerChangementReprésentantLégal.command';
import { registerAnnulerChangementReprésentantLégalUseCase } from './changement/annuler/annulerChangementReprésentantLégal.usecase';
import {
  SupprimerDocumentProjetSensibleCommandDependencies,
  registerSupprimerDocumentProjetSensibleCommand,
} from './changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';
import { registerCorrigerChangementReprésentantLégalUseCase } from './changement/corriger/corrigerChangementReprésentantLégal.usecase';
import { registerCorrigerChangementReprésentantLégalCommand } from './changement/corriger/corrigerChangementReprésentantLégal.command';
import { registerConsulterChangementReprésentantLegalEnCoursQuery } from './changement/consulter/consulterChangementReprésentantLégalEnCours.query';
import {
  ListerHistoriqueReprésentantLégalProjetDependencies,
  registerListerHistoriqueReprésentantLégalProjetQuery,
} from './listerHistorique/listerHistoriqueReprésentantLégalProjet.query';
import { registerEnregistrerChangementReprésentantLégalCommand } from './changement/enregistrer/enregistrerChangementReprésentantLégal.command';
import { registerEnregistrerChangementReprésentantLégalUseCase } from './changement/enregistrer/enregistrerChangementReprésentantLégal.usecase';

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
