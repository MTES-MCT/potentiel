import { LoadAggregate } from '@potentiel-domain/core';

import { registerAccorderAbandonCommand } from './accorder/accorderAbandon.command';
import { registerAccorderAbandonUseCase } from './accorder/accorderAbandon.usecase';
import { registerAnnulerAbandonCommand } from './annuler/annulerAbandon.command';
import { registerAnnulerAbandonUseCase } from './annuler/annulerAbandon.usecase';
import { registerAnnulerRejetAbandonUseCase } from './annulerRejet/annulerRejetAbandon.usecase';
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
import {
  ListerAbandonDependencies,
  registerListerAbandonQuery,
} from './lister/listerAbandon.query';
import { registerRejeterAbandonCommand } from './rejeter/rejeterAbandon.command';
import { registerRejeterAbandonUseCase } from './rejeter/rejeterAbandon.usecase';
import { registerAnnulerRejetAbandonCommand } from './annulerRejet/annulerRejetAbandon.command';
import { registerTransmettrePreuveRecandidatureAbandonCommand } from './transmettre/transmettrePreuveRecandidatureAbandon.command';
import { registerTransmettrePreuveRecandidatureAbandonUseCase } from './transmettre/transmettrePreuveRecandidatureAbandon.usecase';
import { registerDemanderPreuveRecandidatureAbandonCommand } from './demanderPreuveRecandidature/demanderPreuveRecandidatureAbandon.command';
import { registerDemanderPreuveRecandidatureAbandonUseCase } from './demanderPreuveRecandidature/demanderPreuveRecandidatureAbandon.usecase';
import {
  ListerAbandonsAvecRecandidatureÀRelancerQueryDependencies,
  registerListerAbandonsAvecRecandidatureÀRelancerQuery,
} from './lister/listerAbandonAvecRecandidatureÀRelancer.query';
import {
  DétecterAbandonDependencies,
  registerDétecterAbandonQuery,
} from './détecter/détecterAbandon.query';

export type AbandonQueryDependencies = DétecterAbandonDependencies &
  ConsulterAbandonDependencies &
  ListerAbandonDependencies &
  ListerAbandonsAvecRecandidatureÀRelancerQueryDependencies;

export type AbandonCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerAbandonUseCases = ({ loadAggregate }: AbandonCommandDependencies) => {
  registerDemanderAbandonCommand(loadAggregate);
  registerAccorderAbandonCommand(loadAggregate);
  registerConfirmerAbandonCommand(loadAggregate);
  registerDemanderConfirmationAbandonCommand(loadAggregate);
  registerRejeterAbandonCommand(loadAggregate);
  registerAnnulerAbandonCommand(loadAggregate);
  registerAnnulerRejetAbandonCommand(loadAggregate);
  registerTransmettrePreuveRecandidatureAbandonCommand(loadAggregate);
  registerDemanderPreuveRecandidatureAbandonCommand(loadAggregate);

  registerDemanderAbandonUseCase();
  registerAccorderAbandonUseCase();
  registerConfirmerAbandonUseCase();
  registerDemanderConfirmationAbandonUseCase();
  registerRejeterAbandonUseCase();
  registerAnnulerAbandonUseCase();
  registerAnnulerRejetAbandonUseCase();
  registerTransmettrePreuveRecandidatureAbandonUseCase();
  registerDemanderPreuveRecandidatureAbandonUseCase();
};

export const registerAbandonQueries = (dependencies: AbandonQueryDependencies) => {
  registerConsulterAbandonQuery(dependencies);
  registerListerAbandonQuery(dependencies);
  registerListerAbandonsAvecRecandidatureÀRelancerQuery(dependencies);
  registerDétecterAbandonQuery(dependencies);
};
