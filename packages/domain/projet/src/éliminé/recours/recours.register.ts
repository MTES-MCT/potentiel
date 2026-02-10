import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port.js';

import { registerAccorderRecoursCommand } from './accorder/accorderRecours.command.js';
import { registerAccorderRecoursUseCase } from './accorder/accorderRecours.usecase.js';
import { registerAnnulerRecoursCommand } from './annuler/annulerRecours.command.js';
import { registerAnnulerRecoursUseCase } from './annuler/annulerRecours.usecase.js';
import {
  ConsulterDemandeRecoursDependencies,
  registerConsulterDemandeRecoursQuery,
} from './consulter/consulterDemandeRecours.query.js';
import { registerDemanderRecoursCommand } from './demander/demanderRecours.command.js';
import { registerDemanderRecoursUseCase } from './demander/demanderRecours.usecase.js';
import {
  ListerDemandeRecoursDependencies,
  registerListerDemandeRecoursQuery,
} from './lister/listerDemandeRecours.query.js';
import {
  ListerHistoriqueRecoursProjetDependencies,
  registerListerHistoriqueRecoursProjetQuery,
} from './listerHistorique/listerHistoriqueRecoursProjet.query.js';
import { registerRejeterRecoursCommand } from './rejeter/rejeterRecours.command.js';
import { registerRejeterRecoursUseCase } from './rejeter/rejeterRecours.usecase.js';
import { registerPasserRecoursEnInstructionUseCase } from './instruire/passerRecoursEnInstruction.usecase.js';
import { registerPasserRecoursEnInstructionCommand } from './instruire/passerRecoursEnInstruction.command.js';
import {
  ConsulterRecoursDependencies,
  registerConsulterRecoursQuery,
} from './consulter/consulterRecours.query.js';

export type RecoursQueryDependencies = ConsulterDemandeRecoursDependencies &
  ConsulterRecoursDependencies &
  ListerDemandeRecoursDependencies &
  ListerHistoriqueRecoursProjetDependencies;

export type RecoursCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerRecoursUseCases = ({ getProjetAggregateRoot }: RecoursCommandDependencies) => {
  registerDemanderRecoursCommand(getProjetAggregateRoot);
  registerAccorderRecoursCommand(getProjetAggregateRoot);
  registerRejeterRecoursCommand(getProjetAggregateRoot);
  registerAnnulerRecoursCommand(getProjetAggregateRoot);
  registerPasserRecoursEnInstructionCommand(getProjetAggregateRoot);

  registerDemanderRecoursUseCase();
  registerAccorderRecoursUseCase();
  registerRejeterRecoursUseCase();
  registerAnnulerRecoursUseCase();
  registerPasserRecoursEnInstructionUseCase();
};

export const registerRecoursQueries = (dependencies: RecoursQueryDependencies) => {
  registerConsulterDemandeRecoursQuery(dependencies);
  registerConsulterRecoursQuery(dependencies);
  registerListerDemandeRecoursQuery(dependencies);
  registerListerHistoriqueRecoursProjetQuery(dependencies);
};
