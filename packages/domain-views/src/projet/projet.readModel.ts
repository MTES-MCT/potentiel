import { ReadModel } from '@potentiel/core-domain-views';
import { RawIdentifiantProjet } from '@potentiel/domain';

export type LegacyProjetReadModelKey = `projet|${RawIdentifiantProjet}`;

export type StatutProjet = 'non-notifié' | 'abandonné' | 'classé' | 'éliminé';

export type LegacyProjetReadModel = ReadModel<
  'projet',
  {
    legacyId: string;
    identifiantProjet: RawIdentifiantProjet;
    appelOffre: string;
    période: string;
    famille: string;
    numéroCRE: string;
    statut: StatutProjet;
    nom: string;
    localité: {
      commune: string;
      département: string;
      région: string;
    };
    identifiantGestionnaire?: { codeEIC: string };
  }
>;

export type ProjetReadModelKey = `projet|${RawIdentifiantProjet}`;
export type ProjetReadModel = ReadModel<
  'projet',
  {
    appelOffre: string;
    période: string;
    famille: string;
    numéroCRE: string;
    statut: StatutProjet;
    nom: string;
    localité: {
      commune: string;
      département: string;
      région: string;
    };
    identifiantGestionnaire?: { codeEIC: string };

    dateAbandon?: string;
    recandidature?: boolean;
    piéceJustificative?: {
      format: string;
    };
  }
>;

export type PiéceJustificativeAbandonProjetReadModel = ReadModel<
  'piéce-justificative-abandon-projet',
  { format: string; content: ReadableStream }
>;
