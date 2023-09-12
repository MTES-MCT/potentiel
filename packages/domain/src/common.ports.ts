import { RawIdentifiantProjet } from './domain.valueType';

export type TypeFichier =
  | 'depot-attestation-constitution-garanties-financieres'
  | 'attestation-constitution-garanties-financieres';

export type TéléverserFichierPort = (data: {
  type: TypeFichier;
  identifiantProjet: RawIdentifiantProjet;
  format: string;
  content: ReadableStream;
}) => Promise<void>;

export type DéplacerFichierPort = (data: {
  identifiantProjet: RawIdentifiantProjet;
  typeFichierActuel: TypeFichier;
  nouveauType: TypeFichier;
}) => Promise<void>;

export type SupprimerFichierPort = (data: {
  type: TypeFichier;
  identifiantProjet: RawIdentifiantProjet;
}) => Promise<void>;

type TemplateEmailTypeEtVariables = {
  type: 'notifier-pp-gf-validé';
  templateId: 12345678910;
  contexte: {
    identifiantProjet: RawIdentifiantProjet;
  };
  message: {
    objet: string;
    destinataires: { email: string; name: string }[];
  };
  variables: {
    nomProjet: string;
    dreal: string;
    dateDépôt: string;
  };
};
export type EnvoyerEmailPort = (data: TemplateEmailTypeEtVariables) => Promise<void>;
