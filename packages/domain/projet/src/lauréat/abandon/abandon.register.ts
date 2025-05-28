import { GetProjetAggregateRoot } from '../..';

import { registerAccorderAbandonCommand } from './accorder/accorderAbandon.command';
import { registerAccorderAbandonUseCase } from './accorder/accorderAbandon.usecase';
import { registerAnnulerAbandonCommand } from './annuler/annulerAbandon.command';
import { registerAnnulerAbandonUseCase } from './annuler/annulerAbandon.usecase';
import { registerConfirmerAbandonCommand } from './confirmer/confirmerAbandon.command';
import { registerConfirmerAbandonUseCase } from './confirmer/confirmerAbandon.usecase';
import {
  ConsulterAbandonDependencies,
  registerConsulterAbandonQuery,
} from './consulter/consulterAbandon.query';
import { registerDemanderAbandonCommand } from './demander/demanderAbandon.command';
import { registerDemanderAbandonUseCase } from './demander/demanderAbandon.usecase';
import { registerDemanderConfirmationAbandonCommand } from './demanderConfirmation/demanderConfirmationAbandon.command';
import { registerDemanderConfirmationAbandonUseCase } from './demanderConfirmation/demanderConfirmationAbandon.usecase';
import { registerDemanderPreuveRecandidatureAbandonCommand } from './demanderPreuveRecandidature/demanderPreuveRecandidature.command';
import { registerDemanderPreuveRecandidatureAbandonUseCase } from './demanderPreuveRecandidature/demanderPreuveRecandidature.usecase';
import { registerPasserAbandonEnInstructionCommand } from './instruire/passerAbandonEnInstruction.command';
import { registerPasserEnInstructionAbandonUseCase } from './instruire/passerAbandonEnInstruction.usecase';
import {
  ListerAbandonDependencies,
  registerListerAbandonQuery,
} from './lister/listerAbandons.query';
import {
  ListerAbandonsAvecRecandidatureÀRelancerQueryDependencies,
  registerListerAbandonsAvecRecandidatureÀRelancerQuery,
} from './lister/listerAbandonsAvecRecandidatureÀRelancer.query';
import { registerRejeterAbandonCommand } from './rejeter/rejeterAbandon.command';
import { registerRejeterAbandonUseCase } from './rejeter/rejeterAbandon.usecase';
import { registerTransmettrePreuveRecandidatureAbandonCommand } from './transmettrePreuveRecandidature/transmettrePreuveRecandidatureAbandon.command';
import { registerTransmettrePreuveRecandidatureAbandonUseCase } from './transmettrePreuveRecandidature/transmettrePreuveRecandidatureAbandon.usecase';

export type AbandonQueryDependencies = ConsulterAbandonDependencies &
  ListerAbandonDependencies &
  ListerAbandonsAvecRecandidatureÀRelancerQueryDependencies;

export type AbandonCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerAbandonUseCases = ({ getProjetAggregateRoot }: AbandonCommandDependencies) => {
  registerDemanderAbandonCommand(getProjetAggregateRoot);
  registerDemanderAbandonUseCase();

  registerAccorderAbandonCommand(getProjetAggregateRoot);
  registerAccorderAbandonUseCase();

  registerDemanderPreuveRecandidatureAbandonCommand(getProjetAggregateRoot);
  registerDemanderPreuveRecandidatureAbandonUseCase();

  registerTransmettrePreuveRecandidatureAbandonCommand(getProjetAggregateRoot);
  registerTransmettrePreuveRecandidatureAbandonUseCase();

  registerDemanderConfirmationAbandonCommand(getProjetAggregateRoot);
  registerDemanderConfirmationAbandonUseCase();

  registerConfirmerAbandonCommand(getProjetAggregateRoot);
  registerConfirmerAbandonUseCase();

  registerPasserAbandonEnInstructionCommand(getProjetAggregateRoot);
  registerPasserEnInstructionAbandonUseCase();

  registerAnnulerAbandonCommand(getProjetAggregateRoot);
  registerAnnulerAbandonUseCase();

  registerRejeterAbandonCommand(getProjetAggregateRoot);
  registerRejeterAbandonUseCase();
};

export const registerAbandonQueries = (dependencies: AbandonQueryDependencies) => {
  registerConsulterAbandonQuery(dependencies);
  registerListerAbandonQuery(dependencies);
  registerListerAbandonsAvecRecandidatureÀRelancerQuery(dependencies);
};
