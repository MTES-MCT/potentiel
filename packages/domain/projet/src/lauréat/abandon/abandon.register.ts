import { GetProjetAggregateRoot } from '../../index.js';

import { registerAccorderAbandonCommand } from './demande/accorder/accorderAbandon.command.js';
import { registerAccorderAbandonUseCase } from './demande/accorder/accorderAbandon.usecase.js';
import { registerAnnulerAbandonCommand } from './demande/annuler/annulerAbandon.command.js';
import { registerAnnulerAbandonUseCase } from './demande/annuler/annulerAbandon.usecase.js';
import { registerConfirmerAbandonCommand } from './demande/confirmer/confirmerAbandon.command.js';
import { registerConfirmerAbandonUseCase } from './demande/confirmer/confirmerAbandon.usecase.js';
import { registerDemanderAbandonCommand } from './demande/demander/demanderAbandon.command.js';
import { registerDemanderAbandonUseCase } from './demande/demander/demanderAbandon.usecase.js';
import { registerDemanderConfirmationAbandonCommand } from './demande/demanderConfirmation/demanderConfirmationAbandon.command.js';
import { registerDemanderConfirmationAbandonUseCase } from './demande/demanderConfirmation/demanderConfirmationAbandon.usecase.js';
import { registerDemanderPreuveRecandidatureAbandonCommand } from './demanderPreuveRecandidature/demanderPreuveRecandidature.command.js';
import { registerDemanderPreuveRecandidatureAbandonUseCase } from './demanderPreuveRecandidature/demanderPreuveRecandidature.usecase.js';
import {
  ListerHistoriqueAbandonProjetDependencies,
  registerListerHistoriqueAbandonProjetQuery,
} from './lister/listerHistoriqueAbandonProjet.query.js';
import { registerPasserAbandonEnInstructionCommand } from './demande/instruire/passerAbandonEnInstruction.command.js';
import { registerPasserEnInstructionAbandonUseCase } from './demande/instruire/passerAbandonEnInstruction.usecase.js';
import {
  ListerAbandonsAvecRecandidatureÀRelancerQueryDependencies,
  registerListerAbandonsAvecRecandidatureÀRelancerQuery,
} from './demande/lister/listerAbandonsAvecRecandidatureÀRelancer.query.js';
import { registerRejeterAbandonCommand } from './demande/rejeter/rejeterAbandon.command.js';
import { registerRejeterAbandonUseCase } from './demande/rejeter/rejeterAbandon.usecase.js';
import { registerTransmettrePreuveRecandidatureAbandonCommand } from './transmettrePreuveRecandidature/transmettrePreuveRecandidatureAbandon.command.js';
import { registerTransmettrePreuveRecandidatureAbandonUseCase } from './transmettrePreuveRecandidature/transmettrePreuveRecandidatureAbandon.usecase.js';
import {
  ConsulterDemandeAbandonDependencies,
  registerConsulterDemandeAbandonQuery,
} from './demande/consulter/consulterDemandeAbandon.query.js';
import {
  ListerDemandesAbandonDependencies,
  registerListerDemandesAbandonQuery,
} from './demande/lister/listerDemandesAbandon.query.js';
import {
  ConsulterAbandonDependencies,
  registerConsulterAbandonQuery,
} from './consulter/consulterAbandon.query.js';

export type AbandonQueryDependencies = ConsulterDemandeAbandonDependencies &
  ListerDemandesAbandonDependencies &
  ListerHistoriqueAbandonProjetDependencies &
  ListerAbandonsAvecRecandidatureÀRelancerQueryDependencies &
  ConsulterAbandonDependencies;

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
  registerConsulterDemandeAbandonQuery(dependencies);
  registerListerDemandesAbandonQuery(dependencies);
  registerConsulterAbandonQuery(dependencies);
  registerListerAbandonsAvecRecandidatureÀRelancerQuery(dependencies);
  registerListerHistoriqueAbandonProjetQuery(dependencies);
};
