import type { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';
import { registerAccorderChangementReprésentantLégalCommand } from './changement/accorder/accorderChangementReprésentantLégal.command';
import { registerAccorderChangementReprésentantLégalUseCase } from './changement/accorder/accorderChangementReprésentantLégal.usecase';
import { registerAnnulerChangementReprésentantLégalCommand } from './changement/annuler/annulerChangementReprésentantLégal.command';
import { registerAnnulerChangementReprésentantLégalUseCase } from './changement/annuler/annulerChangementReprésentantLégal.usecase';
import { registerConsulterChangementReprésentantLegalQuery } from './changement/consulter/consulterChangementReprésentantLégal.query';
import { registerConsulterChangementReprésentantLegalEnCoursQuery } from './changement/consulter/consulterChangementReprésentantLégalEnCours.query';
import { registerCorrigerChangementReprésentantLégalCommand } from './changement/corriger/corrigerChangementReprésentantLégal.command';
import { registerCorrigerChangementReprésentantLégalUseCase } from './changement/corriger/corrigerChangementReprésentantLégal.usecase';
import { registerDemanderChangementReprésentantLégalCommand } from './changement/demander/demanderChangementReprésentantLégal.command';
import { registerDemanderChangementReprésentantLégalUseCase } from './changement/demander/demanderChangementReprésentantLégal.usecase';
import { registerEnregistrerChangementReprésentantLégalCommand } from './changement/enregistrer/enregistrerChangementReprésentantLégal.command';
import { registerEnregistrerChangementReprésentantLégalUseCase } from './changement/enregistrer/enregistrerChangementReprésentantLégal.usecase';
import {
  type ListerChangementReprésentantLégalDependencies,
  registerListerChangementReprésentantLégalQuery,
} from './changement/lister/listerChangementReprésentantLégal.query';
import { registerRejeterChangementReprésentantLégalCommand } from './changement/rejeter/rejeterChangementReprésentantLégal.command';
import { registerRejeterChangementReprésentantLégalUseCase } from './changement/rejeter/rejeterChangementReprésentantLégal.usecase';
import {
  registerSupprimerDocumentProjetSensibleCommand,
  type SupprimerDocumentProjetSensibleCommandDependencies,
} from './changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';
import {
  type ConsulterReprésentantLégalDependencies,
  registerConsulterRepresentantLegalQuery,
} from './consulter/consulterReprésentantLégal.query';
import {
  type ListerHistoriqueReprésentantLégalProjetDependencies,
  registerListerHistoriqueReprésentantLégalProjetQuery,
} from './listerHistorique/listerHistoriqueReprésentantLégalProjet.query';
import { registerModifierReprésentantLégalCommand } from './modifier/modifierReprésentantLégal.command';
import { registerModifierReprésentantLégalUseCase } from './modifier/modifierReprésentantLégal.usecase';

export type ReprésentantLégalQueryDependencies = ConsulterReprésentantLégalDependencies &
  ListerChangementReprésentantLégalDependencies &
  ListerHistoriqueReprésentantLégalProjetDependencies;

export type ReprésentantLégalCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
} & SupprimerDocumentProjetSensibleCommandDependencies;

export const registerReprésentantLégalUseCases = ({
  supprimerDocumentProjetSensible,
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
    supprimerDocumentProjetSensible,
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
