import { GetProjetAggregateRoot } from '../../getProjetAggregateRoot.port';

import { registerAccorderRecoursCommand } from './accorder/accorderRecours.command';
import { registerAccorderRecoursUseCase } from './accorder/accorderRecours.usecase';
import { registerAnnulerRecoursCommand } from './annuler/annulerRecours.command';
import { registerAnnulerRecoursUseCase } from './annuler/annulerRecours.usecase';
import {
  ConsulterDemandeRecoursDependencies,
  registerConsulterDemandeRecoursQuery,
} from './consulter/consulterDemandeRecours.query';
import { registerDemanderRecoursCommand } from './demander/demanderRecours.command';
import { registerDemanderRecoursUseCase } from './demander/demanderRecours.usecase';
import {
  ListerDemandeRecoursDependencies,
  registerListerDemandeRecoursQuery,
} from './lister/listerDemandeRecours.query';
import {
  ListerHistoriqueRecoursProjetDependencies,
  registerListerHistoriqueRecoursProjetQuery,
} from './listerHistorique/listerHistoriqueRecoursProjet.query';
import { registerRejeterRecoursCommand } from './rejeter/rejeterRecours.command';
import { registerRejeterRecoursUseCase } from './rejeter/rejeterRecours.usecase';
import { registerPasserRecoursEnInstructionUseCase } from './instruire/passerRecoursEnInstruction.usecase';
import { registerPasserRecoursEnInstructionCommand } from './instruire/passerRecoursEnInstruction.command';
import {
  ConsulterRecoursDependencies,
  registerConsulterRecoursQuery,
} from './consulter/consulterRecours.query';

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
