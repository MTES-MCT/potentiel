import { GetProjetAggregateRoot } from '../..';

import { registerAccorderAbandonCommand } from './demande/accorder/accorderAbandon.command';
import { registerAccorderAbandonUseCase } from './demande/accorder/accorderAbandon.usecase';
import { registerAnnulerAbandonCommand } from './demande/annuler/annulerAbandon.command';
import { registerAnnulerAbandonUseCase } from './demande/annuler/annulerAbandon.usecase';
import { registerConfirmerAbandonCommand } from './demande/confirmer/confirmerAbandon.command';
import { registerConfirmerAbandonUseCase } from './demande/confirmer/confirmerAbandon.usecase';
import { registerDemanderAbandonCommand } from './demande/demander/demanderAbandon.command';
import { registerDemanderAbandonUseCase } from './demande/demander/demanderAbandon.usecase';
import { registerDemanderConfirmationAbandonCommand } from './demande/demanderConfirmation/demanderConfirmationAbandon.command';
import { registerDemanderConfirmationAbandonUseCase } from './demande/demanderConfirmation/demanderConfirmationAbandon.usecase';
import { registerDemanderPreuveRecandidatureAbandonCommand } from './demanderPreuveRecandidature/demanderPreuveRecandidature.command';
import { registerDemanderPreuveRecandidatureAbandonUseCase } from './demanderPreuveRecandidature/demanderPreuveRecandidature.usecase';
import {
  ListerHistoriqueAbandonProjetDependencies,
  registerListerHistoriqueAbandonProjetQuery,
} from './lister/listerHistoriqueAbandonProjet.query';
import { registerPasserAbandonEnInstructionCommand } from './demande/instruire/passerAbandonEnInstruction.command';
import { registerPasserEnInstructionAbandonUseCase } from './demande/instruire/passerAbandonEnInstruction.usecase';
import {
  ListerAbandonsAvecRecandidatureÀRelancerQueryDependencies,
  registerListerAbandonsAvecRecandidatureÀRelancerQuery,
} from './demande/lister/listerAbandonsAvecRecandidatureÀRelancer.query';
import { registerRejeterAbandonCommand } from './demande/rejeter/rejeterAbandon.command';
import { registerRejeterAbandonUseCase } from './demande/rejeter/rejeterAbandon.usecase';
import { registerTransmettrePreuveRecandidatureAbandonCommand } from './transmettrePreuveRecandidature/transmettrePreuveRecandidatureAbandon.command';
import { registerTransmettrePreuveRecandidatureAbandonUseCase } from './transmettrePreuveRecandidature/transmettrePreuveRecandidatureAbandon.usecase';
import {
  ConsulterDemandeAbandonDependencies,
  registerConsulterDemandeAbandonQuery,
} from './demande/consulter/consulterDemandeAbandon.query';
import {
  ListerDemandesAbandonDependencies,
  registerListerDemandesAbandonQuery,
} from './demande/lister/listerDemandesAbandon.query';
import {
  ConsulterAbandonDependencies,
  registerConsulterAbandonQuery,
} from './consulter/consulterAbandon.query';

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
