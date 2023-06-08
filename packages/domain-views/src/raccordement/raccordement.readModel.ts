import { ReadModel } from '@potentiel/core-domain';
import { IdentifiantProjetValueType } from '@potentiel/domain';
import { Readable } from 'stream';

export type DossierRaccordementReadModel = ReadModel<
  'dossier-raccordement',
  {
    référence: string;
    dateQualification?: string;
    propositionTechniqueEtFinancière?: {
      dateSignature: string;
      format: string;
    };
    dateMiseEnService?: string;
    accuséRéception?: { format: string };
  }
>;

export type ListeDossiersRaccordementReadModel = ReadModel<
  'liste-dossiers-raccordement',
  {
    références: Array<string>;
  }
>;

export type RésultatRechercheDossierRaccordementReadModel = ReadModel<
  'résultat-recherche-dossier-raccordement',
  {
    identifiantProjet: IdentifiantProjetValueType;
  }
>;

export type PropositionTechniqueEtFinancièreSignéeReadModel = ReadModel<
  'proposition-technique-et-financière-signée',
  { format: string; content: Readable }
>;

export type AccuséRéceptionDemandeComplèteRaccordementReadModel = ReadModel<
  'accusé-réception-demande-compléte-raccordement',
  { format: string; content: Readable }
>;
