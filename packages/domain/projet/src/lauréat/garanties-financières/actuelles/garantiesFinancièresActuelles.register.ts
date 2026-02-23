import { Find } from '@potentiel-domain/entity';

import { GetProjetAggregateRoot } from '../../../index.js';

import { registerEnregistrerGarantiesFinancièresCommand } from './enregistrer/enregistrerGarantiesFinancières.command.js';
import { registerEnregistrerGarantiesFinancièresUseCase } from './enregistrer/enregistrerGarantiesFinancières.usecase.js';
import { registerEnregistrerAttestationGarantiesFinancièresCommand } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.command.js';
import { registerEnregistrerAttestationGarantiesFinancièresUseCase } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.usecase.js';
import { registerModifierGarantiesFinancièresCommand } from './modifier/modifierGarantiesFinancières.command.js';
import { registerModifierGarantiesFinancièresUseCase } from './modifier/modifierGarantiesFinancières.usecase.js';
import { registerÉchoirGarantiesFinancièresCommand } from './échoir/échoirGarantiesFinancières.command.js';
import { registerConsulterGarantiesFinancièresQuery } from './consulter/consulterGarantiesFinancières.query.js';
import { registerConsulterArchivesGarantiesFinancièresQuery } from './archives/consulter/consulterArchivesGarantiesFinancières.query.js';
import { registerImporterGarantiesFinancièresCommand } from './importer/importerGarantiesFinancières.command.js';

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
  registerConsulterGarantiesFinancièresQuery(dependencies);
  registerConsulterArchivesGarantiesFinancièresQuery(dependencies);
};
