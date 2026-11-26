import type { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

export type RécupérerCandidaturesÀImporterPort = (
  instruction: Array<
    { identifiantProjet: IdentifiantProjet.RawType } & Candidature.Instruction.RawType
  >,
) => Promise<{
  démarcheId: string;
  dossiersValides: Array<{
    identifiantProjet: IdentifiantProjet.RawType;
    dépôt: Candidature.Dépôt.RawType;
    détails: Record<string, string>;
    instruction: Candidature.Instruction.RawType;
  }>;
  dossiersInvalides: Array<{ identifiantProjet: IdentifiantProjet.RawType; error: string }>;
}>;
