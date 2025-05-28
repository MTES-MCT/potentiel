import { GetProjetAggregateRoot } from '../..';

import { registerAccorderAbandonCommand } from './accorder/accorderAbandon.command';
import { registerAccorderAbandonUseCase } from './accorder/accorderAbandon.usecase';
import { registerConfirmerAbandonCommand } from './confirmer/confirmerAbandon.command';
import { registerConfirmerAbandonUseCase } from './confirmer/confirmerAbandon.usecase';
import { registerDemanderAbandonCommand } from './demander/demanderAbandon.command';
import { registerDemanderAbandonUseCase } from './demander/demanderAbandon.usecase';
import { registerDemanderConfirmationAbandonCommand } from './demanderConfirmation/demanderConfirmationAbandon.command';
import { registerDemanderConfirmationAbandonUseCase } from './demanderConfirmation/demanderConfirmationAbandon.usecase';
import { registerDemanderPreuveRecandidatureAbandonCommand } from './demanderPreuveRecandidature/demanderPreuveRecandidature.command';
import { registerDemanderPreuveRecandidatureAbandonUseCase } from './demanderPreuveRecandidature/demanderPreuveRecandidature.usecase';
import { registerTransmettrePreuveRecandidatureAbandonCommand } from './transmettrePreuveRecandidature/transmettrePreuveRecandidatureAbandon.command';
import { registerTransmettrePreuveRecandidatureAbandonUseCase } from './transmettrePreuveRecandidature/transmettrePreuveRecandidatureAbandon.usecase';

export type AbandonQueryDependencies = {};
//ConsulterAbandonDependencies &
//ListerAbandonDependencies &
//ListerAbandonsAvecRecandidatureÀRelancerQueryDependencies;

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
};

export const registerAbandonQueries = (_dependencies: AbandonQueryDependencies) => {};
