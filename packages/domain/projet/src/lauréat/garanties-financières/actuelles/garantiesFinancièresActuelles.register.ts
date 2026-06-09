import type { Find } from '@potentiel-domain/entity';

import type { GetProjetAggregateRoot } from '../../../index.js';
import { registerListerArchivesGarantiesFinancièresQuery } from './archives/lister/listerArchivesGarantiesFinancières.query.js';
import { registerConsulterGarantiesFinancièresActuellesQuery } from './consulter/consulterGarantiesFinancièresActuelles.query.js';
import { registerEnregistrerGarantiesFinancièresCommand } from './enregistrer/enregistrerGarantiesFinancières.command.js';
import { registerEnregistrerGarantiesFinancièresUseCase } from './enregistrer/enregistrerGarantiesFinancières.usecase.js';
import { registerEnregistrerAttestationGarantiesFinancièresCommand } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.command.js';
import { registerEnregistrerAttestationGarantiesFinancièresUseCase } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.usecase.js';
import { registerImporterGarantiesFinancièresCommand } from './importer/importerGarantiesFinancières.command.js';
import { registerModifierGarantiesFinancièresCommand } from './modifier/modifierGarantiesFinancières.command.js';
import { registerModifierGarantiesFinancièresUseCase } from './modifier/modifierGarantiesFinancières.usecase.js';
import { registerÉchoirGarantiesFinancièresCommand } from './échoir/échoirGarantiesFinancières.command.js';

export type GarantiesFinancièresActuellesQueryDependencies = {
  find: Find;
};

export type GarantiesFinancièresActuellesUseCasesDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerGarantiesFinancièresActuellesUseCases = ({
  getProjetAggregateRoot,
}: GarantiesFinancièresActuellesUseCasesDependencies) => {
  registerImporterGarantiesFinancièresCommand(getProjetAggregateRoot);

  registerModifierGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerModifierGarantiesFinancièresUseCase();

  registerEnregistrerAttestationGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerEnregistrerAttestationGarantiesFinancièresUseCase();

  registerEnregistrerGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerEnregistrerGarantiesFinancièresUseCase();

  registerÉchoirGarantiesFinancièresCommand(getProjetAggregateRoot);
};

export const registerGarantiesFinancièresActuellesQueries = (
  dependencies: GarantiesFinancièresActuellesQueryDependencies,
) => {
  registerConsulterGarantiesFinancièresActuellesQuery(dependencies);
  registerListerArchivesGarantiesFinancièresQuery(dependencies);
};
