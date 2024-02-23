import { LoadAggregate } from '@potentiel-domain/core';
import { registerAccorderRecoursCommand } from './accorder/accorderRecours.command';
import { registerAccorderRecoursUseCase } from './accorder/accorderRecours.usecase';
import { registerAnnulerRecoursCommand } from './annuler/annulerRecours.command';
import { registerAnnulerRecoursUseCase } from './annuler/annulerRecours.usecase';
import {
  ConsulterRecoursDependencies,
  registerConsulterRecoursQuery,
} from './consulter/consulterRecours.query';
import { registerDemanderRecoursCommand } from './demander/demanderRecours.command';
import { registerDemanderRecoursUseCase } from './demander/demanderRecours.usecase';
import {
  ListerRecoursDependencies,
  registerListerRecoursQuery,
} from './lister/listerRecours.query';
import { registerRejeterRecoursCommand } from './rejeter/rejeterRecours.command';
import { registerRejeterRecoursUseCase } from './rejeter/rejeterRecours.usecase';
import {
  DétecterRecoursDependencies,
  registerDétecterRecoursQuery,
} from './détecter/détecterRecours.query';

export type RecoursQueryDependencies = DétecterRecoursDependencies &
  ConsulterRecoursDependencies &
  ListerRecoursDependencies;
export type RecoursCommandDependencies = {
  loadAggregate: LoadAggregate;
};

export const registerRecoursUseCases = ({ loadAggregate }: RecoursCommandDependencies) => {
  registerDemanderRecoursCommand(loadAggregate);
  registerAccorderRecoursCommand(loadAggregate);
  registerRejeterRecoursCommand(loadAggregate);
  registerAnnulerRecoursCommand(loadAggregate);

  registerDemanderRecoursUseCase();
  registerAccorderRecoursUseCase();
  registerRejeterRecoursUseCase();
  registerAnnulerRecoursUseCase();
};

export const registerRecoursQueries = (dependencies: RecoursQueryDependencies) => {
  registerConsulterRecoursQuery(dependencies);
  registerListerRecoursQuery(dependencies);
  registerDétecterRecoursQuery(dependencies);
};
