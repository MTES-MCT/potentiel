import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../projet/projet.valueType';
import { RawRéférenceDossierRaccordement } from './raccordement.valueType';

export type PropositionTechniqueEtFinancièreModifiéeEventV1 = DomainEvent<
  'PropositionTechniqueEtFinancièreModifiée-V1',
  {
    identifiantProjet: RawIdentifiantProjet;
    dateSignature: string;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
  }
>;

export type RaccordementEvent = PropositionTechniqueEtFinancièreModifiéeEventV1;
